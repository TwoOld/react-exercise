import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { counterReducer } from './counter'

// applyMiddleware 引入中间件
// 中间件之间有依赖，被依赖的放前面
const store = createStore(
  combineReducers({ counter: counterReducer }),
  applyMiddleware(logger, thunk)
)

export default store
