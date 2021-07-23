addEventListener("fetch", (event) => {
  event.respondWith(
    new Response("Hello world martines", {
      status: 200,
      headers: { "content-type": "text/plain" },
    }),
  );
});
