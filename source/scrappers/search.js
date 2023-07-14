import { load } from "cheerio";
import config from "../config.js";
import { GetNewSeries } from "./main_page.js";
import { ValidationError } from "../errors.js";
// I tried it - I give up for filtering...
export  async function Search(Query){
    if(!Query)
        throw new ValidationError("Se requiere una Query para buscar", {Query: true})

    const request = await fetch(config.baseURL + config.search + Query, {
        headers: {"User-Agent": config.userAgent}
    });
    const response = await request.text();

    const $ = load(response);
    return GetNewSeries($);
}