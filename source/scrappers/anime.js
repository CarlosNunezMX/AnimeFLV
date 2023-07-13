import { load } from "cheerio";
import config from "../config.js"

export async function GetAnimeInfo(Query) {
    const request = await fetch(config.baseURL + config.anime + Query);
    const response = await request.text();

    const $ = load(response);

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

    if (Reviews.Number== "") Reviews.Number= 0;
    else Reviews.Number= Number(Reviews.Number);

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
    if($Tags.length > 0)
        $Tags.each((_, _tag) => Genders.push($(_tag).text()));
    
    const Description = $Main.find(".Description p")
        .text()
 
    // Lista de episodios
    let Episodes = [];
    const $Episodes = $("#episodeList a");
    console.log($Episodes.length);
    if($Episodes.length > 0)
        $Episodes.each((i, _ep) => {
            if(i == 0) return
            const $Episode = $(_ep);
            const Id = $Episode.attr("href")
                .replace("/ver/", "");
            
            const Image = $Episode.find("figure img")
                .attr("data-src")
            let EpisodeNum = $Episode.find("p")
                .text()
                .replace("Episodio ", "")

            EpisodeNum = isNaN(Number(EpisodeNum)) ? EpisodeNum : Number(EpisodeNum)

            Episodes.push({
                Id,
                Image,
                Episode: EpisodeNum
            })
        })

    console.log({ Title, Alternative_Names: Names, Reviews, Type, Image, OnGoing, Followers, Genders, Description, Episodes })

}