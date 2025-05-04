const express = require('express');
const buyRouter = express.Router(); 

buyRouter.get('/cats', (req, res) => {
    res.render('buyCat', {coins: req.session.coins ?? 0, dogs: req.session.dogs ?? 1, cats: req.session.cats ?? 1});
}); 

buyRouter.get('/dogs', (req, res) => {
    res.render('buyDog', {coins: req.session.coins ?? 0, dogs: req.session.dogs ?? 1, cats: req.session.cats ?? 1});
}); 

module.exports = buyRouter; 