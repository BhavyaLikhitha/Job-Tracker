// Quick local benchmark of the dashboard endpoint against in-memory MongoDB.
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import {
  createApp,
  connectDb,
  disconnectDb,
} from "../server/test-utils/app.js";

process.env.JWT_SECRET = "bench-secret";
const mongod = await MongoMemoryServer.create();
await connectDb(mongod.getUri());
const app = createApp();

await request(app)
  .post("/api/users/signup")
  .send({ username: "b", email: "b@b.com", password: "password123" });
const login = await request(app)
  .post("/api/users/login")
  .send({ email: "b@b.com", password: "password123" });
const token = login.body.token;
const auth = `Bearer ${token}`;
const today = new Date().toLocaleDateString("en-CA", {
  timeZone: "America/New_York",
});

// Seed 50 jobs.
for (let i = 0; i < 50; i++) {
  await request(app)
    .post("/api/jobs/add-job")
    .set("Authorization", auth)
    .send({
      companyName: `Co${i}`,
      dateApplied: today,
      jobTitle: "Eng",
      status: "applied",
      source: "without referral",
    });
}

// Warm up, then time N requests.
for (let i = 0; i < 10; i++) {
  await request(app).get("/api/jobs/get-job").set("Authorization", auth);
}

const N = 200;
const times = [];
for (let i = 0; i < N; i++) {
  const t0 = performance.now();
  await request(app).get("/api/jobs/get-job").set("Authorization", auth);
  times.push(performance.now() - t0);
}
times.sort((a, b) => a - b);
const avg = times.reduce((s, t) => s + t, 0) / N;
const p95 = times[Math.floor(N * 0.95)];

console.log(`avg=${avg.toFixed(2)}ms  p95=${p95.toFixed(2)}ms  min=${times[0].toFixed(2)}ms`);

await disconnectDb();
await mongod.stop();
