// Use: If I have loaded the "soto.png" to the cache,  
// and the file "soto1.json" is the file producted by Tiled:
// const layers_loader = new LayersLoader(PIXI)
// layers_loader.load('soto.png', 'soto1.json')

window.LayersLoader = (() => {


    //lazy
    function frame(id, tile_width, tile_height, texture_width) {
        console.log('call!')
        id -= 1

        const cols = Math.floor(texture_width / tile_width)

        const row = Math.floor(id / cols)
        const col = id % cols

        const rectangle = [col * tile_width, row * tile_height, tile_width, tile_height]

        return rectangle
    }

    const frame_lazy = typeof my_lazy === 'function' ? my_lazy(frame) : frame;

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




    function tileset_layers_load(texture, json_url, PIXI, scale = 1) {
        return new Promise((resolve, _) => {
            loader.add(json_url).load((_, resource) => {
                // console.log(res)
                const res = resource[json_url].data
                const layers = res.layers
                const parameter = parameter_object(res)
                const containers = layers.map(layer => {
                    return layer_to_container(layer.data, texture, PIXI, parameter, scale)
                })

                resolve(containers)
            })
        })
    }


    class LayersLoader {
        constructor(PIXI) {
            this.PIXI = PIXI
        }

        load(texture, json_url, scale = 1) {
            const PIXI = this.PIXI
            return tileset_layers_load(texture, json_url, PIXI, scale)
        }
    }

    return LayersLoader
})()
