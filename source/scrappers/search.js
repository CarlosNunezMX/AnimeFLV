import { load } from "cheerio";
import config from "../config.js";
import { GetNewSeries } from "./main_page.js";
// I tried it - I give up for filtering...
export  async function Search(Query){
    const request = await fetch(config.baseURL + config.search + Query);
    const response = await request.text();

    const $ = load(response);
    return GetNewSeries($);
}