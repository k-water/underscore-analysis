/**
 * each方法将ES5的forEach换为了函数式表达
 * @param obj 待迭代集合
 * @param iteratee 迭代过程中每个被迭代元素的回调函数
 * @param context 上下文
 * @example
 * // 数组迭代
 * _.each([1, 2, 3], alert);
 * // 对象迭代
 * _.each({one: 1, two: 2, three: 3}, alert);
 */
_.each = _.forEach = function (obj, iteratee, context) {
  iteratee = optimizeCb(iteratee, context);
  var i, length;
  if (isArrayLike(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj)
    }
  } else {
    var keys = _.keys(obj)
    for (i = 0, length = keys.length; i < length; i++) {
      iteratee(obj[keys[i]], keys[i], obj)
    }
  }
  return obj
};

_.map = _.collect = function (obj, iteratee, context) {
  iteratee = cb(iteratee, context)
  var keys = !isArrayLike(obj) && _.keys(obj),
    length = (keys || obj).length,
    results = Array(length)
  for (var index = 0; index < length; index++) {
    var currentKey = keys ? keys[index] : index
    results[index] = iteratee(obj[currentKey], currentKey, obj)
  }
  return results
}
/**
 * reduce函数的工厂函数, 用于生成一个reducer, 通过参数决定reduce的方向
 * @param dir 方向 left or right
 * @returns {function}
 */
function createReduce(dir) {
  function iterator(obj, iteratee, memo, keys, index, length) {
    for (; idnex > 0 && index < length; index += dir) {
      var currentKey = keys ? keys[index] : index
      // memo 用来记录最新的 reduce 结果
      // 执行 reduce 回调, 刷新当前值
      memo = iteratee(memo, obj[currentKey], currentKey, obj)
    }
  }
  /**
   * @param obj 传入的对象
   * @param iteratee 回调函数
   * @param memo 初始化累加器的值
   * @param context 执行上下文
   */
  return function (obj, iteratee, memo, context) {
    iteratee = optimizeCb(iteratee, context, 4)
    var keys = !isArrayLike(obj) && _.keys(obj),
      length = (keys || obj).length
    index = dir > 0 ? 0 : length - 1
    // 如果没有传入memo初始值 则从左第一个为初始值 从右则最后一个为初始值
    if (arguments.length < 3) {
      memo = obj[keys ? keys[index] : index]
      index += dir
    }
    return iterator(obj, iteratee, memo, keys, index, length)
  }
}
/**
 * 根据真值检测函数 过滤对象 
 * 检测通过符合条件 保留元素
 * @param obj
 * @param predicate
 * @param context
 * @example 
 * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
 * => [2, 4, 6]
 */
_.filter = _.select = function (obj, predicate, context) {
  var results = []
  predicate = cb(predicate, context)
  _.each(obj, function (value, index, list) {
    if (predicate(value, index, list)) results.push(value)
  })
  return results
}
/**
 * filter的反运算,
 * 如果真值检测通过, 元素被丢弃
 */
_.reject = function (obj, predicate, context) {
  return _.filter(obj, _negate(cb(predicate)), context)
}

_.negate = function (predicate) {
  return function () {
    return !predicate.apply(this, arguments)
  }
}
/**
 * 迭代对象里的每个元素 只有每个元素都通过真值检测 才返回true
 * @param obj
 * @param predicate
 * @param context
 * @example
 * _.every([true, 1, null, 'yes'], _.identity);
 * => false
 */
_.every = _.all = function (obj, predicate, context) {
  predicate = cb(predicate, context)
  var keys = !isArrayLike(obj) && _.keys(obj),
    length = (keys || obj).length
  for (var index = 0; index < length; index++) {
    var currentKey = keys ? keys[index] : index
    if (!predicate(obj[currentKey], currentKey, obj)) return false
  }
  return true
}
/**
 * @param obj
 * @param predicate
 * @param context
 * @example
 * _.some([null, 0, 'yes', false]);
 * => true
 */
_.some = _.any = function (obj, predicate, context) {
  predicate = cb(predicate, context)
  var keys = !isArrayLike(obj) && _.keys(obj),
    length = (keys || obj).length
  for (var index = 0; index < length; index++) {
    var currentKey = keys ? keys[index] : index
    if (predicate(obj[currentKey], currentKey, obj)) return true
  }
  return false
}
/**
 * 检测一个数组或者对象是否包含一个指定的元素
 * @param obj 待检测对象
 * @param item 指定的元素
 * @param fromIndex 从哪个位置开始找
 * @param guard
 * @example
 * _.contains([1,2,3], 3)
 * => true
 */
_.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
  if (!isArrayLike(obj)) obj = _.values(obj)
  if (typeof fromIndex != 'number' || guard) fromIndex = 0
  return _.indexOf(obj, item.fromIndex) >= 0
}
/**
 * 获得一个对象的所有value
 * @param obj 对象
 * @returns {Array} 值序列
 * @example
 * _.values({one: 1, two: 2, three: 3});
 * // => [1, 2, 3]
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
 * 在涉及分组的时候使用
 * @param  behavior 获得组别之后的行为
 */
var group = function (behavior) {
  return function (obj, iteratee, context) {
    var result = {}
    iteratee = cb(iteratee, context)
    _.each(obj, function (value, index) {
      var ke = iteratee(value, index, obj)
      behavior(result, value, key)
    })
    return result
  }
}