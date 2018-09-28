const express = require('express');
const app = express();
const body = require('body-parser');
const bodyParser = body.urlencoded({extended: false});
const mongoose = require('mongoose');

const session = require('express-session');
app.use(session({
    secret: 'asdasfdaf236256asda1',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 55000
    }
}));
app.use(bodyParser);
app.use(body.json());

const routeHome = require('./routes');

// app config
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));

app.use(routeHome);

// app port
const port = process.env.PORT || 3000;
// const uri = 'mongodb://khanhney123:123@ds149934.mlab.com:49934/cnpm'
const uri = 'mongodb://localhost/rss-ecommerce-pratice'
mongoose.connect(uri);
mongoose.connection.once('open', ()=>{
    app.listen(port, ()=> console.log('Server started at port 3000'));
})