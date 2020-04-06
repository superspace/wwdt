const TimeFormatter = {}

TimeFormatter.install = function (Vue) {   
   Vue.prototype.$timestamp = function (start, value) {
    const time = start + value * 1000
    return this.$moment(time).format("HH:mm:ss")
   }

}

export default TimeFormatter