import { load } from "cheerio"
import config from "../config.js"
export function fetchResource({resource}){
    return fetch(resource, {
        headers: {"User-Agent": config.userAgent}
    })
    .then(response => response.text())
    .then(load)
}