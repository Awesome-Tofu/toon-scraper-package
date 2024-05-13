// const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../config');
const Home = require('./home');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


class Category {

    static async categories() {
        const data = {
            types: [
                { name: 'Anime', slug: 'anime', info: '/api/category/anime' },
                { name: 'Animation & Cartoon', slug: 'cartoon', info: '/api/category/cartoon' },
                // { name: 'Movies', slug: 'movies', info: '/api/category/movies' }
            ],
            networks: [
                { name: 'Crunchyroll', slug: 'crunchyroll', info: '/api/category/crunchyroll' },
                { name: 'ETV Bal Bharti', slug: 'etv-bal-bharti', info: '/api/category/etv-bal-bharti' },
                { name: 'Hungama', slug: 'hungama', info: '/api/category/hungama' },
                { name: 'NetFlix', slug: 'netflix', info: '/api/category/netflix' },
                { name: 'Nickelodean', slug: 'nickelodean', info: '/api/category/nickelodean' },
                { name: 'Cartoon Network', slug: 'cartoon-network', info: '/api/category/cartoon-network' },
                { name: 'Kinds Zone Pluse', slug: 'kinds-zone-pluse', info: '/api/category/kinds-zone-pluse' },
                { name: 'Disney', slug: 'disney', info: '/api/category/disney' },
                { name: 'Sony Yay', slug: 'sony-yay', info: '/api/category/sony-yay' },
            ],
            Genre: [
                { name: 'Action', slug: 'action', info: '/api/category/action'},
                { name: 'Adventure', slug: 'adventure', info: '/api/category/adventure' },
                { name: 'Action & adventure', slug: 'action-adventure', info: '/api/category/action-adventure' },
                { name: 'Animation', slug: 'animation', info: '/api/category/animation' },
                { name: 'Comedy', slug: 'comedy', info: '/api/category/comedy' },
                { name: 'Crime', slug: 'crime', info: '/api/category/crime' },
                { name: 'Drama', slug: 'drama', info: '/api/category/drama' },
                { name: 'Family', slug: 'family', info: '/api/category/family' },
                { name: 'Fantasy', slug: 'fantasy', info: '/api/category/fantasy' },
                { name: 'Horror', slug: 'horror', info: '/api/category/horror' },
                { name: 'Kids', slug: 'kids', info: '/api/category/kids' },
                { name: 'Martial ART', slug: 'martial-art', info: '/api/category/martial-art' },
                { name: 'Mystery', slug: 'mystery', info: '/api/category/mystery' },
                { name: 'Romance', slug: 'romance', info: '/api/category/romance' },
                { name: 'Sci-fi', slug: 'sci-fi', info: '/api/category/sci-fi' },
                { name: 'Sci-Fi & Fantasy', slug: 'sci-fi-fantasy', info: '/api/category/sci-fi-fantasy' },
                { name: 'Superhero', slug: 'superhero', info: '/api/category/superhero' },
                { name: 'Thriller', slug: 'thriller', info: '/api/category/thriller' },
                { name: 'War', slug: 'war', info: '/api/category/war' },
            ]
        };
        return data;
    }

    static async getPage($) {
        const pages = $('nav.pagination div.nav-links a.page-link').last().text();
        if (pages == "") {
            return 1;
        } else {
            return Number(pages);
        }
    }

    static async get_category(category, page = 1, type = null) {
        // const url = type === null || type === 'all' ? `${config.BASE_URL}/category/${name}/page/${page}` : `${config.BASE_URL}/category/${name}/page/${page}/?type=${type}`;
        // // console.log(url);
        // const response = await axios.get(url);
        // const $ = cheerio.load(response.data);
        // const ulElement = $('ul.post-lst.rw.sm.rcl2.rcl3a.rcl4b.rcl3c.rcl4d.rcl6e:first');
        // const res = await Home.getCards(ulElement, $);
        // const getpage = await Category.getPage($);

        // return { results: res.results, lastPage: getpage };
        const url = type === null || type === 'all' ? `${config.BASE_URL}/category/${category}/page/${page}` : `${config.BASE_URL}/category/${category}/page/${page}/?type=${type}`;
        // const { data } = await axios.get(url, { headers: config.headers });
        const response = await fetch(url);
        const data = await response.text();
        const $ = cheerio.load(data);
        const ulElement = $('ul.post-lst.rw.sm.rcl2.rcl3a.rcl4b.rcl3c.rcl4d.rcl6e:first');

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

        const lastPage = await Category.getPage($);
        let nextPage = type === null || type === 'all' ? `/api/category/${category}?page=${Number(page) + 1}` : `/api/category/${category}?page=${page + 1}&type=${type}`;
        if ((page == lastPage) || lastPage == undefined) nextPage = undefined;

        return { results, lastPage, nextPage };

    }
}

module.exports = Category;