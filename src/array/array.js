/**
 * @param array
 * @param n
 */
_.initial = function (array, n, guard) {
  return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)))
}

/**
 * @param array
 * @param n
 */
_.first = _.head = _.take = function (array, n, guard) {
  if (array == null) return void 0
  if (n == null || guard) return array[0]
  return _.initial(array, array.length - n)
}

/**
 * @param array
 * @param n
 */
_.rest = _.tail = _.drop = function (array, n, guard) {
  return slice.call(array, n == null || guard ? 1 : n)
}
/**
 * @param array
 * @param n
 */
_.last = function (array, n, guard) {
  if (array == null) return void 0
  if (n == null || guard) return array[array.length - 1]
  return _.rest(array, Math.max(0, array.length - n))
}

/**
 * @param array 待展开数组
 * @param shallow 浅展开还是深展开 若shallow为true 则数组只展开一层
 */
_.flatten = function (array, shallow) {
  return flatten(array, shallow, false)
}
/**
 * 
 * @param {array} input 待展开数组
 * @param {boolean} shallow 是否深展开
 * @param {string} strict 严格模式下 input必须是数组
 * @param {number} startIndex 开始下标
 */
var flatten = function (input, shallow, strict, startIndex) {
  var output = [],
    idx = 0
  for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
    var value = input[i]
    if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
      // shallow为false 则递归 深入展开
      if (!shallow) value = flatten(value, shallow, strict)
      var j = 0,
        len = value.length
      output.length += len
      while (j < len) {
        output[idx++] = value[j++]
      }
    } else if (!strict) {
      //如果不是严格模式 value可以不是数组
      output[idx++] = value
    }
  }
  return output
}
// IE9以下, 对于对象是否是参数, 需要通过判断该对象是否含有callee属性进行判断
if (!_.isArguments(arguments)) {
  // 判断obj是否是arguments
  // 只有arguments才会有callee属性
  _.isArguments = function (obj) {
    return _.has(obj, 'callee')
  }
}

/**
 * 判断对象是否具有属性key
 * @param {object} obj
 * @param {string} key
 */
_.has = function (obj, key) {
  return obj != null && hasOwnProperty.call(obj, key)
}

/**
 * 返回去重后的副本
 * @param array 待去重数组
 * @param isSorted 数组是否有序 如果该参数设置为true 则课提高去重效率
 * @param iteratee 比较函数 默认===
 * @param context 执行上下文
 */
_.uniq = _.unique = function (array, isSorted, iteratee, context) {
  // 如果第二个参数不是Boolean 则应当理解为比较函数 并且数组无序
  if (!_.isBoolean(isSorted)) {
    context = iteratee
    iteratee = isSorted
    isSorted = false
  }
  if (iteratee != null) iteratee = cb(iteratee, context)
  var result = []
  var seen = [] // 标识数组
  for (var i = 0, length = genLength(array); i < length; i++) {
    var value = array[i],
      computed = iteratee ? iteratee(value, i, array) : value
    if (isSorted) {
      // 若数组有序 则seen只需反映最近一次见到的元素
      // !i 数组的第一个元素
      if (!i || seen !== computed) result.push(value)
      seen = computed
    } else if (iteratee) {
      // 如果尚未排序, 且存在比较函数, 亦即不能直接通过===判断
      // 此时需要借助于seen这个辅助数组存储计算后的数组元素
      if (!_.contains(seen, computed)) {
        seen.push(computed)
        result.push(value)
      }
    } else if (!_.contains(result, value)) {
      // 否则直接通过contains进行判断
      result.push(value)
    }
  }
  return result
}

_.union = function () {
  return _.uniq(flatten(arguments, true, true))
}

/**
 * 获得数组交集
 * @param array
 */
_.intersection = function (array) {
  var result = []
  var argsLength = arguments.length
  // 遍历第一个数组
  for (var i = 0, length = getLength(array); i < length; i++) {
    var item = array[i]
    // 若结果数组已包含此元素 跳过此次遍历
    if (_.contians(result, item)) continue
    for (var j = 1; j < argsLength; j++) {
      // 如果后面的数组都没有item 则item不是数组的交集
      if (!_.contains(arguments[j], item)) break
    }
    // 否则 item 就是数组的交集 
    if (j === argsLength) result.push(item)
  }
}

/**
 * 计算数组的差值 返回第一个数组中存在 其中数组都不存在的元素
 * @param array
 */
_.difference = function (array) {
  // 先展开剩余数组为rest数组
  var rest = flatten(arguments, true, true, 1)
  // 遍历array 过滤掉array中存在于rest数组的元素
  return _.filter(array, function (value) {
    return !_.contains(rest, value)
  })
}

/**
 * 给定若干数组 每个数组对应位置的元素提取出来放入新的分组 最后合并这些分组
 * @param array
 */
_.unzip = function (array) {
  var length = array && _.max(array, getLength).length || 0
  var result = Array(length)

  for (var index = 0; index < length; index++) {
    result[index] = _.pluck(array, index)
  }
  return result
}
_.zip = function () {
  return _.unzip(arguments)
}

_.object = function (list, values) {
  var result = {}
  for (var i = 0, length = getLength(list); i < length; i++) {
    if (values) {
      result[list[i]] = values[i]
    } else {
      result[list[i][0]] = list[i][1]
    }
  }
  return result
}
/**
 * @param start 起始位置
 * @param stop 结束位置
 * @param step 步长
 */
_.range = function (start, stop, step) {
  if (stop == null) {
    stop = start || 0
    start = 0
  }
  step = step || 1
  var length = Math.max(Math.cell((stop - start) / step), 0)
  var range = Array(length)
  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start
  }
  return range
}