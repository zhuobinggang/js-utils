window.my_sprite_util = (() => {
    function y_axis_stop(sprite) {
        sprite.vy = 0
    }
    function x_axis_stop(sprite) {
        sprite.vx = 0
    }
    return {
        move_by_keyboard: (player, velocity, kb) => {
            player.vx = 0
            player.vy = 0
            player.facing = 1 // 0 1 2 3: up right down left
            kb.mount_down('w', () => {
                player.vy = -velocity
                player.facing = 0
            })
            kb.mount_up('w', () => { y_axis_stop(player) })
            kb.mount_down('a', () => {
                player.vx = -velocity
                player.facing = 3
            })
            kb.mount_up('a', () => { x_axis_stop(player) })
            kb.mount_down('s', () => {
                player.vy = velocity
                player.facing = 2
            })
            kb.mount_up('s', () => { y_axis_stop(player) })
            kb.mount_down('d', () => {
                player.vx = velocity
                player.facing = 1
            })
            kb.mount_up('d', () => { x_axis_stop(player) })
        },
        ani_by_keyboard: (player, kb) => {
            kb.mount_down('w', () => { player.setAni('up') })
            // kb.mount_pressing('w', () => { player.setAni('up') })
            kb.mount_up('w', () => {
                if (player.anime.name == 'up')
                    player.setAni('up_stop')
            })
            kb.mount_down('a', () => { player.setAni('left') })
            // kb.mount_pressing('a', () => { player.setAni('left') })
            kb.mount_up('a', () => {
                if (player.anime.name == 'left')
                    player.setAni('left_stop')
            })
            kb.mount_down('s', () => { player.setAni('down') })
            // kb.mount_pressing('s', () => { player.setAni('down') })
            kb.mount_up('s', () => {
                if (player.anime.name == 'down')
                    player.setAni('down_stop')
            })
            kb.mount_down('d', () => { player.setAni('right') })
            // kb.mount_pressing('d', () => { player.setAni('right') })
            kb.mount_up('d', () => {
                if (player.anime.name == 'right')
                    player.setAni('right_stop')
            })
        },
        is_collided: (r1, r2) => {

            //Define the variables we'll need to calculate
            let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

            //hit will determine whether there's a collision
            hit = false;

            //Find the center points of each sprite
            r1.centerX = r1.x + r1.width / 2;
            r1.centerY = r1.y + r1.height / 2;
            r2.centerX = r2.x + r2.width / 2;
            r2.centerY = r2.y + r2.height / 2;

            //Find the half-widths and half-heights of each sprite
            r1.halfWidth = r1.width / 2;
            r1.halfHeight = r1.height / 2;
            r2.halfWidth = r2.width / 2;
            r2.halfHeight = r2.height / 2;

            //Calculate the distance vector between the sprites
            vx = r1.centerX - r2.centerX;
            vy = r1.centerY - r2.centerY;

            //Figure out the combined half-widths and half-heights
            combinedHalfWidths = r1.halfWidth + r2.halfWidth;
            combinedHalfHeights = r1.halfHeight + r2.halfHeight;

            //Check for a collision on the x axis
            if (Math.abs(vx) < combinedHalfWidths) {

                //A collision might be occurring. Check for a collision on the y axis
                if (Math.abs(vy) < combinedHalfHeights) {

                    //There's definitely a collision happening
                    hit = true;
                } else {

                    //There's no collision on the y axis
                    hit = false;
                }
            } else {

                //There's no collision on the x axis
                hit = false;
            }

            //`hit` will be either `true` or `false`
            return hit;
        },
        emit_by_keyboard: (player, key, kb) => {
            player.emitting = false
            kb.mount_down(key, () => {
                player.emitting = true
            })
            kb.mount_up(key, () => {
                player.emitting = false
            })
        }
    }
})()

if (typeof define === 'function') {
    define(() => { return my_sprite_util })
}