import { createStore, applyMiddleware } from './kredux'
import logger from './kredux-logger'
import thunk from './kredux-thunk'
import { counterReducer } from './counter'

// applyMiddleware 引入中间件
// 中间件之间有依赖，被依赖的放前面
const store = createStore(counterReducer, applyMiddleware(logger, thunk))

export default store
