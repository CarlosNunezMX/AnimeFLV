import {load} from "cheerio";
import {ValidationError} from "../errors.js";
import config from "../config.js";
import { fetchResource } from "./fetch.js";

// This is an experimental, is possible to break any time

export async function GetResources(Query){
    if(!Query)
        throw new ValidationError("Se requiere una Query para buscar", {Query: true})
    
    const $ = await fetchResource({resource: config.baseURL + config.see + Query});
    let founded;
    const scripts = $("script[type='text/javascript']")
        .each((_, _e) => {
            const script = $(_e);
            let text = script.text()
                .trim()
            if(text === "") return;

            if(!text.startsWith("var anime_id ="))
                return;

            const lines = text
                .split("\n")[7]
                .trim()
                .replace(";", "")
                .split("var videos = ")[1];

            founded = JSON.parse(lines)
        })
    
    return founded;
}