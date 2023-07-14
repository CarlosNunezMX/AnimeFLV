import config from "../config.js";
import { GetNewSeries } from "./main_page.js";
import { ValidationError } from "../errors.js";
import { fetchResource } from "./fetch.js";
// I tried it - I give up for filtering...
export  async function Search(Query){
    if(!Query)
        throw new ValidationError("Se requiere una Query para buscar", {Query: true})
    
    const $ = await fetchResource({resource: config.baseURL + config.search + Query});
    return GetNewSeries($);
}