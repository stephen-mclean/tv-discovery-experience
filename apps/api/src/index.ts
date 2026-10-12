import "./env.js";
import { createServer } from "./server.js";

const port = Number(process.env.PORT ?? 3001);

createServer().listen(port, () => {
  console.log(`api listening on http://localhost:${port}`);
});
