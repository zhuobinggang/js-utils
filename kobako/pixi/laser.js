((builder) => {
    if (typeof define === 'function') {
        define(() => {
            return builder()
        })
    } else {
        window.laser = builder()
    }
})(() => {


    function position(x, y) {
        return { x, y }
    }

    function get_line(launcher, facing_point) {
        const x1 = launcher.x
            , y1 = launcher.y
            , x2 = facing_point.x
            , y2 = facing_point.y;

        const x2_sub_x1 = x2 - x1
        if(x2_sub_x1 == 0){
            return {not_exist: true, k: 0, b: 0}
        }

        const k = (y2 - y1) / x2_sub_x1
        const b = y1 - (k * x1)
        return {not_exist: false, k, b }
    }

    function is_in_laser(launcher, facing_point, sprite) {
        const line = get_line(launcher, facing_point)

        const left_up = position(sprite.x, sprite.y)
            , right_up = position(sprite.x + sprite.width, sprite.y)
            , left_down = position(sprite.x, sprite.y + sprite.height)
            , right_down = position(sprite.x + sprite.width, sprite.y + sprite.height);

        return !is_all_on_one_side(line.k, line.b, left_up, right_up, left_down, right_down)
    }

    function is_all_on_one_side(k, b, ...points) {
        // console.log(points)
        const flag = which_side(k, b, points[0])
        const unexpectation = points.find(p => {
            return which_side(k, b, p) != flag
        })
        return unexpectation == null
    }

    function which_side(k, b, { x, y }) {
        const y2 = k * x + b
        if (y < y2) {
            return -1
        } else if (y > y2) {
            return 1
        } else {
            return 0
        }
    }

    function get_y({ k, b }, x) {
        return k * x + b
    }

    function get_y_int(line, x) {
        return Math.floor(get_y(line, x))
    }

    function positions_on_line(launcher, facing_point, distance, long) {
        const line = get_line(launcher, facing_point)
        const point_num = Math.floor(distance / long)

        let dx = 0
        let dy = distance
        if(!line.not_exist){
            dx = Math.floor(distance / Math.sqrt(line.k * line.k + 1))
            dy = dx * line.k
        }

        let ddx = Math.abs(Math.floor(dx / point_num))
        let ddy = Math.abs(Math.floor(dy / point_num))

        if (launcher.x > facing_point.x) {
            ddx = -ddx
        }
        if (launcher.y > facing_point.y) {
            ddy = -ddy
        }

        const result = []
        for (let i = 0; i < point_num; i++) {
            result.push(position(launcher.x + i * ddx, launcher.y + i * ddy))
        }
        return result
    }

    return {
        is_in_laser,
        get_line,
        get_y,
        get_y_int,
        positions_on_line,
    }
})