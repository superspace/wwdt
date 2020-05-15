export default function (value, limit=100) {
   if (value.length > limit) {
      value = value.substring(0, (limit - 3)) + '...';
   }
   return value
}