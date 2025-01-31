import supertest from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { createServer } from "../server";

let app: ReturnType<typeof createServer>;

beforeAll(() => {
  app = createServer();
});

describe("Server", () => {
  it("should shorten a URL", async () => {
    await supertest(app)
      .post("/shorten")
      .send({ longUrl: "https://example.com" })
      .expect(200)
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("should redirect to the original URL", async () => {
    const { body } = await supertest(app)
      .post("/shorten")
      .send({ longUrl: "https://example.com" });

    const shortId = body.shortUrl.split("/").pop();

    const redirectResponse = await supertest(app)
      .get(`/${shortId}`)
      .expect(302);
    expect(redirectResponse.headers.location).toBe("https://example.com");
  });

  it("should return 404 for non-existent short ID", async () => {
    const response = await supertest(app).get("/invalidId");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Not found");
  });
});
