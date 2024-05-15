# Toon Scraper Package

Toon Scraper Package is an npm package that serves as a comprehensive API wrapper for accessing information about various anime series and movies in hindi. It fetches info from the website https://toonstream.day/.

## Installation

To install the package, use npm:

```bash
npm install toon-scraper-package
```

## Features

The package provides the following features:

### Home

The `Home` class provides methods to retrieve information about the latest series, latest movies, random series, random movies, and searching by character.

#### Latest Content:

```javascript
const ToonScraper = require('toon-scraper-package');

// Latest series
const latestSeries = await ToonScraper.Home.latest_series();
console.log(latestSeries);

// Latest movies
const latestMovies = await ToonScraper.Home.latest_movies();
console.log(latesMovies);
```

#### Random content:

```javascript
const ToonScraper = require('toon-scraper-package');

// Random movies
const randomMovies = await ToonScraper.Home.random_movies();
console.log(randomMovies);

// Random series
const randomSeries = await ToonScraper.Home.random_series();
console.log(randomSeries);
```

### Category

The `Category` class allows users to explore different categories of anime, such as types, networks, and genres.

#### Categories:

```javascript
const ToonScraper = require('toon-scraper-package');

// Get list of categories available
const categories = await ToonScraper.Category.categories();
console.log(categories);
```

#### Get category:

```javascript
const ToonScraper = require('toon-scraper-package');

// Get list of perticular type of category, category = comedy, page = 1, type = movies or series
const comedyMovies = await ToonScraper.Category.get_category("comedy", 1, "movies");
console.log(comedyMovies);
```

### Search

The `Search` class provides methods for searching anime titles, both through default search and live search.

#### Default search:

```javascript
const ToonScraper = require('toon-scraper-package');

// anime = one piece and page = 1
const searchResults = await ToonScraper.Search.default_search('One piece', 1);
console.log(searchResults);
```

#### Live search:

```javascript
const ToonScraper = require('toon-scraper-package');

const liveSearchResults = await ToonScraper.Search.live_search('one');
console.log(liveSearchResults);
```

#### Search by first character:

```javascript
const ToonScraper = require('toon-scraper-package');

// First character = 'A' and page = 1
const SearchResults = await ToonScraper.Home.search_by_character('A', 1);
console.log(SearchResults);
```

### Anime

The `Anime` class offers functions for fetching detailed information about specific anime titles, including movies or series, and retrieving their sources.

#### Movies or series info:

```javascript
const ToonScraper = require('toon-scraper-package');

// Series info
const animeInfo = await ToonScraper.Anime.movie_or_series_info('one-piece', 'series');
console.log(animeInfo);

// Movies info
const movieInfo = await ToonScraper.Anime.movie_or_series_info('home-alone', 'movies');
console.log(movieInfo);
```

#### Source:

```javascript
const ToonScraper = require('toon-scraper-package');

// Get source of series or movies
// Anime slug = hunter-x-hunter-1x1 and type = series
const animeInfo = await ToonScraper.Anime.fetch_source('hunter-x-hunter-1x1', 'series');
console.log(animeInfo);
```

---

### Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request on the [GitHub repository](https://github.com/Awesome-Tofu/toon-scraper-package/).

### License

This project is licensed under the ISC License - see the [LICENSE](https://opensource.org/license/isc-license-txt) file for details.

---
