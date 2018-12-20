define(() => {
    class Anime {
        constructor(animes, speed = 1) {
            this.animes = animes
            this.speed = speed
            this.speed_counter = 0
            this.playing = Object.getOwnPropertyNames(animes)[0]
            this.index = 0
        }
        set(name) {
            // console.log(this.animes)
            if (this.playing == name)
                return
            if (this.animes[name] == null) {
                console.error('The sprite has no anime called: ' + name)
                return
            }
            this.playing = name
            this.index = 0
        }
        play() {
            this.speed_counter++
            if (this.speed_counter >= this.speed) {
                this.speed_counter = 0
                this.index++
            }
        }
        get_frame() {
            if (this.is_over()) {
                console.error('The anime is over')
                return
            }
            return this.animes[this.playing][this.index]
        }
        is_over() {
            return this.index >= this.animes[this.playing].length
        }
        loop() {
            this.index = 0
        }
    }

    return {
        animation_sprite: (sprite) => {
            const animes = sprite.texture.animes
            let index = 0
            let counter = 0 //Use for adjusting speed
            const anime = { name: '', frames: [1], speed: 1, ani_end_cb: () => { } }
            // console.log(data)
            sprite.set_ani = (name, speed = 1, ani_end_cb = () => { }) => {
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
                return counter >= anime.speed
            }

            sprite.play = () => {
                counter++
                if (time_enough()) {
                    counter = 0
                    // console.log(anime.speed)
                    sprite.texture.set_frame(anime.frames[index])
                    index += 1
                    if (index == anime.frames.length) {
                        index = 0
                        anime.ani_end_cb()
                    }
                }
            }
            sprite.set_ani(Object.getOwnPropertyNames(animes)[0])
            sprite.anime = anime
            return sprite
        },
        once_anime_sprite(sprite, cb = () => { }) {
            const animes = sprite.texture.animes
            const ani = new Anime(animes, 1)
            sprite.set_ani = name => {
                ani.set(name)
            }
            sprite.play = () => {
                ani.play()
                if (ani.is_over()) {
                    cb()
                    return
                }
                sprite.texture.set_frame(ani.get_frame())
            }

            sprite.anime = ani
            return sprite
        },
        loop_anime_sprite(sprite) {
            const animes = sprite.texture.animes
            const ani = new Anime(animes, 1)
            sprite.set_ani = name => {
                ani.set(name)
            }
            sprite.play = () => {
                ani.play()
                if (ani.is_over()) {
                    ani.loop()
                }
                sprite.texture.set_frame(ani.get_frame())
            }

            sprite.anime = ani
            return sprite
        },
        time_over_desrtoy_sprite(sprite, time, destroy_cb) {
            const animes = sprite.texture.animes
            const ani = new Anime(animes, 1)
            sprite.set_ani = name => {
                ani.set(name)
            }

            let counter = 0
            sprite.play = () => {
                ani.play()
                if (ani.is_over()) {
                    ani.loop()
                }
                sprite.texture.set_frame(ani.get_frame())

                counter ++
                if(counter >= time){
                    destroy_cb()
                    return
                }
            }

            sprite.reset_life_time = () => {
                counter = 0
            }

            sprite.anime = ani
            return sprite
        }
    }
})