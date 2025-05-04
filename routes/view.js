const express = require('express');
const viewRouter = express.Router(); 

viewRouter.get('/cats', (req, res) => {
    let sources = req.session.catPics ?? [];  
    let images =""; 
    sources.forEach(c => {
        if(c != null) {
            images += `<img src=${c} alt='loading'>`;
        }
        
    });
    res.render('view', {coins: req.session.coins ?? 0, dogs: req.session.dogs ?? 1, cats: req.session.cats ?? 1,
        petPics: images
    });
}); 

viewRouter.get('/dogs', (req, res) => {
    let sources = req.session.dogPics ?? [];  
    let images =""; 
    sources.forEach(c => {
        if(c != null) {
            images += `<img src=${c} alt='loading'>`;
        }
        
    });
    console.log(images); 
    res.render('view', {coins: req.session.coins ?? 0, dogs: req.session.dogs ?? 1, cats: req.session.cats ?? 1,
        petPics: images
    });
}); 

module.exports = viewRouter; 

