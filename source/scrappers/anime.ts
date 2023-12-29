import { HTMLElement } from "node-html-parser";
import config from "../config.js"
import { ValidationError, HTML_PARSING_ERROR } from "../errors.js";
import { fetchResource } from "./fetch.js";
export type AlternativeTitle = {
    Id: string;
    Name: string;
    Type: string;
}
export type Anime = {
    Title: string,
    AlternativeNames: string[],
    Reviews: {
        Review: number,
        Number: number
    },
    AlternativeTitles: AlternativeTitle[],
    Type: string,
    Image: string,
    Id: string,
    Genders: string[] | undefined,
    OnGoing: boolean,
    Episodes: Episode[],
    Followers: number
    Description: string
}

export async function GetAnimeInfo(Query: string): Promise<Anime> {
    if (!Query)
        throw new ValidationError("Se requiere una Query para obtener el Anime", { Query: true })
    const $ = await fetchResource({ resource: config.baseURL + config.anime + Query });
    // Ficha
    const $Ficha = $.querySelector('.Ficha');
    if (!$Ficha)
        throw new HTML_PARSING_ERROR(".Ficha", "anime.ts", "GetAnimeInfo", "$Ficha");

    // Getting Title
    const Title = $Ficha.querySelector(".Title")?.innerText ?? "";

    // Getting another names from AnimeFLV
    const AlternativeNames: string[] = [];
    const $Names = $Ficha.querySelectorAll("span.TxtAlt");

    if ($Names.length > 0)
        $Names.forEach((el) => AlternativeNames.push(el.innerText));

    let Type = $Ficha.querySelector(".Type")?.innerText ?? "";

    // Reviews from AnimeFLV
    let Reviews = {
        Review: 0,
        Number: 0
    }

    let Review: string = $.getElementById("votes_prmd")
        .innerText ?? '0';
    Reviews.Review = Number(Review);

    let RNumber: string = $Ficha.getElementById("votes_nmbr")
        .innerText ?? "0";
    Reviews.Number = Number(RNumber);

    const $Body = $.querySelector(".Container aside");
    if (!$Body)
        throw new HTML_PARSING_ERROR(".Body", "anime.ts", "GetAnimeInfo", "$Body");
    const Image = $Body.querySelector(".Image img")?.getAttribute('src') ?? "";

    const OnGoing = ($Body.querySelector(".AnmStts span")?.innerText ?? '') === "En emision";

    let SFollowers = $Body.querySelector(".WdgtCn .Title span")?.innerText ?? "0";

    let Followers = Number(SFollowers);

    // Generos y descripcion
    const $Main = $.querySelector(".Main");
    if (!$Main)
        throw new HTML_PARSING_ERROR(".Main", "anime.ts", "GetAnimeInfo", "$Main");
    const $Tags = $Main.querySelectorAll(".Nvgnrs a");

    const alternativeTitles = AlternativeTitles($)
    const Genders: string[] = [];
    if ($Tags.length > 0)
        $Tags.forEach(tag => Genders.push(tag.innerText));

    const Description = $Main.querySelector(".Description p")?.innerHTML ?? "";

    const Episodes = await GetEpisodes({ $ });
    return { Title, AlternativeNames, Reviews, Type, Image, OnGoing, Followers, Genders, Description, Episodes, AlternativeTitles: alternativeTitles, Id: Query }

}

function AlternativeTitles($: HTMLElement): AlternativeTitle[] {
    const $container = $.querySelectorAll('main.Main ul.ListAnmRel li');
    if ($container.length == 0) {
        return [];
    }

    return $container.map($li => {
        const $link = $li.querySelector('a');
        if (!$link)
            throw new HTML_PARSING_ERROR('ul.ListAnmRel li a', 'anime.ts', 'AlternativeNames', '$link');
        const Id = $link.getAttribute('href') ?? "";
        const Name = $link.innerText ?? "";
        const Type = $li.innerText ?? "";

        return {
            Id,
            Name,
            Type
        }
    })
}

type Episode = {
    Id: string,
    Image: string
}

export async function GetEpisodes({ $, anime_id }: { $?: HTMLElement, anime_id?: string }): Promise<Episode[]> {
    if (!$ && !anime_id)
        throw new ValidationError("Se requiere un elemento de paetición o un anime para buscar sus episodios", { $, anime_id });
    if (!$ && anime_id)
        $ = await fetchResource({
            resource: config.baseURL + config.anime + anime_id
        });


    const scripts = $?.querySelectorAll("script:not([src])");

    let FScript: string = "";
    scripts?.forEach(script => {
        const Text = script.innerHTML;
        if (!Text.includes("episodes") || !Text)
            return;
        FScript = Text;
    })
    if (!FScript.length)
        throw new HTML_PARSING_ERROR('Source Script', 'anime.ts', 'GetEpisodes', 'FScript');
    // @ts-ignore
    let var_lines: [Array<string>, Array<number>] =
        FScript.split("\n")
            .filter((line: string) => line.includes("var"))
            .slice(0, 2)
            .map((l: string) => l
                .split("=")[1]
                .replace(";", "")
            ).map(l => JSON.parse(l))

    const Eps = OrderArray(var_lines)

    // Ahora sacaremos que la informacion del anime para
    // Construir urls

    return Eps.episodes.map(e => {
        const Image = config.cdn.screenshot + Eps.meta.id + "/" + e.episodeNumber + "/th_3.jpg" ?? ""
        const Id = `${Eps.meta.url}-${e.episodeNumber}` ?? ""
        return { Image, Number: e.episodeNumber, Id }
    })
}

function OrderArray([AnimeInfo, episodeArr]: [Array<string>, Array<number>]) {
    
    const episodes = episodeArr.map((e) => ({
        // @ts-ignore
        episodeNumber: e[0],
        // @ts-ignore
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
