import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core"; // Make sure this path is correct

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

export const runtime = "nodejs";
