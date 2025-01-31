import request from "supertest";
import { createServer } from "../server"; // Import the app instance
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

let app: ReturnType<typeof createServer>;

beforeAll(() => {
  app = createServer();
});

describe("🔗 End-to-End Tests for URL Shortener API", () => {
  let shortUrl: string;
  let shortId: string;

  it("✅ Should shorten a URL", async () => {
    const response = await request(app)
      .post("/shorten")
      .send({ longUrl: "https://example.com" });

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("shortUrl");

    shortUrl = response.body.shortUrl;
    shortId = shortUrl.split("/").pop() as string;
  });

  it("✅ Should redirect to the original URL", async () => {
    const response = await request(app).get(`/${shortId}`).expect(302);
    expect(response.headers.location).toBe("https://example.com");
  });

  it("❌ Should return 404 for a non-existent short ID", async () => {
    const response = await request(app).get("/nonExistentId");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Not found");
  });

  it("❌ Should return 400 when no URL is provided", async () => {
    const response = await request(app).post("/shorten").send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("URL is required");
  });
});
