const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const feedSchema = mongoose.Schema({
    title: String,
    link : String,
    pubDate: Date,
    content: String,
    /***
     * contentSnippet equal Description Short
     */
    contentSnippet: String,
    isoDate: Date
});
const FeedNews = mongoose.model('FeedNews', feedSchema);

module.exports = FeedNews;