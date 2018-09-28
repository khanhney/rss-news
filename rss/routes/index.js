const express = require('express');
const route = express.Router();
const bodyParser = require('body-parser').urlencoded({extended: false});

const FeedNews = require('../models/Feed');

let Parser = require('rss-parser');
let parser = new Parser();


route.get('/', async (req, res)=>{
    let feed = await parser.parseURL('https://vnexpress.net/rss/startup.rss');

    feed.items.forEach(async item => {

        // checkExist
        let checkExist = await FeedNews.findOne({
            link: item.link
        });
        if (!checkExist) {

            let newItem = new FeedNews({
                title: item.title,
                link: item.link,
                pubDate: item.pubDate,
                content: item.content,
                contentSnippet: item.contentSnippet,
                isoDate: item.isoDate
            });
    
            let saveItem = newItem.save();
        }
    });

    await res.json({
        "statusCode": 200,
        "message": "save_rss_success",
    });
});

route.get('/show-rss-static', async(req, res) => {
    try {
        const LIST_DATA_RSS = await FeedNews.find({});
        if (!LIST_DATA_RSS) return res.json({
            error: true,
            message: 'cannot_get_list_rss'
        });
        return res.json({
            error: false,
            data: LIST_DATA_RSS
        });
    } catch (error) {
        res.json({
            error: true,
            message: error.message
        });
    }
})


module.exports = route;
