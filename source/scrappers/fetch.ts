import { HTMLElement, parse } from "node-html-parser"
import config from "../config.js"
import {decode} from 'he'
export function fetchResource({resource}: {resource: string}): Promise<HTMLElement>{
    return fetch(resource, {
        headers: {
            "User-Agent": config.userAgent,
            "Content-Type": 'text/html; charset=utf-8'
        }
    })
    .then(response => response.text())
    .then(html => parse(decode(html)))
}
