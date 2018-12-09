
(() => {
    class View {
        constructor(app, sprite) {
            this.bound = app.stage.getBounds()
            this.height = app.view.height
            this.half_height = Math.floor(this.height / 2)
            this.width = app.view.width
            this.half_width = Math.floor(this.width / 2)
            this.sprite = sprite
            this.app = app
            this.position = { x: 0, y: 0 }
        }
        update() {
            const s = this.sprite
            const hh = this.half_height
            const hw = this.half_width

            const left_up = [s.x - hw, s.y - hh]
            if (left_up[0] == this.position.x && left_up[1] == this.position.y) {
                return
            }
            const right_down = [s.x + hw, s.y + hh]

            let x = left_up[0], y = left_up[1];

            if (left_up[0] < 0) {
                x = 0
            } else if (right_down[0] > this.bound.width) {
                x = this.bound.width - this.width
            }

            if (left_up[1] < 0) {
                y = 0
            } else if (right_down[1] > this.bound.height) {
                y = this.bound.height - this.height
            }


            this.app.stage.x -= (x - this.position.x)
            this.app.stage.y -= (y - this.position.y)
            this.position.x = x
            this.position.y = y
        }
    }


    define(() => {
        return View
    })
})()



