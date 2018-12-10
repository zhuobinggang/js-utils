define(() => {
    return {
        animation_sprite: (sprite) => {
            const animes = sprite.texture.animes
            let index = 0
            let counter = 0 //Use for adjusting speed
            const anime = { name: '', frames: [1], speed: 1, ani_end_cb: () => {} }
            // console.log(data)
            sprite.set_ani = (name, speed = 1, ani_end_cb = () => {}) => {
                // console.log(speed)
                if (anime.name == name) { // If call for the same ani over a time
                    return
                }
                if (animes[name] == null) {
                    console.error('The sprite has no anime called: ' + name)
                    return
                }
                // Reset
                anime.name = name
                anime.frames = animes[name]
                anime.speed = speed
                anime.ani_end_cb = ani_end_cb
                index = 0
            }

            function time_enough() {
                counter += 1
                if (counter >= anime.speed) {
                    counter = 0
                    return true
                }
                return false
            }

            sprite.play = () => {
                if (time_enough()) {
                    // console.log(anime.speed)
                    sprite.texture.set_frame(anime.frames[index])
                    index += 1
                    if(index == anime.frames.length){
                        index = 0
                        anime.ani_end_cb()
                    }
                }
            }
            sprite.set_ani(Object.getOwnPropertyNames(animes)[0])
            sprite.anime = anime
            return sprite
        }
    }
})