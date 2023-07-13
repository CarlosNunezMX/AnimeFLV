import { CheerioAPI } from "cheerio"

type SearchResults = {
    Id: string,
    Image: string,
    Type: string,
    Title: string,
    Review: number,
    Description: string
}


type HomeScreenEpisode = {
    Id: string,
    Image: string,
    Episode: number | string,
    Anime: string
}

type SearchOptions = {
    text: string
}
export function GetNewSeries($?:CheerioAPI): Promise<SearchResults[]>;
export function Search(Query: SearchOptions): Promise<SearchResults[]>;
export function GetNewEpisodes($?:CheerioAPI): Promise<HomeScreenEpisode[]>;