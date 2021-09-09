const SOURCE = `https://analisi.transparenciacatalunya.cat/resource/a2hm-uzyj.json`;

addEventListener("fetch", async (event) => {
  const api = new ApiController();
  event.respondWith(await api.getData());
});

class ApiController {
  private data: any;
  async getData(): Promise<Response> {
    this.data = await (await fetch(SOURCE)).text();
    return new Response(this.data, { status: 200, headers: {'content-type': 'application/json' }})
  }
}