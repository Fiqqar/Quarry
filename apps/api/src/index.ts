import { Elysia } from "elysia";

const port = Number(Bun.env.API_PORT ?? 3001);

const app = new Elysia()
  .get("/", () => ({
    name: "quarry-api",
    status: "ok",
  }))
  .listen(port);

console.log(`Quarry API listening on ${app.server?.hostname}:${app.server?.port}`);
