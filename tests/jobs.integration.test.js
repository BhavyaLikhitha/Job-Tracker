import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
} from "vitest";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  createApp,
  connectDb,
  disconnectDb,
} from "../server/test-utils/app.js";

// End-to-end API tests against a real (in-memory) MongoDB. Exercises auth,
// the aggregation-backed list/stats endpoint, pagination, search, and updates.

let mongod;
let app;
let token;

const todayNY = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });

const addJob = (overrides = {}) =>
  request(app)
    .post("/api/jobs/add-job")
    .set("Authorization", `Bearer ${token}`)
    .send({
      companyName: "Tesla",
      dateApplied: todayNY(),
      jobTitle: "Data Scientist",
      status: "applied",
      source: "without referral",
      ...overrides,
    });

beforeAll(async () => {
  process.env.JWT_SECRET = "test-secret";
  mongod = await MongoMemoryServer.create();
  await connectDb(mongod.getUri());
  app = createApp();

  await request(app).post("/api/users/signup").send({
    username: "Tester",
    email: "tester@example.com",
    password: "password123",
  });
  const res = await request(app).post("/api/users/login").send({
    email: "tester@example.com",
    password: "password123",
  });
  token = res.body.token;
}, 120000);

afterAll(async () => {
  await disconnectDb();
  await mongod.stop();
});

describe("auth", () => {
  it("issues a token on login", () => {
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
  });

  it("rejects job requests without a token (401)", async () => {
    const res = await request(app).get("/api/jobs/get-job");
    expect(res.status).toBe(401);
  });

  it("rejects an invalid token (403)", async () => {
    const res = await request(app)
      .get("/api/jobs/get-job")
      .set("Authorization", "Bearer not-a-real-token");
    expect(res.status).toBe(403);
  });
});

describe("get-job stats and pagination", () => {
  it("returns an empty, well-formed payload when there are no jobs", async () => {
    const res = await request(app)
      .get("/api/jobs/get-job")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      jobs: [],
      jobsAppliedToday: 0,
      totalRejected: 0,
      interviewsOngoing: 0,
      streak: 0,
      totalJobs: 0,
      totalPages: 1,
      currentPage: 1,
    });
  });

  it("creates a job and reflects it in the list and stats", async () => {
    const created = await addJob();
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({
      companyName: "Tesla",
      jobTitle: "Data Scientist",
      status: "applied",
    });

    const res = await request(app)
      .get("/api/jobs/get-job")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.totalJobs).toBe(1);
    expect(res.body.jobs).toHaveLength(1);
    expect(res.body.jobsAppliedToday).toBe(1); // dated today (NY)
    expect(res.body.streak).toBeGreaterThanOrEqual(1);
  });

  it("paginates at the requested limit", async () => {
    // 1 job already exists; add 11 more for 12 total.
    for (let i = 0; i < 11; i++) {
      await addJob({ companyName: `Company${i}` });
    }

    const page1 = await request(app)
      .get("/api/jobs/get-job?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);
    expect(page1.body.totalJobs).toBe(12);
    expect(page1.body.totalPages).toBe(2);
    expect(page1.body.jobs).toHaveLength(10);
    expect(page1.body.currentPage).toBe(1);

    const page2 = await request(app)
      .get("/api/jobs/get-job?page=2&limit=10")
      .set("Authorization", `Bearer ${token}`);
    expect(page2.body.jobs).toHaveLength(2);
    expect(page2.body.currentPage).toBe(2);
  });
});

describe("search-job", () => {
  it("requires a query", async () => {
    const res = await request(app)
      .get("/api/jobs/search-job")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });

  it("matches companies by case-insensitive prefix", async () => {
    const res = await request(app)
      .get("/api/jobs/search-job?query=tes")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totalJobs).toBeGreaterThanOrEqual(1);
    expect(res.body.jobs.every((j) => /^tes/i.test(j.companyName))).toBe(true);
  });
});

describe("update-job-status", () => {
  it("updates a job's status and reflects it in the rejected count", async () => {
    const list = await request(app)
      .get("/api/jobs/get-job")
      .set("Authorization", `Bearer ${token}`);
    const jobId = list.body.jobs[0]._id;

    const updated = await request(app)
      .put("/api/jobs/update-job-status")
      .set("Authorization", `Bearer ${token}`)
      .send({ jobId, status: "rejected" });
    expect(updated.status).toBe(200);

    const after = await request(app)
      .get("/api/jobs/get-job")
      .set("Authorization", `Bearer ${token}`);
    expect(after.body.totalRejected).toBeGreaterThanOrEqual(1);
  });

  it("returns 400 when jobId or status is missing", async () => {
    const res = await request(app)
      .put("/api/jobs/update-job-status")
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "rejected" });
    expect(res.status).toBe(400);
  });
});
