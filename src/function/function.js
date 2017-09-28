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