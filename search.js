// const axios = require('axios');
const cheerio = require('cheerio');
const config = require('./config');
const Home = require('./home');
const Category = require('./category');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class Search {
    static async default_search(name, page = 1) {
        const url = `${config.BASE_URL}/page/${page}/?s=${name}`;
        // const response = await axios.get(url);
        const response = await fetch(url);
        const text = await response.text();

        const $ = cheerio.load(text);
        const ulElement = $('ul.post-lst.rw.sm.rcl2.rcl3a.rcl4b.rcl3c.rcl4d.rcl6e:first');
        const res = await Home.getCards(ulElement, $);
        const getpage = await Category.getPage($);
        let nextPage = `/api/search?q=${encodeURIComponent(name)}&page=${Number(page) + 1}`;
        if ((page == getpage) || getpage == undefined) nextPage = undefined;

        return { results: res.results, lastPage: getpage, nextPage };
    }

    static async live_search(name){
        const url = `${config.BASE_URL}/wp-admin/admin-ajax.php?s=${name}&action=search_in_place&lang=en`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.result) {
            if (data.result.series) {
                data.result.series = data.result.series.map(item => ({
                    title: item.title,
                    resume: item.resume && item.resume.replace('<span class="ellipsis">[...]</span>', ''),
                    slug: item.link.split('/').filter(Boolean).pop(),
                    info: `/api/series/${item.link.split('/').filter(Boolean).pop()}`
                }));
            }
    
            if (data.result.movies) {
                data.result.movies = data.result.movies.map(item => ({
                    title: item.title,
                    resume: item.resume && item.resume.replace('<span class="ellipsis">[...]</span>', ''),
                    slug: item.link.split('/').filter(Boolean).pop(),
                    info: `/api/movies/${item.link.split('/').filter(Boolean).pop()}`
                }));
            }
        }
    
        return data;
    }
}

module.exports = Search;