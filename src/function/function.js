/**
 * 绑定函数上下文
 * @param {Function} sourceFunc 
 * @param {Function} boundFunc 
 * @param {object} context 
 * @param {this} callingContext 
 * @param {params} args 
 */
var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
  if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args)
  var self = baseCreate(sourceFunc.prototype)
  var result = sourceFunc.apply(self, args)
  if (_.isObject(result)) return result
  return self
}

/**
 * @param func 待绑定函数
 * @param context 执行上下文
 */
_.bind = function (func, context) {
  if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1))
  if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function')
  var args = slice.call(arguments, 2)
  var bound = function () {
    return executeBound(func, bound, context, this, args.concat(slice.call(arguments)))
  }
  return bound
}

/**
 * 绑定对象方法的this到obj上
 */
_.bindAll = function (obj) {
  var i, length = arguments.length,
    key
  if (length <= 1) throw new Error('bindAll must be passed function names')
  for (i = 1; i < length; i++) {
    key = arguments[i]
    obj[key] = _.bind(obj[key], obj)
  }
  return obj
}

/**
 * 偏应用一个函数
 * @param func 待应用的函数
 */
_.partial = function (func) {
  var boundArgs = slice.call(arguments, 1)
  var bound = function () {
    //position用来标识当前赋值的arguments的最新位置
    var position = 0,
      length = boundArgs.length
    var args = Array(length)
    for (var i = 0; i < length; i++) {
      // 判断当前参数是不是占位符 如果是则跳过 
      // 赋值新的参数 并刷新position的位置
      args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i]
    }
    // 若arguments还没被处理完 则全部push到args中
    while (position < arguments.length) args.push(arguments[position++])
    // 绑定执行上下文
    return executeBound(func, bound, this, this, args)
  }
  // 返回闭包函数
  return bound
}

/**
 * 缓存函数
 * @param func 让func具备缓存的功能
 * @param hasher 定义如何获得缓存
 */
_.memoize = function (func, hasher) {
  var memoize = function (key) {
    // 先获得已有的缓存
    var cache = memoize.cache
    // 获取缓存地址
    // hasher函数自定义获取缓存的位置
    // 若没有传递 则以key标识
    var address = '' + (hasher ? hasher.apply(this, arguments) : key)
    // 如果缓存不存在 则调用函数执行
    if (!_.has(cache, address)) cache[address] = func.apply(this, arguments)
    // 否则直接返回缓存
    return cache[address]
  }
  // 初始化缓存
  memoize.cache = {}
  return memoize
}

_.delay = function (func, wait) {
  var args = slice.call(arguments, 2)
  return setTimeout(function () {
    return func.apply(null, args)
  }, wait)
}

_.defer = _.partial(_.delay, _, 1)

/**
 * 返回一个节流函数 该函数的执行频率会被限制
 * @param func 
 * @param wait 等待时间
 * @param options 一些配置 leading & tailing
 */
_.throttle = function (func, wait, options) {

  // context 函数的执行上下文 args 函数执行所需要的函数 result 缓存func执行的result
  var context, args, result
  // timeout标识最近一次被追踪的调用
  var timeout = null
  // 最近一次func被调用的时间点
  var previous = 0
  // options提供两个参数的配置 leading &tailing
  if (!options) options = {}
  // 创建一个延后执行的函数
  var later = function () {
    // 执行时 刷新最近一次调用时间
    previous = options.leading === false ? 0 : _.now()
    // 清空定时器
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }
  // 返回一个节流函数
  return function () {
    // 调用func时 记录当前的时间戳
    var now = _.now()
    // 判断是否是第一次调用
    if (!previous && options.leading === false) prevous = now
    // 延时执行的时间
    // wait - (当前时间 - 上一次调用的时间)
    var remaining = wait - (now - previous)
    // 记录func的执行上下文和参数
    context = this
    args = arguments
    // 通过计算判断是否能立即执行
    if (remaining <= 0 || remaining > wait) {
      // 清除之前的延时执行 排除回调在同一时间发生的情况
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      // 刷新最近一次func被调用的时间点
      previous = now
      // 执行func
      result = func.apply(context, args)
      // 再次检查timeout 因为func再执行的过程中可能会有新的timeout被设置
      // 如果timeout被清空了 那么context args也没意义 清空context和args
      if (!timeout) context = args = null
    } else if (!timeout && options.tailing !== false) {
      // 如果设置了tailing 暂缓此次调用
      timeout = setTimeout(later, remaining)
    }
    // 返回func执行的结果
    return result
  }
}

/**
 * 防抖函数
 * @param func
 * @param wait 等待时间
 * @param immediate 是否允许立即执行
 */
_.debounce = function (func, wait, immediate) {
  // timeout 定时器 context 执行下文 args 函数执行参数
  // timestamp 当前时间戳 result 缓存func执行结果
  var timeout, args, context, timestamp, result
  var later = function () {
    // 最后一次调用
    var last = _.now() - timestamp
    if (last < wait && last >= 0) {
      // 刷新timeout
      timeout = setTimeout(later, wait - last)
    } else {
      // 清空定时器
      timeout = null
      if (!immediate) {
        // 执行func
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }
  return function () {
    context = this
    args = arguments
    // 当前时间戳
    timestamp = _.now()
    // 能否被立即执行
    var callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}

/**
 * 返回函数序列的组合
 * 执行函数组合的时候 不断执行函数组合中的函数
 * 并把当前函数执行的结果作为参数传递给下一函数做
 * 如果传入的函数的序列是 A B C
 * 执行的顺序则为 C B A
 */
_.compose = function () {
  // 获得函数组合
  var args = arguments
  // 以最后一个传入的函数作为首个执行的
  var start = args.length - 1
  return function () {
    // 逐个执行 获得结果
    var i = start
    var result = args[start].apply(this, arguments)
    while (i--) result = args[i].call(this, result)
    return result
  }
}

/**
 * 返回一个after函数
 * 该函数执行times次后
 * 每次执行都会执行回调函数func
 */
_.after = function (times, func) {
  return function () {
    if (--times < 1) {
      return func.apply(this, arguments)
    }
  }
}

/**
 * 返回一个before函数
 * 该函数在执行times之前
 * 每次执行都会执行回调函数func并返回结果
 * 执行times次后
 * before不再变化
 */
_.before = function (times, func) {
  // 缓存最近一次执行func的结果 当执行times后
  // memo不再变化
  var memo
  return function () {
    if (--times > 0) {
      memo = func.apply(this, arguments)
    }
    if (time <= 1) func = null
    return memo
  }
}

/**
 * 应用偏函数
 * 包装_.before函数
 * 保证一个函数只执行一次
 */
_.once = _.partial(_.before, 2)

/**
 * 使用wrapper对func进行包裹
 * 使func的执行前后能融入更多的业务逻辑
 */
_.wrap = function(func, wrapper) {
  return _.partial(wrapper, func)
}