/**
//Example:

function add(x,y){
    console.log('called!')
    return x + y
}
const lazy_add = my_lazy(add)
lazy_add(1,2)
// -> called!
// -> 3
lazy_add(1,2)
// -> 3

 */

window.my_lazy = (() => {
    const storage = {
        //name : [{args, value}]
    }

    function is_array_equal(a1,a2){
        if(a1.length != a2.length){
            return false
        }
        for(let i = 0;i<a1.length;i++){
            if(a1[i] != a2[i]){
                return false
            }
        }
        return true
    }

    function value(memories, ...args) {
        const it = memories.find(m => is_array_equal(m.args, args))

        if(it == null){
            return null
        }
        return it.value
    }

    const result = (func) => {
        storage[func.name] = []

        return (...args) => {
            const v = value(storage[func.name], ...args)
            if(v != null){
                return v
            }
            const new_value = func(...args)
            storage[func.name].push({
                args, value: new_value
            })
            return new_value
        }
    }

    return result
})()