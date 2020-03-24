const TimeFormatter = {}

TimeFormatter.install = function (Vue) {

   console.log('TimeFormatter.install'); // eslint-disable-line no-console
   
   Vue.prototype.$timestamp = function (start, value) {
    const time = start + value * 1000
    return this.$moment(time).format("HH:mm:ss")
   }

}

export default TimeFormatter