# AnimeFLV Scrapper 📺
Dependecy-Lowest NovelCool scrapper for nodejs, just using `cheerio` for DOM parsing.

## Now in npm 🥳
Install this module with
```bash
# npm
npm i anime-flv

#pnpm
pnpm add anime-flv
```


## RoadMap
This is our RoadMap ⏲️

- [x] Search
- [x] Get Anime Info
- [-] Get Episodes
    - **We're working hardest on it**
- [] Get Episode Sources

## Using
Just import from the module and instance it, then run exec method

```js
import {Search} from "anime-flv";
Search({text: "yumemiru danshi"})
    .then(console.log);

/**
[
  {
    Id: 'yumemiru-danshi-wa-genjitsushugisha',
    Image: 'https://www3.animeflv.nethttps://animeflv.net/uploads/animes/covers/3829.jpg',
    Type: 'Anime',
    Title: 'Yumemiru Danshi wa GenjitsushugishaYumemiru Danshi wa Genjitsushugisha',
    Review: 0,
    Description: '...'
  }
]
**/
```

## Note ⚠️
For use this module is needed set `"type": "module"` -> on your `package.json`

Made with ❤️ from 🇲🇽 by CarlosNunexMX