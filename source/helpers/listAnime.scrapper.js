export function AnimeScrapper($){
    const $SeriesList = $(".ListAnimes li article.Anime");
    const Animes = [];
    $SeriesList.each((i, _a) => {
        const $anime = $(_a);
        const Id = $anime.find("a").first().attr("href")
            .replace("/anime/", "")
        
        const Image = config.baseURL + $anime.find(".Image figure img")
            .attr("src");
        
        const Type = $anime.find(".Image .Type")
            .text();

        const Title = $anime.find(".Title")
            .text();
        const Review = $anime.find(".Vts")
            .text();
        const _$Description = $anime.find(".Description p").get(1)
        const Description = $(_$Description).text()

        Animes.push({Id, Image, Type, Title, Review, Description})
    })
    return Animes
}