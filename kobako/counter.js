define([], () => {
    class Counter{
        constructor(life_span){
            this.life_span = life_span
            this.count = 0
        }
        is_over(){
            return this.count >= this.life_span
        }
        update(){
            this.count ++
        }
        reset(){
            this.count = 0
        }
    }
    return Counter
})