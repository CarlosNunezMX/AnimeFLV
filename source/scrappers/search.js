import { load } from "cheerio";
import config from "../config.js";
import { GetNewSeries } from "./main_page.js";

/**
 * @todo Hacer que se pueda filtar por 
 *  - genero
 *  - Año
 *  - Tipo
 *  - Estado
 *  - Orden
 *  
 */

export  async function Search(Query){
    const request = await fetch(config.baseURL + config.search + Query.text);
    const response = await request.text();

    const $ = load(response);
    return GetNewSeries($);
}