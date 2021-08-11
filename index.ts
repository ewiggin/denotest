addEventListener("fetch", (event) => {
  event.respondWith(
    new TestController().hello(),
  );
});

class TestController {

  hello(): Response {
    return new Response('hello world martines', { status: 200, headers: 'content-type': 'text/plain' })
  }
}