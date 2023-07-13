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


type EpisodeInfo = {
    Image: string,
    Number: number,
    Id: string
}

type AnimeInfo = {
    Episodes: EpisodeInfo[],
    Title: string,
    Alternative_Names: string[],
    Reviews: {
        Review: number,
        Number: number,
    }
    Type: string,
    Image: string,
    OnGoing: boolean,
    Followers: number,
    Genders: string[],
    Description: string
}

export function GetNewSeries($?:CheerioAPI): Promise<SearchResults[]>;
export function Search(Query: string): Promise<SearchResults[]>;
export function GetNewEpisodes($?:CheerioAPI): Promise<HomeScreenEpisode[]>;