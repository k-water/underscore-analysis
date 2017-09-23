/**
 * 生成随机序列
 * @param obj 待随机集合
 */
_.shuffle = function (obj) {
  var set = isArrayLike(obj) ? obj : _.values(obj)
  var length = set.length
  var shuffled = Array(length)
  for (var index = 0, rand; index < length; index++) {
    rand = _.random(0, index)
    if (rand !== index) shuffled[index] = shuffled[rand]
    shuffled[rand] = set[index]
  }
  return shuffled;
}

_.random = function (min, max) {
  if (max == null) {
    max = min
    min = 0
  }
  return min + Math.floor(Math.random() * (max - min + 1))
}
/**
 * 基于洗牌算法的随机取样函数
 * @param obj 对象或数组
 * @param n 返回随机元素的个数
 * @param guard
 */
_.sample = function (obj, n, guard) {
  if (n == null || guard) {
    if (!isArrayLike(obj)) obj = _.values(obj)
    return obj[_.random(obj.length - 1)]
  }
  return _.shuffle(obj).slice(0, Math.max(0, n))
}

/**
 * @param obj 对象或数组
 * @param iteratee 排序依据
 * @param context 执行上下文
 */
_.sortBy = function (obj, iteratee, context) {
  iteratee = cb(iteratee, context)
  return _.pluck(_.map(obj, function (value, index, list) {
    return {
      value: value,
      index: index,
      criteria: iteratee(value, index, list)
    }
  }).sort(function (left, right) {
    var a = left.criteria
    var b = right.criteria
    if (a !== b) {
      if (a > b || a === void 0) return 1
      if (a < b || b === void 0) return -1
    }
    return left.index - right.index
  }), 'value')
}