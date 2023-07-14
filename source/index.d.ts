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

class ValidationError extends error{
    elements: Object;
    constructor(message: string, el: Object);
}

export function GetNewSeries($?:CheerioAPI): Promise<SearchResults[]>;
export function Search(Query: string): Promise<SearchResults[]>;
export function GetNewEpisodes($?:CheerioAPI): Promise<HomeScreenEpisode[]>;
export function GetAnimeInfo(Query: string): Promise<AnimeInfo>;
export function GetEpisodes({$, anime_id}: {$?: CheerioAPI, anime_id?: string}): Promise<EpisodeInfo[]>

export const Errors = {
    ValidationError
}