import config from "../config.js"
import { ValidationError } from "../errors.js";
import { fetchResource } from "./fetch.js";

export async function GetAnimeInfo(Query) {
    if(!Query)
        throw new ValidationError("Se requiere una Query para obtener el Anime", {Query: true})
        
    const $ = await fetchResource({resource: config.baseURL + config.anime + Query});

    // Ficha
    const $Ficha = $(".Ficha").first();

    // Getting Title
    const Title = $Ficha.find(".Title")
        .first()
        .text();

    // Getting another names from AnimeFLV
    const Names = [];
    const $Names = $Ficha.find("span.TxtAlt");

    if ($Names.length > 0)
        $Names.each((i, _name) => Names.push($(_name).text()));

    let Type = $Ficha.find(".Type")
        .first()
        .text()

    // Reviews from AnimeFLV
    let Reviews = {
        Review: 0,
        Number: 0
    }

    Reviews.Review = $Ficha.find("#votes_prmd")
        .text();

    if (Reviews.Review == "") Reviews.Review = 0;
    else Reviews.Review = Number(Reviews.Review);

    Reviews.Number = $Ficha.find("#votes_nmbr")
        .text();

    if (Reviews.Number == "") Reviews.Number = 0;
    else Reviews.Number = Number(Reviews.Number);

    const $Body = $(".Container aside");

    const Image = $Body.find(".Image img")
        .attr("src");

    const OnGoing = $Body.find(".AnmStts span")
        .text() == "En emision";

    let Followers = $Body.find(".WdgtCn .Title span")
        .text();

    Followers = Followers == "" ? 0 : Number(Followers);

    // Generos y descripcion
    const $Main = $(".Main");
    const $Tags = $Main.find(".Nvgnrs a");


    const Genders = [];
    if ($Tags.length > 0)
        $Tags.each((_, _tag) => Genders.push($(_tag).text()));

    const Description = $Main.find(".Description p")
        .text()

    const Episodes = await GetEpisodes({ $ });
    return { Title, Alternative_Names: Names, Reviews, Type, Image, OnGoing, Followers, Genders, Description, Episodes }

}


/**
 * 
 * @param {{$: import("cheerio").CheerioAPI, anime_id?: string}} param0 
 */
export async function GetEpisodes({ $, anime_id }) {
    if(!$ && !anime_id)
        throw new ValidationError("Se requiere un elemento de Cheerio o un anime para buscar sus episodios", {$, anime_id});
    if (!$ && anime_id) {
        const request = fetch(config.baseURL + config.anime + anime_id)
        const response = await request.text();
        $ = load(response);
    }

    const scripts = $("script");

    let noTagScripts = []
    scripts.each((_, _el) => {
        const script = $(_el);
        if (!script.attr("src"))
            noTagScripts.push(script)
    })

    const definitiveScript = $(noTagScripts[3])
        .text()
        .trim();

    let var_lines = definitiveScript
        .split("\n")
        .filter(line => line.includes("var"))
        .slice(0, 2)
        .map(l => l
            .split("=")[1]
            .replace(";", "")
        ).map(l => JSON.parse(l))
    
    const Eps = OrderArray(var_lines)
    
    // Ahora sacaremos que la informacion del anime para
    // Construir urls

    return Eps.episodes.map(e => {
        const Image = config.cdn.screenshot + Eps.meta.id + "/" + e.episodeNumber + "/th_3.jpg"
        const Id = `${Eps.meta.url}-${e.episodeNumber}`
        return {Image, Number: e.episodeNumber, Id}
    })
}


function OrderArray(array){
    const AnimeInfo = array[0];
    const episodes = array[1].map(e => ({
        episodeNumber: e[0],
        episodeId: e[1]
    }))
    return {
        meta: {
            id: AnimeInfo[0],
            name: AnimeInfo[1],
            url: AnimeInfo[2]
        },
        episodes
    }
}
