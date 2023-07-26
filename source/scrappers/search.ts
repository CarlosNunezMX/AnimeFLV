import config from "../config.js";
import { GetNewSeries, HomeElement } from "./main_page.js";
import { HTML_PARSING_ERROR, ValidationError } from "../errors.js";
import { fetchResource } from "./fetch.js";
import { HTMLElement } from "node-html-parser";
// I tried it - I give up for filtering...
function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sleep(fn: Function, ...args: any[]) {
    await timeout(3000);
    return fn(...args);
}

export type TitleType = 'tv' | 'movie' | 'special' | 'ova'
export type Order = 'updated' | 'added' | 'title' | 'rating'
export enum Emmision {
    OnGoing,
    Finished,
    CommingSoon
}
export type SearchParams = Partial<{
    year: number[] | number,
    status: Emmision | Emmision[],
    type: TitleType[] | TitleType,
    page: number,
    order: Order,
    wait?: {
        onPage: (page: number) => void,
        seconds: number
    }
    allCatalog: boolean
}> | string

type Pages = {
    first: number,
    last: number
}
export type SearchResults =
    HomeElement[] |
    { Series: HomeElement[], Pages: Pages}

export async function Search(Query: SearchParams): Promise<SearchResults> {
    if (!Query)
        throw new ValidationError("Se requiere una Query para buscar", { Query: true })
    if (typeof Query === 'string') {
        const $ = await fetchResource({ resource: config.baseURL + config.search + '?q=' + Query });
        return GetNewSeries($);
    }

    const browse = new URLSearchParams()
    if (Query.year)
        if (typeof Query.year === 'number')
            browse.set('year[]', Query.year.toString())
        else
            Query.year.forEach(year => browse.append('year[]', year.toString()));
    if (Query.type)
        if (typeof Query.type === 'string')
            browse.set('type[]', Query.type);
        else
            Query.type.forEach(type => browse.append('type[]', type));
    if (Query.order)
        browse.set('order', Query.order);
    if (Query.status)
        if (typeof Query.status === 'number')
            browse.set('status[]', (Query.status + 1).toString())
        else
            Query.status.forEach(status => browse.append('status[]', (status + 1).toString()));
    if (Query.page)
        browse.set('page', Query.page.toString());

    // Procesar peticion
    const $ = await fetchResource({
        resource: config.baseURL + config.search + '?' + browse.toString()
    });
    const Series: HomeElement[] = await GetNewSeries($);
    if (process.env["DEBUG"])
        console.log("[DEBUG] = Got", config.search + browse.toString());

    const $Pagination = $.querySelectorAll('.pagination li a:not([rel])')
    if ($Pagination.length == 0)
        throw new HTML_PARSING_ERROR('Pagination Items', 'episode.ts', 'Search: Query{}', '$Pagination');
    let Pages = {
        first: Number($Pagination[0].innerText ?? "0"),
        last: Number($Pagination.pop()?.innerHTML ?? "0")
    }

    if (!Query.allCatalog)
        return { Series, Pages };

    
    let container = await Format(
        Series,
        Pages,
        Query
    );

    Series.concat(container);
    return Series;
}

async function Format(Series: HomeElement[], Pages: Pages, Query: SearchParams): Promise<HomeElement[]>{
    if(typeof Query === "string")
        return Series
    
    for(let i = Pages.first; i <= Pages.last; i++){
        const url = 
        "/browse?" + new URLSearchParams({
            page: i.toString()
        }).toString();
        if(process.env["DEBUG"])
            console.info("[DEGUB] > Getting", url)
        if (!Query.wait) {
            const $$ = await fetchResource({ resource: config.baseURL + url })
            const series = await GetNewSeries($$)
            Series.push(...series)

            continue;
        }
        await timeout((Query.wait.seconds * i) * 1000);
        const $$ = await fetchResource({ resource: config.baseURL + url })
        const series = await GetNewSeries($$)
        Series.push(...series)
        Query.wait?.onPage(i)
    }

    return Series;
}