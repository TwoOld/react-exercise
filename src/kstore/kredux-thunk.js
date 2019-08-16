// 自定义中间件
// 有两个参数：getState，dispatch
export default function({ dispatch, getState }) {
  return next => action => {
    // thunk逻辑：处理函数action
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }

    // 不是函数直接跳过
    return next(action)
  }
}
