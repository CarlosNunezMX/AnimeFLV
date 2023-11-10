# AnimeFLV Scrapper 📺
Dependecy-Lowest AnimeFLV scrapper for nodejs, just using `node-html-parser` for faster DOM parsing.

## Now in npm 🥳
Install this module with
```bash
# npm
npm i @carlosnunezmx/animeflv

#pnpm
pnpm add @carlosnunezmx/animeflv
```


## RoadMap
This is our RoadMap ⏲️

- [x] Search
- [x] Get Anime Info
- [x] Get Episodes
- [x] Get Episode Sources **(Beta support)**
- [x] Support for all anime catalog **(Beta support)**
## Using
Just import from the module and instance it, then run exec method

```js
import {Search} from "@carlosnunezmx/animeflv";
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

Made with ❤️ from 🇲🇽 by CarlosNunexMX / Discord @karurosu