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

define(['PIXI','./lazy.js'], (PIXI, my_lazy) => {
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

    function wrap_animation(sprite, data) {
        let aniFrameId = 0
        const anime = { name: '', frames: [1] }
        // console.log(data)
        sprite.setAni = (name) => {
            // console.log(name)
            if (anime.name == name) { // If call for the same ani over a time
                return
            }
            if (data.animes[name] == null) {
                data.animes[name] = [1]
            }
            // Reset
            anime.name = name
            anime.frames = data.animes[name]
            aniFrameId = 0
        }
        sprite.play = () => {
            sprite.set_frame_by_id(anime.frames[aniFrameId])
            aniFrameId += 1
            aniFrameId = aniFrameId % anime.frames.length
        }
        sprite.anime = anime
    }


    // return LayersLoader
    return {
        load_layers: async function(texture, json_url, scale = 1) {
            return tileset_layers_load(texture, json_url, PIXI, scale)
        },
        load_sprite: async function(texture, json_url) {
            const data = await load_json(PIXI, json_url)
            const tile_width = data.tilewidth
            const tile_height = data.tileheight
            // console.log(data)
            const new_texture = texture.clone()
            const sprite = new PIXI.Sprite(new_texture)
            sprite.get_frame_by_id = my_lazy((id) => {
                // console.log(id)
                return new PIXI.Rectangle(...frame_lazy(id, tile_width, tile_height, texture.width))
            })
            sprite.set_frame_by_id = (id) => {
                sprite.texture.frame = sprite.get_frame_by_id(id)
            }
            sprite.set_frame_by_id(1)
            return sprite
        },
        load_sheet_sprite: async function(texture, json_url) {
            const data = await load_json(PIXI, json_url)
            const tile_width = data.tilewidth
            const tile_height = data.tileheight
            // console.log(data)
            const new_texture = texture.clone()
            const sprite = new PIXI.Sprite(new_texture)

            //wrap set_frame_by_id function
            sprite.get_frame_by_id = my_lazy((id) => {
                // console.log(id)
                return new PIXI.Rectangle(...frame_lazy(id, tile_width, tile_height, texture.width))
            })
            sprite.set_frame_by_id = (id) => {
                sprite.texture.frame = sprite.get_frame_by_id(id)
            }
            sprite.set_frame_by_id(1)

            wrap_animation(sprite, data)

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

            function get_frame_by_id(id){
                return frames[id-1]
            }

            // texture.animes = data.animes

            return () => {
                const new_texture = texture.clone()
                new_texture.get_frame_by_id = get_frame_by_id
                new_texture.animes = data.animes
                new_texture.frame = get_frame_by_id(1)
                return new_texture
            }
        }
    }
})