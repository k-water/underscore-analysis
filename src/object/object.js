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

/**
 * 返回新的数据结构
 * 将obj的key value拿出来
 * 数组的每一项都是[k,v]形式
 */
_.pairs = function (obj) {
  var keys = _.keys(obj)
  var length = keys.length
  var pairs = Array(length)
  for (var i = 0; i < length; i++) {
    pairs[i] = [keys[i], obj[keys[i]]]
  }
  return pairs
}
/**
 * 交换obj的key value值
 */
_.invert = function (obj) {
  var result = {}
  var keys = _.keys(obj)
  for (var i = 0, length = keys.length; i < length; i++) {
    result[obj[keys[i]]] = keys[i]
  }
  return result
}

/**
 * 获取obj中的方法
 * 最后返回的结果按字典序排序
 */
_.functions = _.methods = function (obj) {
  var names = []
  for (var key in obj) {
    if (_.isFunction(obj[key])) names.push(key)
  }
  return name.sort()
}

/**
 * 返回obj符合条件的key值
 * @param obj
 * @param predicate 断言函数
 * @param context 执行上下文
 */
_.findKey = function (obj, predicate, context) {
  predicate = cb(predicate, context)
  var keys = _.keys(obj),
    key
  for (var i = 0, length = keys.length; i < length; i++) {
    key = keys[i]
    if (predicate(obj[key], key, obj)) return key
  }
}
/**
 * 浅克隆一个对象
 * @param {object|array} obj 待克隆对象
 */
_.clone = function (obj) {
  if (!_.isObject(obj)) return obj
  return _.isArray(obj) ? obj.slice() : _.extend({}, obj)
}

/**
 * 过滤obj 返回新的副本
 * 返回obj的拷贝 该拷贝只包含符合条件的属性
 * @param object
 * @param oiteraee 函数或属性
 * @param context 执行上下文
 */
_.pick = function (object, oiteratee, context) {
  var result = {},
    obj = object,
    iteratee, keys
  if (obj == null) return result
  // 无论第二个参数是key值还是断言函数
  // 最后都会被优化为一个真值检测函数 
  if (_.isFunction(oiteratee)) {
    keys = _.allKeys(obj)
    iteratee = optimizeCb(oiteratee, context)
  } else {
    // 将keys扁平化 
    keys = flatten(arguments, false, false, 1)
    iteratee = function (value, key, obj) {
      return key in obj
    }
    obj = Object(obj)
  }
  //返回符合条件的副本 
  for (var i = 0, length = keys.length; i < length; i++) {
    var key = keys[i]
    var value = obj[key]
    if (iteratee(value, key, obj)) resule[key] = value
  }
  return result
}

/**
 * _.omit函数功能跟_.pick相反
 * 过滤掉黑名单中的属性
 * @param obj
 * @param iteratee 迭代器
 * @param context 执行上下文
 */
_.omit = function(obj, iteratee, context) {
  if(_.isFunction(iteratee)) {
    iteratee = _.negate(iteratee)
  } else {
    var keys = _.map(flatten(arguments, false, false, 1), String)
    iteratee = function(value, key) {
      return !_.contains(keys, key)
    }
  }
  return _.pick(obj, iteretee, context)
}