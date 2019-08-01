# 目标

1. 掌握 redux
2. 掌握 react-redux 及其中间件
3. 实现 redux、react-redux 及其中间件

# 资源

1. [redux](https://www.redux.org.cn/)
2. react-redux
3. react-router

# 起步

tupian

## Redux

Redux 是 JavaScript 应用的状态容器。它保证程序行为一致性且易于测试。

### 安装 redux

`npm i redux -S`

### redux 上手

redux 较难上手，是因为上来就有太多的概念需要学习，用一个累加器举例

1. 需要一个 store 来存储数据
2. store 里的 reducer 初始化 state 并定义 state 修改规则
3. 通过 dispatch 一个 action 来提交对数据的修改
4. action 提交到 reducer 函数里，根据传入的 action 的 type，返回新的 state

```js
// src/store/index.js
import { createStore } from 'redux'

const counterReducer = function(state = 0, action) {
  switch (action.type) {
    case 'add':
      return state + 1
    case 'minus':
      return state - 1
    default:
      // 初始化
      return state
  }
}

const store = createStore(counterReducer)

export default store

// ReduxTest.js
import React, { Component } from 'react'
import store from '../store'

export default class ReduxTest extends Component {
  componentDidMount() {
    // 订阅状态变更
    store.subscribe(() => {
      this.forceUpdate()
    })
  }

  render() {
    return (
      <div>
        {store.getState()}
        <div>
          <button onClick={() => store.dispatch({ type: 'add' })}>+</button>
          <button onClick={() => store.dispatch({ type: 'minus' })}>-</button>
        </div>
      </div>
    )
  }
}
```

> redux 是单项非响应式的
> 1.createStore 创建 store
> 2.reducer 初始化、修改状态函数
> 3.getState 获取状态值
> 4.dispatch 提交更新
> 5.subscribe 变更订阅

### react-redux

每次都重新调用 render 和 getState 太 low 了，想用更 react 的方式来写，需要 react-redux 的支持

`npm i react-redux -S`

提供了两个 api

1. Provider 为后代组件提供 store
2. connect 为组件提供数据和变更方法

```js
// index.js 入口文件
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import store from './store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <App title="hello React" />
  </Provider>,
  document.getElementById('root')
)

// store/index.js
import { createStore } from 'redux'

const counterReducer = function(state = 0, action) {
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

const store = createStore(counterReducer)

export default store

// ReduxTest.js
import React, { Component } from 'react'
// import store from '../store'
import { connect } from 'react-redux'

// 参数1：mapStateToProps = (state) => { return { num:state } }
// 参数2：mapDispatchToProps = dispatch => { return { add: () => { dispatch({ type: 'add' }) } } }
@connect(
  state => ({ num: state }),
  {
    add: num => ({ type: 'add', payload: num }), // action creator
    minus: () => ({ type: 'minus' }) // action creator
  }
)
class ReduxTest extends Component {
  //   componentDidMount() {
  //     // 订阅状态变更
  //     store.subscribe(() => {
  //       this.forceUpdate()
  //     })
  //   }
  render() {
    return (
      <div>
        {/* {store.getState()} */}
        {this.props.num}
        <div>
          {/* <button onClick={() => this.props.dispatch({ type: 'add' })}>
            +
          </button>
          <button onClick={() => this.props.dispatch({ type: 'minus' })}>
            -
          </button> */}
          <button onClick={() => this.props.add(2)}>+</button>
          <button onClick={() => this.props.minus()}>-</button>
        </div>
      </div>
    )
  }
}

export default ReduxTest
```

> 重构水果列表案例为 redux 版

### 异步

react 默认只支持同步，实现异步任务比如延迟，网络请求，需要中间件的支持，比如我们试用最简单的 redux-thunk 和 redux-logger

`npm i redux-thunk redux-logger -S`

tupian

```js
// store/index.js
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

const counterReducer = function(state = 0, action) {
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
// applyMiddleware 引入中间件
// 中间件之间有依赖，被依赖的放前面
const store = createStore(counterReducer, applyMiddleware(logger, thunk))

export default store

// ReduxTest.js
@connect(
  state => ({ num: state }),
  {
    add: num => ({ type: 'add', payload: num }), // action creator
    minus: () => ({ type: 'minus' }), // action creator
    // 异步调用函数
    asyncAdd: () => dispatch => {
      setTimeout(() => {
        // 异步
        dispatch({ type: 'add' })
      }, 1000)
    }
  }
)

<button onClick={() => this.props.asyncAdd()}>+</button>
```

### 代码优化

#### 模块化

抽离 reducer 和 action，创建 store/counter.js

```js
export const add = num => ({ type: 'add', payload: num }) // action creator
export const minus = () => ({ type: 'minus' }) // action creator
// 异步返回的是函数
export const asyncAdd = () => dispatch => {
  // 异步调用在这里
  setTimeout(() => {
    dispatch({ type: 'add' })
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
```

store/index.js 修改后

```js
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { counterReducer } from './counter'

// applyMiddleware 引入中间件
// 中间件之间有依赖，被依赖的放前面
const store = createStore(counterReducer, applyMiddleware(logger, thunk))

export default store
```

ReduxTest.js

```js
import { add, minus, asyncAdd } from '../store/counter'

@connect(
  state => ({ num: state }),
  {
    add,
    minus,
    asyncAdd
  }
)
```

### combineReducers

store/index.js

```js
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
```

ReduxTest.js

```js
@connect(
  state => ({ num: state.counter }),
  {
    add,
    minus,
    asyncAdd
  }
)
```

## Redux 原理

### 核心实现

- 存储状态 state
- 获取状态 getState
- 更新状态 dispatch
- 变更订阅 subscribe

store/kredux.js

```js
// 闭包
export function createStore(reducer) {
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
```

使用 kredux，KReduxTest.js

```js
import React, { Component } from 'react'
import { createStore } from '../store/kredux'

const counterReducer = function(state = 0, action) {
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

const store = createStore(counterReducer)

export default class KReduxTest extends Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate())
  }
  render() {
    return (
      <div>
        {store.getState()}
        <div>
          <button onClick={() => store.dispatch({ type: 'add' })}>+</button>
          <button onClick={() => store.dispatch({ type: 'minus' })}>-</button>
        </div>
      </div>
    )
  }
}
```

### 实现 applyMiddleware

kredux.js

```js
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
  return fns.reduce((left, right) => (...args) => right(left(...args)))
}
```

### 自定义中间件

#### logger

KReduxTest.js

```js
import { applyMiddleware } from '../store/kredux'

// 自定义中间件
// 有两个参数：getState，dispatch
function logger() {
  // 返回真正的中间件任务执行函数
  return dispatch => action => {
    // 执行中间件任务
    console.log(`${action.type} 执行了！！！`)

    // 执行下一个中间件
    return dispatch(action)
  }
}

//使用
const store = createStore(counterReducer, applyMiddleware(logger))
```

#### thunk

KReduxTest.js

```js
const thunk = function({ getState }) {
  return dispatch => action => {
    // thunk逻辑：处理函数action
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }

    // 不是函数直接跳过
    return dispatch(action)
  }
}

// 使用
const store = createStore(counterReducer, applyMiddleware(logger, thunk))
```

### react-redux 原理

#### 实现 kreact-redux

核心任务：

- 实现一个高阶函数工厂 connect，可以根据传入**状态映射规则函数**和**派发器映射规则**来映射需要的属性，可以处理变更检测和刷新任务
- 实现一个 Provider 组件可以传递 store

范例：**kstore**

kstore/kreact-redux.js

```js
import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from './kredux'

export const connect = (
  mapStateToProps = state => state,
  mapDispatchToProps = {}
) => WrapComponent => {
  return class ConnectComponent extends React.Component {
    static contextTypes = {
      store: PropTypes.object
    }
    constructor(props, context) {
      super(props, context)
      this.state = {
        props: {}
      }
    }
    componentDidMount() {
      const { store } = this.context
      store.subscribe(() => this.update())
      this.update()
    }
    update() {
      const { store } = this.context
      const stateProps = mapStateToProps(store.getState())
      const dispatchProps = bindActionCreators(
        mapDispatchToProps,
        store.dispatch
      )
      this.setState({
        props: {
          ...this.state.props,
          ...stateProps,
          ...dispatchProps
        }
      })
    }
    render() {
      return <WrapComponent {...this.state.props} />
    }
  }
}
export class Provider extends React.Component {
  static childContextTypes = {
    store: PropTypes.object
  }
  getChildContext() {
    return { store: this.store }
  }
  constructor(props, context) {
    super(props, context)
    this.store = props.store
  }
  render() {
    return this.props.children
  }
}
```

**实现 bindActionCreators**

添加一个 bindActionCreators 能转换 actionCreator 为派发函数

kstore/kredux.js

```js
function bindActionCreator(creator, dispatch) {
  return (...args) => dispatch(creator(...args))
}
export function bindActionCreators(creators, dispatch) {
  return Object.keys(creators).reduce((ret, item) => {
    ret[item] = bindActionCreator(creators[item], dispatch)
    return ret
  }, {})
}
```

kstore/index.js

```js
import { createStore, applyMiddleware } from './kredux'
import logger from './kredux-logger'
import thunk from './kredux-thunk'
import { counterReducer } from './counter'

// applyMiddleware 引入中间件
// 中间件之间有依赖，被依赖的放前面
const store = createStore(counterReducer, applyMiddleware(logger, thunk))

export default store
```

kstore/counter.js

```js
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
```

kstore/kredux-logger.js

```js
// 自定义中间件
// 有两个参数：getState，dispatch
export default function() {
  // 返回真正的中间件任务执行函数
  return dispatch => action => {
    // 执行中间件任务
    console.log(`${action.type} 执行了！！！`)

    // 执行下一个中间件
    return dispatch(action)
  }
}
```

kstore/kredux-thunk.js

```js
// 自定义中间件
// 有两个参数：getState，dispatch
export default function({ getState }) {
  return dispatch => action => {
    // thunk逻辑：处理函数action
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }

    // 不是函数直接跳过
    return dispatch(action)
  }
}
```

**使用**

```js
// KReactReduxTest.js
import React, { Component } from 'react'
import { connect } from '../kstore/kreact-redux'
import { add, minus, asyncAdd } from '../kstore/counter'

@connect(
  state => ({ num: state }),
  {
    add,
    minus,
    asyncAdd
  }
)
class KReactReduxTest extends Component {
  render() {
    return (
      <div>
        {this.props.num}
        <div>
          <button onClick={() => this.props.add(2)}>+</button>
          <button onClick={() => this.props.minus()}>-</button>
          <button onClick={() => this.props.asyncAdd()}>+</button>
        </div>
      </div>
    )
  }
}

export default KReactReduxTest

// index.js 入口
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
// import store from './store'
// import { Provider } from 'react-redux'
import store from './kstore'
import { Provider } from './kstore/kreact-redux'

ReactDOM.render(
  <Provider store={store}>
    <App title="hello React" />
  </Provider>,
  document.getElementById('root')
)
```
