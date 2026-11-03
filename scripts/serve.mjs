import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("out");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".mp3": "audio/mpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
};
http
  .createServer(async (req, res) => {
    try {
      let file = path.resolve(
        root,
        "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
      );
      if (!file.startsWith(root + path.sep) && file !== root) {
        res.writeHead(403).end();
        return;
      }
      if ((await stat(file)).isDirectory())
        file = path.join(file, "index.html");
      const body = await readFile(file);
      const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
      if (range) {
        const start = Number(range[1]);
        const end = Math.min(
          Number(range[2] || body.length - 1),
          body.length - 1,
        );
        if (start > end) {
          res
            .writeHead(416, { "Content-Range": `bytes */${body.length}` })
            .end();
          return;
        }
        res.writeHead(206, {
          "Content-Type":
            types[path.extname(file)] || "application/octet-stream",
          "Accept-Ranges": "bytes",
          "Content-Range": `bytes ${start}-${end}/${body.length}`,
          "Content-Length": end - start + 1,
        });
        res.end(body.subarray(start, end + 1));
        return;
      }
      res.writeHead(200, {
        "Accept-Ranges": "bytes",
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Content-Length": body.length,
      });
      res.end(body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(
        await readFile(path.join(root, "404.html")).catch(() =>
          Buffer.from("Not found"),
        ),
      );
    }
  })
  .listen(3000, "127.0.0.1", () =>
    console.log("ART2FCL static preview: http://127.0.0.1:3000"),
  );
