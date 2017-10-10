/**
 * 获取obj的value值
 * 返回值的数组
 */
_.values = function (obj) {
  var keys = _.keys(obj)
  var length = keys.length
  var values = Array(length)
  for (var i = 0; i < length; i++) {
    values[i] = obj[keys[i]]
  }
  return values
}

/**
 * 遍历obj各个key 返回一个新的obj
* var student1 = {
*     name: 'water',
*     age: 20
* };
*
* student2 = _.map(student1, function(value, key, obj){
*     if (key === 'age')
*         return value*2;
*     return value;
* });
* // => student2: {name:'water', age: 40}
 * @param obj
 * @param iteratee 迭代器 
 * @param context
 */
_.mapObject = function (obj, iteratee, context) {
  iteratee = cb(iteratee, context)
  var keys = _.keys(obj),
    length = keys.length,
    results = {},
    currentKey
  for (var index = 0; index < length; index++) {
    currentKey = keys[index]
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj)
  }
  return results
}