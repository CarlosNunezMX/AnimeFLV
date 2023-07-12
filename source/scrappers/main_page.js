import config from "../config.js";

import {  load } from "cheerio";
import config from "./config.js";
import { GetNewSeries } from "./scrappers/main_page.js";

export async function GetHomeScreen(){
    const request = await fetch(config.baseURL)
    const response = await request.text()

    return load(response);
}

/**
 * 
 * @param {import("cheerio").CheerioAPI} $ 
 */

export async function GetNewSeries($){
    if(!$) {
        $ = await fetch(config.baseURL);
        console.log("$ is not provided");
    }
    
    const $SeriesList = $(".ListAnimes li article.Anime");
    const Animes = [];
    $SeriesList.each((i, _a) => {
        const $anime = $(_a);
        const Id = $anime.find("a").first().attr("href")
            .replace("/anime/", "")
        
        const Image = config.baseURL + $anime.find(".Image figure img")
            .attr("src");
        
        const Type = $anime.find(".Image .Type")
            .text();

        const Title = $anime.find(".Title")
            .text();
        const Review = $anime.find(".Vts")
            .text();
        const _$Description = $anime.find(".Description p").get(1)
        const Description = $(_$Description).text()

        Animes.push({Id, Image, Type, Title, Review, Description})
    })
    return Animes
}

/**
 * 
 * @param {import("cheerio").CheerioAPI} $ 
 */


export async function GetNewEpisodes($){
    if(!$) $ = await GetHomeScreen();
    const $EpList = $(".ListEpisodios li a");

    if($EpList.length == 0) throw "Hay un error desconocido";

    const Episodes = [];

    $EpList.each((index, _ep) => {
        const $episodio = $(_ep);
        const Id = $episodio.attr("href")
            .replace("/ver/", "");
        
        const Image = config.baseURL + $episodio.find(".Image img")
            .attr("src");
        
        const Episode = $episodio.find(".Capi")
            .text();
        
        const Anime = $episodio.find("strong.Title")
            .text()


        Episodes.push({Id, Image, Episode, Anime})
    })

    return Episodes
}