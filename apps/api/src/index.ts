import { app } from "./app";
import { env } from "./config/env";

const server = app.listen(env.apiPort);

console.log(`Quarry API listening on ${server.server?.hostname}:${server.server?.port}`);
