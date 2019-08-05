export const add = num => ({ type: 'add', payload: num }) // action creator
export const minus = num => ({ type: 'minus', payload: num }) // action creator
// 异步返回的是函数
export const asyncAdd = num => dispatch => {
  // 异步调用在这里
  setTimeout(() => {
    dispatch({ type: 'add', payload: num })
  }, 1000)
}

export const counterReducer = function(state = 0, action) {
  const num = action.payload || 1
  switch (action.type) {
    case 'add':
      return state + num
    case 'minus':
      return state - num
    default:
      // 初始化
      return state
  }
}
