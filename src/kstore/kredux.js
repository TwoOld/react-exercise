// 闭包
export function createStore(reducer, enhancer) {
  // 若存在 enhancer
  if (enhancer) {
    return enhancer(createStore)(reducer)
  }

  let currentState = undefined
  const currentListeners = []
  function getState() {
    return currentState
  }

  function dispatch(action) {
    // 修改
    currentState = reducer(currentState, action)
    // 变更通知
    currentListeners.forEach(cb => cb())

    return action
  }

  function subscribe(cb) {
    currentListeners.push(cb)
  }

  // 初始化状态
  dispatch({ type: '@ArchieChiu' })

  // 暴露
  return {
    getState,
    dispatch,
    subscribe
  }
}

export function applyMiddleware(...middlewares) {
  return createStore => (...args) => {
    // 先完成之前 createStore 工作
    const store = createStore(...args)
    let dispatch = store.dispatch
    // 强化dispatch
    const midApi = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    // [fn1(dispatch), fn2(dispatch)] => fn(dispatch) {}
    const chain = middlewares.map(mw => mw(midApi))
    // 强化 dispatch，让它可以按顺序执行中间件函数
    dispatch = compose(...chain)(store.dispatch)

    // 返回全新 store，更新强化过的 dispatch 函数
    return {
      ...store,
      dispatch
    }
  }
}

export function compose(...fns) {
  if (fns.length === 0) {
    return arg => arg
  }
  if (fns.length === 1) {
    return fns[0]
  }
  // 将参数 函数数组 聚合成 一个函数 [fn1, fn2] => fn2(fn1())
  return fns
    .reverse()
    .reduce((left, right) => (...args) => right(left(...args)))
}

function bindActionCreator(creator, dispatch) {
  return (...args) => dispatch(creator(...args))
}
export function bindActionCreators(creators, dispatch) {
  return Object.keys(creators).reduce((ret, item) => {
    ret[item] = bindActionCreator(creators[item], dispatch)
    return ret
  }, {})
}
