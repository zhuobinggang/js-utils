window.MyTicker = (() => {


    class MyTicker{

        constructor(second){
            this.delta = second*1000
            this.cbs = []
            this.started = null // For destoying
        }

        add(cb){
            this.cbs.push(cb)
        }

        update(){
            this.cbs.forEach(cb => {cb()})
        }

        start(){
            const update = this.update.bind(this)
            this.started = setInterval(update,this.delta)
        }

        destroy(){
            if(this.started != null){
                clearInterval(this.started)
                this.started = null
            }
        }

    }

    return MyTicker

})()

if(typeof define === 'function'){
    define(() => {
        return MyTicker
    })
}