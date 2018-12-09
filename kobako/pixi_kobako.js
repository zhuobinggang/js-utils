define(['PIXI', './pixi_loader.js', './keyboard.js', './pixi_view.js', './ticker.js', './sprites.js'], (PIXI, loader, keyboard, View, Ticker, sprites ) => {

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