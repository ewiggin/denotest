import { Handlebars } from 'https://deno.land/x/handlebars/mod.ts';

const SOURCE = `https://analisi.transparenciacatalunya.cat/resource/a2hm-uzyj.json`;

type IData = {
  resum: string;
  data_pub: string;
  nom_ens: string;
  enlla: {
    url: string;
  };
  estat: string;
}

class ApiController {

  private data: IData | BodyInit | undefined = undefined;

  async getData(): Promise<Response> {
    this.data = await (await fetch(SOURCE)).text();
    return new Response(this.data, { status: 200, headers: {'content-type': 'application/json' }})
  }

  async viewData(): Promise<Response> {
    this.data = await (await fetch(SOURCE)).json();
    return new Response(await new ViewRender().render('index', { data: this.data }, 'main'), { status: 200, headers: {'content-type': 'text/html' }})
  }

}

class ViewRender {
  private engine: Handlebars = new Handlebars({
    baseDir: `${Deno.cwd()}/views`,
    extname: ".hbs",
    layoutsDir: "layouts/",
    partialsDir: "partials/",
    cachePartials: true,
    defaultLayout: "main",
    helpers: {
      date: (str: string) => {
          return new Date(str).toLocaleString('es-ES', { dateStyle: 'short' })
      },
    },
    compilerOptions: undefined,
  });
  
  async render(view: string, context: Record<string, unknown>, layout: string) {
    context.data = (context.data as IData[])
      .filter((item) => ['TERMINI_PENDENT', 'TERMINI_OBERT'].includes(item.estat))
      .sort((a: IData, b: IData) => new Date(b.data_pub) - new Date(a.data_pub));
    return await this.engine.renderView(view, context, layout);
  }
}

addEventListener("fetch", async (event) => {
  const api = new ApiController();
  event.respondWith(await api.viewData());
});

/* console.log(await new ViewRender().render('index', { data: [{"resum":"4 places de Monitor de natació","data_pub":"2018-04-26T00:00:00.000","enlla":{"url":"http://cido.diba.cat/oposicions/7769693"},"codi_ens":"2500300000","nom_ens":"Ajuntament d'Agramunt","estat":"NO_VIGENT","latitud":"41.7870354","longitud":"1.0988124","geocoded":{"type":"Point","coordinates":[1.0988124,41.7870354]},":@computed_region_bh64_c7uy":"726",":@computed_region_wvic_k925":"17"}] }, 'main'));
console.log(await new ApiController().viewData()); */