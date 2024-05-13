// const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../config');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const querystring = require('querystring');


class Anime {
    static async getEpisodes(post_id, seasons) {
        const url = `${config.BASE_URL}/wp-admin/admin-ajax.php`;
        const episodesBySeason = {};

        for (let season = 1; season <= seasons; season++) {
            const form_data = querystring.stringify({
                action: 'action_select_season',
                season: season,
                post: post_id
            });
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: form_data
            });
            const data = await response.text();

            const htmlData = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><ul class="allEpData">' + data + '</ul></body></html>';
            const $ = cheerio.load(htmlData);
            const episodes = $('ul.allEpData li').map((i, elem) => {
                const slug = $(elem).find('a.lnk-blk').attr('href').split('/').slice(-2, -1)[0];
                return {
                    cover_url: $(elem).find('img').attr('src'),
                    episode: Number($(elem).find('span.num-epi').text().split('x')[1]),
                    episode_slug: slug,
                    sources: `/api/sources/${slug}`
                };
            }).get();

            episodesBySeason[season] = episodes;
        }

        return episodesBySeason;
    }


    static async movie_or_series_info(slug, type) {
        try {
            const response = await fetch(`${config.BASE_URL}/${type}/${slug}`);
            const text = await response.text();
            // const response = await axios.get(`${config.BASE_URL}/${type}/${slug}`, { headers: config.headers });
            const $ = cheerio.load(text);
            const title = $('h1.entry-title').text();

            const description = $('div.description p:not(:has(span))').map((i, elem) => {
                return $(elem).text();
            }).get().join('\n');

            let cover_url = $('div.post-thumbnail figure img').attr('src');
            if (cover_url && cover_url.startsWith('data:')) {
                cover_url = $('div.post-thumbnail figure img').attr('data-src');
            }
            if (cover_url && cover_url.startsWith('//')) {
                cover_url = 'https:' + cover_url;
            }

            let total_seasons;
            let post_id;
            let seasons;
            if (type === 'series') {
                const lastSeasonNumber = $('ul.aa-cnt.sub-menu li.sel-temp:last-child').text().replace('Season ', '');
                total_seasons = Number(lastSeasonNumber);

                post_id = Number($('ul.aa-cnt.sub-menu li.sel-temp:last-child a').attr('data-post'));
                seasons = await Anime.getEpisodes(post_id, total_seasons);
            }

            let movie_sources;
            if (type === 'movies') {
                movie_sources = await Anime.fetch_source(slug, type);
            }

            const genre = $('span.genres').text().split(', ');

            let language;
            let quality;
            let duration;

            $('div.description p').each((i, elem) => {
                const lines = $(elem).text().split('\n');
                lines.forEach(line => {
                    if (line.includes('Language:')) {
                        language = line.replace('Language:', '').trim();
                    } else if (line.includes('Quality:')) {
                        quality = line.replace('Quality:', '').trim();
                    } else if (line.includes('Running time:')) {
                        duration = line.replace('Running time:', '').trim();
                    }
                });
            });

            return { title, cover_url, type, description, language, quality, duration, genre, total_seasons, seasons, sources: movie_sources };
        } catch (error) {
            console.error(error.message);
        }
    }

    static async fetch_source(episode_slug, type = 'series') {
        try {
            let url = `${config.BASE_URL}/episode/${episode_slug}/`;
            if (type === 'movies') {
                url = `${config.BASE_URL}/movies/${episode_slug}/`;
            }

            // const { data } = await axios.get(url, { headers: config.headers });
            const response = await fetch(url);
            const data = await response.text();
            const $ = cheerio.load(data);
            const sources = $('iframe').map((i, elem) => {
                return $(elem).attr('data-src');
            }).get();
            return sources;

        } catch (error) {

        }

    }
}

module.exports = Anime;