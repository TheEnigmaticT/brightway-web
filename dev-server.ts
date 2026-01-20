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

const server = Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/images/")) {
      const filePath = `${root}${url.pathname}`;
      const file = Bun.file(filePath);
      if (await file.exists()) {
        return new Response(file);
      }
      return new Response("Not found", { status: 404 });
    }
    switch (url.pathname) {
      case "/":
        return new Response(Bun.file(`${root}/index.html`), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      case "/styles.css":
        return new Response(Bun.file(`${root}/styles.css`), {
          headers: { "content-type": "text/css; charset=utf-8" },
        });
      case "/client.js":
        {
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
      default:
        return new Response("Not found", { status: 404 });
    }
  },
});

console.log(`Brightway dev server running on http://localhost:${server.port}`);
