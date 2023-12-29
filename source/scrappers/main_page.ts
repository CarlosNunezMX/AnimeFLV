import { HTMLElement } from "node-html-parser";
import config from "../config.js";
import { fetchResource } from "./fetch.js";
export type HomeElement = {
    Id: string,
    Image: string,
    Type: string
    Title: string,
    Review: number
    Description: string
}

export interface Episode extends Omit<HomeElement, "Description" | "Review" | "Type">{
    Anime: string
}
export async function GetHome(){
    const request = await fetchResource({
        resource: config.baseURL
    })

    const Series = await GetNewSeries(request)
    const Episodes =  await GetNewEpisodes(request);
    return {
        Series,
        Episodes
    }
};

export async function GetNewSeries(request?: HTMLElement){
    if(!request)
        request = await fetchResource({resource: config.baseURL});
    const $SeriesAnimeList = request.querySelectorAll(".ListAnimes li article.Anime")
    const Animes: HomeElement[] = [];
    $SeriesAnimeList.forEach($anime => {
        // @ts-ignore
        let Result: HomeElement = {};
        Result.Id = $anime.querySelector("a")?.getAttribute("href")?.replace("/anime/", "") ?? "";
        Result.Image = $anime.querySelector(".Image figure img")?.getAttribute("src") ?? "";
        Result.Image = Result.Image.includes('https://www3.animeflv.net') ? Result.Image ? config.baseURL + Result.Image;
        Result.Type = $anime.querySelector(".Image .Type")?.innerText ?? ""
        Result.Title = $anime.querySelector(".Title")?.innerText ?? "";
        let Review = $anime.querySelector(".Vts")?.innerText ?? "0"
        
        Result.Review = Number(Review)
        Result.Description = $anime
            .querySelectorAll(".Description p")[1]
            .innerText;
        Animes.push(Result)
    })
    return Animes
}

/**
 * 
 * @param {import("node-html-parser").HTMLElement?} request 
 */


export async function GetNewEpisodes(request: HTMLElement):Promise<Episode[]>{
    if(!request)
        request = await fetchResource({resource: config.baseURL});

    const $EpList = request.querySelectorAll(".ListEpisodios li a");

    if($EpList.length == 0) throw "Hay un error desconocido";

    const Episodes: Episode[] = [];

    $EpList.forEach($episodio => {
        const Id = $episodio.getAttribute("href")?.replace("/ver/", "") ?? ""; 
        const Image = config.baseURL + $episodio.querySelector(".Image img")?.getAttribute("src") ?? "";
        let Title = $episodio.querySelector(".Capi")?.innerHTML ?? ""; 
        const Anime = $episodio.querySelector("strong.Title")?.innerHTML ?? ""

        Episodes.push({Id, Image, Title, Anime})
    })

    return Episodes
}
