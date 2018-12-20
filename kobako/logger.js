/**
 * A logger can ajust showing logs according to the time
 */
define(['./counter.js'], (Counter)=>{
    class Logger{
        constructor(life_span){
            this.life_span = life_span
            this.logs = [/* string */]
            this.showing_logs = [/* {text,counter} */]
        }
        add(text){
            this.logs.push(text)
            const counter = new Counter(this.life_span)
            this.showing_logs.push({counter, text})
        }
        update(){
            this.showing_logs.forEach(l => {
                l.counter.update()
            })

            this.showing_logs = this.showing_logs.filter(l => {
                return ! l.counter.is_over()
            })
        }
        get_showing(){
            return this.showing_logs.map(log => {
                return log.text
            })
        }
        get_all(){
            return this.logs
        }
    }
    return Logger
})