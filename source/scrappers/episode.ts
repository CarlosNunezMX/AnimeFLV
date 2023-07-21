import {HTML_PARSING_ERROR, ValidationError} from "../errors.js";
import config from "../config.js";
import { fetchResource } from "./fetch.js";
import { HTMLElement } from "node-html-parser";
export type Server = {
    server: string,
    title: string,
    ads: number,
    allow_mobile: boolean,
    code: string
}

export type Resources = {
    SUB: Server[],
    LAT?: Server[]
}

// This is an experimental, is possible to break any time
export async function GetResources(Query: string): Promise<Resources>{
    if(!Query)
        throw new ValidationError("Se requiere una Query para buscar", {Query: true})
    
    const $ = await fetchResource({resource: config.baseURL + config.see + Query});
    let founded: Resources | undefined;
    $.querySelectorAll("script[type='text/javascript']:not([src])")
        .forEach((script: HTMLElement) => {
            let text = script.innerHTML.trim();
            if(!text.includes("anime_id") || !text)
                return;

            const lines = text
                .split("\n")[7]
                .trim()
                .replace(";", "")
                .split("var videos = ")[1];

            founded = JSON.parse(lines)
        })
    if(!founded)
         throw new HTML_PARSING_ERROR("founded", 'episode.ts', 'GetResources', 'founded')
    return founded;
}
