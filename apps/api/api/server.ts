import bp from "body-parser";
import express, { Request, type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const { json, urlencoded } = bp;
const prisma = new PrismaClient();

function nanoid(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

interface ShortenRequest extends Request {
  body: {
    longUrl: string;
  };
}

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .post("/shorten", async (req: ShortenRequest, res) => {
      const { longUrl } = req.body;
      if (!longUrl) return res.status(400).json({ error: "URL is required" });

      const UrlSchema = z.string().url();
      try {
        const parsedUrl = UrlSchema.parse(longUrl);
        console.log("Validation passed: ", parsedUrl);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation failed: ", error.issues[0]);
          return res.status(400).json({ error: error.issues[0] });
        } else {
          console.error("Unexpected error: ", error);
          return res.status(400).json({
            error: "Something unexpected happened, please try again later.",
          });
        }
      }

      const shortId = nanoid(4);
      const newUrl = await prisma.shortURL.create({
        data: { shortId, longUrl },
      });

      res.json({
        shortUrl: `${req.protocol}://${req.get("host")}/${newUrl.shortId}`,
      });
    })
    .get("/urls", async (req, res) => {
      try {
        const urls = await prisma.shortURL.findMany({
          orderBy: { createdAt: "desc" },
        });
        const enrichedUrls = urls.map((url) => ({
          ...url,
          shortUrl: `${req.protocol}://${req.get("host")}/${url.shortId}`,
        }));
        res.status(200).json(enrichedUrls);
      } catch (error) {
        console.error("Error fetching URLs:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    })
    .get(
      "/:shortened_id",
      async (req: Request<{ shortened_id: string }>, res) => {
        const { shortened_id } = req.params;

        const entry = await prisma.shortURL.findUnique({
          where: { shortId: shortened_id },
        });

        if (!entry) return res.status(404).json({ error: "Not found" });

        res.redirect(entry.longUrl);
      }
    );
  return app;
};
