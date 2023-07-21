import config from "../config.js";
import { GetNewSeries, HomeElement } from "./main_page.js";
import { HTML_PARSING_ERROR, ValidationError } from "../errors.js";
import { fetchResource } from "./fetch.js";
// I tried it - I give up for filtering...

export type TitleType = 'tv' | 'movie' | 'special' | 'ova'
export type Order = 'updated' | 'added' | 'title' | 'rating'
export enum Emmision {
    OnGoing,
    Finished,
    CommingSoon
}
export type Page = {
    number: number,
    url: string
}
export type SearchParams = Partial<{
    year: number[] | number,
    status: Emmision | Emmision[],
    type: TitleType[] | TitleType,
    page: number,
    order: Order,
    allCatalog: boolean
}> | string
export type SearchResults =
    HomeElement[] |
    { Series: HomeElement[], Pages: Page[] }
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
        console.log("[DEBUG] = Got", browse.toString);

    const $Pagination = $.querySelectorAll('.pagination li a:not([rel])')
    if ($Pagination.length == 0)
        throw new HTML_PARSING_ERROR('Pagination Items', 'episode.ts', 'Search: Query{}', '$Pagination');
    let Pages: Page[] = [];
    $Pagination.forEach($Page => {
        const url = $Page.getAttribute('href');
        const numb = $Page.innerText;

        if (!url)
            throw new HTML_PARSING_ERROR('Url de la pagina', 'episode.ts', 'Search:Query{}', 'url');

        if (!numb)
            throw new HTML_PARSING_ERROR('Numero de la pagina', 'episode.ts', 'Search:Query{}', 'numb')
        Pages.push({
            url,
            number: Number(numb)
        });
    })
    if (!Query.allCatalog)
        return { Series, Pages };

    Pages.forEach(async ($Page) => {
        const Slash = $Page.url;
        const $$ = await fetchResource({ resource: config.baseURL + Slash });
        const Titles = await GetNewSeries($$);
        Series.push(...Titles);
    })

    return Series;
}
