const express = require('express');
const route = express.Router();
const bodyParser = require('body-parser');
const moment = require('moment');
const FeedNews = require('../models/Feed');

let Parser = require('rss-parser');
let parser = new Parser();


route.use(bodyParser.urlencoded({extended: false}));
route.use(bodyParser.json());

route.get('/', async (req, res)=>{
    let feed = await parser.parseURL('https://vnexpress.net/rss/startup.rss');

    feed.items.forEach(async item => {
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
        return;
    });

    await res.redirect('/show-rss-static')
});

route.get('/show-rss-static', async(req, res) => {
    try {
        const LIST_DATA_RSS = await FeedNews.find({});
        if (!LIST_DATA_RSS) return res.json({
            error: true,
            message: 'cannot_get_list_rss'
        });
        return res.render('show-rss-list', { LIST_DATA_RSS, moment });
    } catch (error) {
        res.json({
            error: true,
            message: error.message
        });
    }
})

// remove
route.get('/remove-item/:id', async(req, res) => {
    const { id } = req.params;
    try {
        let removeItem = await FeedNews.findByIdAndRemove(id);
        if (!removeItem) return res.json({
            error: true,
            message: 'cannot_remove_item'
        });
        return res.json({
            error: false,
            message: 'remove_success'
        });
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        });
    }
});

route.get('/detail-item/:id', async(req, res) => {
    const { id } = req.params;
    try {
        const infoItem = await FeedNews.findById(id);
        if (!infoItem) return res.json({
            error: true,
            message: 'cannot_get_info_detail'
        });
        return res.json({
            error: false,
            data: infoItem
        });
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        });
    }
})

route.post('/update-item/:id', async(req, res) => {
    const { id } = req.params;
    const { title, link, content }  = req.body;
})

route.get('/tim-kiem', async(req, res) => {
    res.render('tim-kiem');
})

route.get('/find-category', async(req, res) => {
    const { linkCategory } = req.query;

    let feed = await parser.parseURL(linkCategory);

    if (!feed) return res.json({
        error: true,
        message: 'cannot_get_list'
    });
    return res.json({
        error: false,
        data: feed
    });
});

module.exports = route;
