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

describe("update-job-sponsorship", () => {
  it("updates a job's sponsorship field", async () => {
    const created = await addJob({ companyName: "SponsorCo" });
    const jobId = created.body._id;

    const res = await request(app)
      .put("/api/jobs/update-job-sponsorship")
      .set("Authorization", `Bearer ${token}`)
      .send({ jobId, sponsorship: "yes" });
    expect(res.status).toBe(200);
    expect(res.body.updatedJob.sponsorship).toBe("yes");
  });

  it("returns 400 when jobId or sponsorship is missing", async () => {
    const res = await request(app)
      .put("/api/jobs/update-job-sponsorship")
      .set("Authorization", `Bearer ${token}`)
      .send({ jobId: "someid" });
    expect(res.status).toBe(400);
  });

  it("returns 404 for a non-existent job", async () => {
    const fakeId = "000000000000000000000001";
    const res = await request(app)
      .put("/api/jobs/update-job-sponsorship")
      .set("Authorization", `Bearer ${token}`)
      .send({ jobId: fakeId, sponsorship: "no" });
    expect(res.status).toBe(404);
  });
});

describe("update-job", () => {
  it("updates all fields of an existing job", async () => {
    const created = await addJob({ companyName: "OldCo" });
    const id = created.body._id;

    const res = await request(app)
      .put(`/api/jobs/update-job/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        companyName: "NewCo",
        dateApplied: todayNY(),
        jobTitle: "Engineer",
        status: "applied",
        source: "without referral",
      });
    expect(res.status).toBe(200);
    expect(res.body.companyName).toBe("NewCo");
    expect(res.body.jobTitle).toBe("Engineer");
  });

  it("returns 400 when required fields are missing", async () => {
    const created = await addJob();
    const id = created.body._id;

    const res = await request(app)
      .put(`/api/jobs/update-job/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ companyName: "X", source: "without referral" }); // missing jobTitle
    expect(res.status).toBe(400);
  });

  it("returns 400 when source is referral but referralName is absent", async () => {
    const created = await addJob();
    const id = created.body._id;

    const res = await request(app)
      .put(`/api/jobs/update-job/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        companyName: "X",
        jobTitle: "Dev",
        source: "referral",
        referralName: "  ",
        dateApplied: todayNY(),
        status: "applied",
      });
    expect(res.status).toBe(400);
  });

  it("returns 404 when the job does not belong to the user", async () => {
    const fakeId = "000000000000000000000002";
    const res = await request(app)
      .put(`/api/jobs/update-job/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        companyName: "X",
        jobTitle: "Dev",
        source: "without referral",
        dateApplied: todayNY(),
        status: "applied",
      });
    expect(res.status).toBe(404);
  });
});

describe("delete-job", () => {
  it("deletes an existing job and reduces the total count", async () => {
    const created = await addJob({ companyName: "DeleteMe" });
    const id = created.body._id;

    const before = await request(app)
      .get("/api/jobs/get-job")
      .set("Authorization", `Bearer ${token}`);
    const countBefore = before.body.totalJobs;

    const del = await request(app)
      .delete(`/api/jobs/delete-job/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(del.status).toBe(200);

    const after = await request(app)
      .get("/api/jobs/get-job")
      .set("Authorization", `Bearer ${token}`);
    expect(after.body.totalJobs).toBe(countBefore - 1);
  });

  it("returns 404 when the job does not exist", async () => {
    const fakeId = "000000000000000000000003";
    const res = await request(app)
      .delete(`/api/jobs/delete-job/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe("auth error paths", () => {
  it("returns 404 when logging in with an unknown email", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "nobody@example.com", password: "password123" });
    expect(res.status).toBe(404);
  });

  it("returns 401 when logging in with the wrong password", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "tester@example.com", password: "wrongpassword" });
    expect(res.status).toBe(401);
  });
});
