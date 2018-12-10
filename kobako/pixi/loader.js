/* 

// load a map file produced by tiled

const containers = await my_loader.load_layers(map_texture, '/assets/soto1.json', 2)

// load a sprite by sprite_sheet

const marisa = await my_loader.load_sprite(marisa_texture, '/assets/marisa.json')

// marisa.json:
{
    "tilewidth": 64,
    "tileheight": 64
}

*/

define(['PIXI','../lazy.js', './anime.js'], (PIXI, my_lazy, anime_util) => {
    if (typeof my_lazy != 'function') {
        console.error('pixi_my_loader: you must import my_lazy.js first!')
        return null
    }

    const frame_lazy = (() => {
        //lazy
        function frame(id, tile_width, tile_height, texture_width) {
            // console.log('call!')
            id -= 1

            const cols = Math.floor(texture_width / tile_width)

            const row = Math.floor(id / cols)
            const col = id % cols

            const rectangle = [col * tile_width, row * tile_height, tile_width, tile_height]

            return rectangle
        }
        return my_lazy(frame)
    })()

    window.frame_lazy = frame_lazy


    function layer_to_container(data, texture, PIXI, { map_height, map_width, tile_height, tile_width }, scale = 1) {
        const container = new PIXI.Container()

        // console.log(map_height)
        // console.log(map_width)
        // console.log(tile_height)
        // console.log(tile_width)
        // console.log(cols)
        // console.log(scale)

        for (let i = 0; i < map_height; i++) {
            for (let j = 0; j < map_width; j++) {
                const d = data[i * map_width + j]

                if (d == 0) {
                    continue
                }

                const x = tile_width * j * scale
                const y = tile_height * i * scale

                const rectangle_raw = frame_lazy(d, tile_width, tile_height, texture.width)
                // console.log(rectangle_raw)
                const rectangle = new PIXI.Rectangle(...rectangle_raw)

                const clone_texture = texture.clone()
                clone_texture.frame = rectangle

                const sprite = new PIXI.Sprite(clone_texture)
                sprite.position.set(x, y)
                sprite.scale.set(scale)

                container.addChild(sprite)
            }
        }

        return container
    }

    function parameter_object(json_data) {
        return {
            tile_width: json_data.tilewidth,
            tile_height: json_data.tileheight,
            map_width: json_data.width,
            map_height: json_data.height,
        }
    }


    function load_json(PIXI, json_url) {
        return new Promise((resolve, reject) => {
            PIXI.loader.add(json_url).load((_, resrc) => {
                resolve(resrc[json_url].data)
            })
        })
    }


    async function tileset_layers_load(texture, json_url, PIXI, scale = 1) {
        const data = await load_json(PIXI, json_url)
        const layers = data.layers
        const parameter = parameter_object(data)
        return layers.map(layer => {
            return layer_to_container(layer.data, texture, PIXI, parameter, scale)
        })
    }


    // return LayersLoader
    return {
        load_layers: async function(texture, json_url, scale = 1) {
            return tileset_layers_load(texture, json_url, PIXI, scale)
        },
        load_sheet_sprite: async function(texture, json_url, scale = 1) {
            window.texture = texture 

            const texture_spawner = await this.load_sheet_texture_spawner(texture, json_url)

            const new_texture = texture_spawner()

            window.new_texture = new_texture

            const sprite = new PIXI.Sprite(new_texture)

            // Refer to
            sprite.get_frame = new_texture.get_frame
            sprite.set_frame = new_texture.set_frame
            sprite.set_frame(1)

            // wrap_animation(sprite, new_texture.animes)
            anime_util.animation_sprite(sprite)

            sprite.scale.set(scale)
            return sprite
        },
        load_sheet_texture_spawner: async function(texture, json_url){
            const data = await load_json(PIXI, json_url)
            const cols = Math.floor(texture.width / data.tilewidth)
            const rows = Math.floor(texture.height / data.tileheight)
            const tile_num = cols * rows

            const frames = []
            for(let i = 1;i <= tile_num; i++){
                frames.push(new PIXI.Rectangle(...frame_lazy(i, data.tilewidth, data.tileheight, texture.width)))
            }

            function get_frame(id){
                return frames[id-1]
            }

            // texture.animes = data.animes

            return () => {
                const new_texture = texture.clone()
                new_texture.get_frame = get_frame
                new_texture.set_frame = (id) => {
                    new_texture.frame = get_frame(id)
                }
                new_texture.animes = data.animes
                new_texture.set_frame(1)
                return new_texture
            }
        }
    }
})