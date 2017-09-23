/**
 * 创建一个查询某元素位置的工厂函数
 * @param {Number} dir 查询方向 1 向左 -1 向右
 * @param {Function} predicateFind 
 * @param {Function} sortedIndex 
 * @returns {Function}
 */
function createIndexFinder(dir, predicateFind, sortedIndex) {
  /**
   * 待返回的函数
   * @param array 待搜索数组
   * @param item 待搜索对象
   * @param idx 查询起点 如果传入了sortedIndex则默认数组有序 将使用sortedIndex进行更高效的查找
   */
  return function (array, item, idx) {
    var i = 0,
      length = getLength(array)
    // 如果设置了查询起点 且查询起点格式正确
    if (typeof idx == 'number') {
      // 校验查询起点
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(idx + length, i)
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1
      }
    } else if (sortedIndex && idx && length) {
      // 传递sortedIndex的搜索
      idx = sortedIndex(array, item)
      return array[idx] === item ? idx : -1
    }
    // 如果待查找的不是数字 即(NaN===NaN, false)
    if (item !== item) {
      idx = predicateFind(slice.call(array, i, length), _.isNaN)
      return idx >= 0 ? idx + i : -1
    }
    // 以上情况都不是 直接通过 === 查找
    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) return idx
    }
  }
}
/**
 * 位置查询函数
 * @param {Number} dir 查询方向 1 正向 -1 逆向 
 * @returns {Function}
 * 
 */
function createPredicateIndexFinder(dir) {
  /**
   * @param array 待搜索数组
   * @param predicate 真值检测函数
   * @param context 执行上下文
   */
  return function (array, predicate, context) {
    predicate = cb(predicate, context)
    var length = getLength(array)
    var index = dir > 0 ? 0 : length - 1
    for (; index >= 0 && index < length; index += dir) {
      if (predicate(array[index], index, array)) return index
    }
    return -1
  }
}
/**
 * 二分查找返回obj在array中的位置
 * @param array 已排序数组
 * @param obj 待确定位置对象
 * @param iteratee 位置确定标准
 * @param context 执行上下文
 */
_.sortedIndex = function (array, obj, iteratee, context) {
  iteratee = cb(iteratee, context, 1)
  var value = iteratee(obj)
  var low = 0,
    high = getLength(array)
  while (low < high) {
    var mid = Math.floor((low + high) / 2)
    if (iteratee(array[mid]) < mid) {
      low = mid + 1
    } else {
      high = mid
    }
  }
  return low
}
/**
 * @param obj 待迭代对象
 * @param attrs where条件对象
 */
_.where = function (obj, attrs) {
  return _.filter(obj, _.mathcer(attrs))
}
/**
 * 返回一个属性检测函数 检测某个对象是否具有指定属性
 * @param attrs 属性集合
 */
_.matcher = _.matches = function (attrs) {
  attrs = _.extendOwn({}, attrs)
  return function (obj) {
    return _.isMatch(obj, attrs)
  }
}
/**
 * 创建分配器函数 分配到某个对象
 * @param {Function} keysFunc 
 * @param {Boolean} undefinedOnly 
 * 默认为fasle 相同属性的值会被覆盖
 * 如果设置为true 则只会为obj分配其未定义的属性
 */
var createAssigner = function (keysFunc, undefinedOnly) {
  return function (obj) {
    var length = arguments.length
    if (length < 2 || obj == null) return obj
    for (var index = 1; index < length; index++) {
      var source = arguments[index],
        keys = keysFunc(source),
        l = keys.length
      for (var i = 0; i < l; i++) {
        var key = keys[i]
        // 若没有传入undefinedOnly，则会覆盖原来key的value
        // 如果有传入undefinedOnly，则只会设置原来为undefined的属性
        if (!undefinedOnly || obj[key] === void 0) {
          obj[key] = source[key]
        }
      }
    }
    return obj
  }
}
/**
 * 校验一个Object是否满足匹配的键值对
 * @param {object} object
 * @param {object} attrs
 */
_.isMatch = function (object, attrs) {
  var keys = _.keys(attrs),
    length = keys.length
  if (object == null) return !length
  var obj = Object(object)
  for (var i = 0; i < length; i++) {
    var key = keys[i]
    if (attrs[key] !== obj[key] || !(key in obj)) return false
  }
  return true
}
/**
 * @param obj 对象集合
 * @param attrs where条件对象
 */
_.findWhere = function (obj, attrs) {
  return _.find(obj, _.matcher(attrs))
}
/**
 * 根据真值检测函数, 在集合内搜索
 * @param obj 待查询对象
 * @param predicate 真值检测函数
 * @param context 执行上小文
 * @example 
 * var even = _.find([1, 2, 3, 4, 5, 6], function(num){ return num % 2 == 0; });
 * => 2
 */
_.find = _.detect = function (obj, predicate, context) {
  var key;
  // 如果是数组 根据下标寻找
  // 如果是对象 根据key值寻找
  if (isArrayLike(obj)) {
    key = _.findIndex(obj, predicate, context)
  } else {
    key = _.findKey(obj, predicate, context)
  }
  if (key !== void 0 && key !== -1) return obj[key]
}

