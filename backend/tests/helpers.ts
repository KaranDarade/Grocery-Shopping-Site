import app from "../src/app.js";
import http from "http";

export function createTestServer() {
  const server = http.createServer(app);
  return server;
}
