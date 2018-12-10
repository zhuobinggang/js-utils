define(['PIXI', './loader.js', '../keyboard.js', './view.js', '../ticker.js', './sprites.js'], (PIXI, loader, keyboard, View, Ticker, sprites ) => {

    return {...PIXI, 
        kobako: {
            loader,
            keyboard,
            View,
            Ticker,
            sprites
        }
    }
})