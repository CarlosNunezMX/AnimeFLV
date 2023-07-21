import { HTMLElement, parse } from "node-html-parser"
import config from "../config.js"
export function fetchResource({resource}: {resource: string}): Promise<HTMLElement>{
    return fetch(resource, {
        headers: {"User-Agent": config.userAgent}
    })
    .then(response => response.text())
    .then(parse)
}
