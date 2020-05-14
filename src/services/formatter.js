const TimeFormatter = {}

TimeFormatter.install = function (Vue) {   
   Vue.prototype.$timestamp = function (start, value) {
    const time = start + value * 1000
    return this.$moment(time).format("HH:mm:ss")
   }

}

// const Truncate = {}

// Truncate.install = function (Vue) {
//    Vue.prototype.$truncate = function (value, limit) {
//       if (value.length > limit) {
//          value = value.substring(0, (limit - 3)) + '...';
//       }
//       return value
//    }
// }

export default TimeFormatter