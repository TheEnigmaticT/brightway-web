const root = import.meta.dir;
const port = Number(Bun.env.PORT ?? 8085);

const buildClient = async () => {
  const result = await Bun.build({
    entrypoints: [`${root}/client.ts`],
    outdir: `${root}/.dev`,
    target: "browser",
    sourcemap: "inline",
    minify: false,
  });

  if (!result.success) {
    console.error("Failed to build client bundle");
    result.logs.forEach((log) => console.error(log.message));
  }
};

await buildClient();

const mimeTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
};

const server = Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Serve client.js from root first, fall back to .dev/
    if (pathname === "/client.js") {
      const rootFile = Bun.file(`${root}/client.js`);
      if (await rootFile.exists()) {
        return new Response(rootFile, {
          headers: { "content-type": "text/javascript; charset=utf-8" },
        });
      }
      return new Response(Bun.file(`${root}/.dev/client.js`), {
        headers: { "content-type": "text/javascript; charset=utf-8" },
      });
    }

    // Try exact file first
    let filePath = `${root}${pathname}`;
    let file = Bun.file(filePath);
    if (await file.exists() && !filePath.endsWith("/")) {
      const ext = pathname.substring(pathname.lastIndexOf("."));
      const contentType = mimeTypes[ext] || "application/octet-stream";
      return new Response(file, { headers: { "content-type": contentType } });
    }

    // Directory: try index.html
    if (pathname.endsWith("/")) {
      filePath = `${root}${pathname}index.html`;
    } else {
      filePath = `${root}${pathname}/index.html`;
    }

    file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Brightway dev server running on http://localhost:${server.port}`);
