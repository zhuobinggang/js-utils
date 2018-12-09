/*

my_keyboard.mount_down(' ', () => {
    console.log('down')
})
my_keyboard.mount_up(' ', () => {
    console.log('up')
})
my_keyboard.mount_pressing(' ', () => {
    console.log('p')
})

*/

window.my_keyboard = (() => {
    const listener = {
        // 'a': {key_down_cb, key_up_cb, isDown, isUp, pressing}
    }

    function call(func) {
        func()
    }

    window.addEventListener('keydown', (e) => {
        e.preventDefault()
        const it = listener[e.key]
        if (it == null) {
            return
        }
        if (!it.pressing) { // first time press
            it.pressing = true
            it.key_down_cb.forEach(call)
        } else { // pressing
            it.pressing_cb.forEach(call)
        }
    })

    window.addEventListener('keyup', (e) => {
        e.preventDefault()
        const it = listener[e.key]
        if (it == null) {
            return
        }
        it.pressing = false
        it.key_up_cb.forEach(call)
    })

    function initial_listener() {
        return {
            key_down_cb: [],
            key_up_cb: [],
            pressing_cb: [],
            pressing: false,
        }
    }

    return {
        mount_down: function (key, cb) {
            if (listener[key] == null) {
                listener[key] = initial_listener()
            }
            listener[key].key_down_cb.push(cb)
        },
        mount_up: function (key, cb) {
            if (listener[key] == null) {
                listener[key] = initial_listener()
            }
            listener[key].key_up_cb.push(cb)
        },
        mount_pressing: function (key, cb) {
            if (listener[key] == null) {
                listener[key] = initial_listener()
            }
            listener[key].pressing_cb.push(cb)
        }
    }
})()

if(typeof define === 'function'){
    define(my_keyboard)
}