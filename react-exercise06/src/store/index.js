import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { counterReducer } from './counter'
import { fruitReducer } from './fruits'
import { user } from './user'
import createSagaMeddleware from 'redux-saga'
import mySaga from './sagas'

// 1. 创建中间件
const mid = createSagaMeddleware()

// applyMiddleware 引入中间件
// 中间件之间有依赖，被依赖的放前面
const store = createStore(
  combineReducers({
    counter: counterReducer,
    fruits: fruitReducer,
    user
  }),
  applyMiddleware(logger, mid)
)

// 2. 运行 saga 监听
mid.run(mySaga)

export default store
