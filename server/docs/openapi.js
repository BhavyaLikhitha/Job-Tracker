// OpenAPI 3.0 description of the Job Tracker API. Served interactively at
// /api-docs via swagger-ui-express. Kept as a JS object so no YAML parser is
// needed at runtime.

const job = {
  type: "object",
  properties: {
    _id: { type: "string", example: "665f1a2b3c4d5e6f7a8b9c0d" },
    userId: { type: "string" },
    companyName: { type: "string", example: "Tesla" },
    dateApplied: { type: "string", example: "2026-06-04" },
    jobTitle: { type: "string", example: "Data Scientist" },
    status: {
      type: "string",
      enum: ["applied", "rejected", "interview going on", "Job"],
    },
    source: { type: "string", enum: ["referral", "without referral"] },
    referralName: { type: "string" },
  },
};

const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Job Tracker API",
    version: "1.0.0",
    description:
      "REST API for ApplyTrack — track job applications, stats, and streaks.",
  },
  servers: [
    { url: "http://localhost:3000", description: "Local" },
    {
      url: "https://job-tracker-api-rho.vercel.app",
      description: "Production",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: { Job: job },
  },
  paths: {
    "/health": {
      get: {
        summary: "Liveness probe",
        tags: ["System"],
        responses: { 200: { description: "Service is up" } },
      },
    },
    "/api/users/signup": {
      post: {
        summary: "Register a new user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered" },
          500: { description: "Error signing up" },
        },
      },
    },
    "/api/users/login": {
      post: {
        summary: "Log in and receive a JWT",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", format: "password" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful (returns token, userId, username)" },
          401: { description: "Invalid credentials" },
          404: { description: "User not found" },
        },
      },
    },
    "/api/jobs/get-job": {
      get: {
        summary: "List the current page of jobs plus dashboard stats",
        tags: ["Jobs"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1, minimum: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10, minimum: 1, maximum: 100 },
          },
        ],
        responses: {
          200: {
            description: "Paginated jobs and stat counts",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    jobs: { type: "array", items: { $ref: "#/components/schemas/Job" } },
                    jobsAppliedToday: { type: "integer" },
                    totalRejected: { type: "integer" },
                    interviewsOngoing: { type: "integer" },
                    streak: { type: "integer" },
                    totalJobs: { type: "integer" },
                    totalPages: { type: "integer" },
                    currentPage: { type: "integer" },
                  },
                },
              },
            },
          },
          401: { description: "Missing token" },
        },
      },
    },
    "/api/jobs/search-job": {
      get: {
        summary: "Search jobs by company name (prefix, case-insensitive)",
        tags: ["Jobs"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "query", in: "query", required: true, schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: { description: "Paginated search results" },
          400: { description: "Missing query" },
        },
      },
    },
    "/api/jobs/add-job": {
      post: {
        summary: "Add a new job application",
        tags: ["Jobs"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/Job" } },
          },
        },
        responses: {
          201: { description: "Created job" },
          400: { description: "Missing required fields" },
        },
      },
    },
    "/api/jobs/update-job-status": {
      put: {
        summary: "Update a job's status",
        tags: ["Jobs"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["jobId", "status"],
                properties: {
                  jobId: { type: "string" },
                  status: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Status updated" },
          404: { description: "Job not found" },
        },
      },
    },
  },
};

export default openapiSpec;
