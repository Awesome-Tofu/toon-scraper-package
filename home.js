// const axios = require('axios');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cheerio = require('cheerio');
const config = require('./config');
const Category = require('./category');

class Home {
    static async getCards(ulElement, $) {
        const results = [];

        ulElement.find('li').each((index, element) => {
            const name = $(element).find('h2.entry-title').text();
            const slug = $(element).find('a.lnk-blk').attr('href').split('/').filter(Boolean).pop();
            let cover_url = $(element).find('img').attr('src');
            if (cover_url && cover_url.startsWith('data:')) {
                cover_url = $(element).find('img').attr('data-src');
            }
            if (cover_url && cover_url.startsWith('//')) {
                cover_url = 'https:' + cover_url;
            }
            let type = $(element).find('span.watch').text().toLowerCase();
            type = type.replace('view ', '');
            type = `${type}s`
            const tmdb = parseFloat($(element).find('.entry-meta .vote').text().replace('TMDB', ''));
            results.push({ name, slug, cover_url, type, info: `/api/${type}/${slug}`, tmdb });
        });

        return { results };
    }

    static async getPage($) {
        try {
            const lastPageLink = $('nav.pagination a.page-link').last().attr('href');
            const lastPage = parseInt(lastPageLink.split('/').filter(Boolean).pop());
            return lastPage;
        } catch (error) {
            // console.log(error.message);
            return 1;
        }
    }

    static async latest_series() {
        try {
            // const response = await axios.get(config.BASE_URL, { headers: config.headers });
            const response = await fetch(config.BASE_URL);
            const text = await response.text();
            const $ = cheerio.load(text);
            const ulElement = $('ul.post-lst.rw.sm.rcl2.rcl3a.rcl4b.rcl3c.rcl4d.rcl6e:first');
            const res = await Home.getCards(ulElement, $);
            return res;
        } catch (error) {
            throw new Error('Got an error\n' + error.message);
        }
    }

    static async latest_movies() {
        try {
            // const response = await axios.get(config.BASE_URL, { headers: config.headers });
            const response = await fetch(config.BASE_URL);
            const text = await response.text();
            const $ = cheerio.load(text);
            const ulElement = $('ul.post-lst.rw.sm.rcl2.rcl3a.rcl4b.rcl3c.rcl4d.rcl6e').eq(1);
            const res = await Home.getCards(ulElement, $);
            return res;
        } catch (error) {
            throw new Error('Got an error\n' + error.message);
        }
    }

    static async random_series() {
        try {
            // const response = await axios.get(config.BASE_URL, { headers: config.headers });
            const response = await fetch(config.BASE_URL);
            const text = await response.text();
            const $ = cheerio.load(text);
            const ulElement = $('ul.post-lst.rw.sm.rcl2.rcl3a.rcl4b.rcl3c.rcl4d.rcl6e').eq(2);
            const res = await Home.getCards(ulElement, $);
            return res;
        } catch (error) {
            throw new Error('Got an error\n' + error.message);
        }
    }

    static async random_movies() {
        try {
            // const response = await axios.get(config.BASE_URL, { headers: config.headers });
            const response = await fetch(config.BASE_URL);
            const text = await response.text();
            const $ = cheerio.load(text);
            const ulElement = $('ul.post-lst.rw.sm.rcl2.rcl3a.rcl4b.rcl3c.rcl4d.rcl6e').eq(3);
            const res = await Home.getCards(ulElement, $);
            return res;
        } catch (error) {
            throw new Error('Got an error\n' + error.message);
        }
    }

    static async search_by_character(char, page = 1) {
        if (typeof char !== 'string') throw new Error('Invalid type');
        try {
            // const response = await axios.get(`${config.BASE_URL}/letter/${char}/page/${page}/`, { headers: config.headers });
            const response = await fetch(`${config.BASE_URL}/letter/${char}/page/${page}/`);
            const text = await response.text();
            const $ = cheerio.load(text);
            const ulElement = $('ul.post-lst.rw.sm.rcl2.rcl3a.rcl4b.rcl3c.rcl4d.rcl6e:first');
            const res = await Home.getCards(ulElement, $);
            const getpage = await Home.getPage($);

            let nextPage = `/api/letter/${char}?page=${Number(page) + 1}`;
            if ((page == getpage) || getpage == undefined) nextPage = undefined;

            return { results: res.results, lastPage: getpage, nextPage };
        } catch (error) {
            // throw new Error('Got an error \n' + error.message);
            console.error(error);
        }
    }

    static async fetch_type(type, page = 1) {
        const url = `${config.BASE_URL}/${type}/page/${page}`;

        const response = await fetch(url);
        const text = await response.text();
        const $ = cheerio.load(text);
        const ulElement = $('ul.post-lst.rw.sm.rcl2.rcl3a.rcl4b.rcl3c.rcl4d.rcl6e:first');
        const res = await Home.getCards(ulElement, $);
        const getpage = await Category.getPage($);
        let nextPage = `/api/${type}?page=${Number(page) + 1}`;
        if ((page == getpage) || getpage == undefined) nextPage = undefined;

        return { results: res.results, lastPage: getpage, nextPage };
    }
}

module.exports = Home;