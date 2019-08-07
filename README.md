# 目标

1. 掌握 redux 异步方案 - redux-saga
2. 掌握数据流方案 - dva
3. 掌握企业级应用框架 - umi

# 资源

1. umi
2. dva
3. redux-saga
4. generator

# 起步

## redux-saga 使用

- 概述: redux-saga 使副作用 (数据获取、浏览器缓存获取) 易于管理、执行、测试和失败处理
- 安装: `npm i redux-saga -S`
- 使用: 用户登录

创建一个 ./store/sagas.js 处理用户登录请求

```js
import { call, put, takeEvery } from 'redux-saga/effects'

// 模拟登录
const UserService = {
  login(uname) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (uname === 'Jerry') {
          resolve({ id: 1, name: 'Jerry', age: 18 })
        } else {
          reject('用户名或密码错误')
        }
      }, 1000)
    })
  }
}

// worker saga
function* login(action) {
  try {
    yield put({ type: 'requestLogin' })
    // 调用异步登录请求
    const result = yield call(UserService.login, action.uname)
    yield put({ type: 'loginSuccess', result })
  } catch (message) {
    yield put({ type: 'loginFailure', payload: message })
  }
}

// watcher saga
function* mySaga() {
  yield takeEvery('login', login)
}

export default mySaga
```

创建 ./store/user.js 用户状态管理的 reducer

```js
export const user = (
  state = { isLogin: false, loading: false, error: '' },
  action
) => {
  switch (action.type) {
    case 'requestLogin':
      return { isLogin: false, loading: true, error: '' }
    case 'loginSuccess':
      return { isLogin: true, loading: false, error: '' }
    case 'loginFailure':
      return { isLogin: false, loading: false, error: action.message }
    default:
      return state
  }
}

// 派发动作依然是对象而非函数
export function login(uname) {
  return { type: 'login', uname }
}
```

注册 redux-saga, ./store/index.js

```js
import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger'
import { user } from './user'
import createSagaMeddleware from 'redux-saga'
import mySaga from './sagas'

// 1. 创建中间件
const mid = createSagaMeddleware()

const store = createStore(
  combineReducers({
    user
  }),
  applyMiddleware(logger, mid)
)

// 2. 运行 saga 监听
mid.run(mySaga)

export default store
```

测试, 改造 RouterTest.js

```js
// login
const Login = connect(
  state => ({
    isLogin: state.user.isLogin,
    loading: state.user.loading,
    error: state.user.error
  }),
  { login }
)(function({ location, isLogin, login, loading, error }) {
  const redirect = location.state.redirect || '/'

  // 若已登陆重定向至redirect
  if (isLogin) return <Redirect to={redirect} />

  return (
    <div>
      <p>用户登录</p>
      <hr />
      {/* 显示错误信息 */}
      {error && <p>{error}</p>}
      {/* 登录传参 */}
      <button onClick={() => login('erry')} disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </button>
    </div>
  )
})

// PrivateRoute
const PrivateRoute = connect(state => ({
isLogin: state.user.isLogin
}))(function ({ component: Component, isLogin, ...rest }) {
}
```

> redux-saga 基于 generator 实现，使用前搞清楚 generator 相当重要

## dva

dva 是一个基于 [redux]() 和 [redux-saga]() 的数据流方案, 为了简化开发体验, dva 内置了 [react-router]() 和 [fetch]()。

dva 可以作为一个轻量级的应用程序框架

tupian

## umi

- 开箱即用, 内置 react、react-router 等
- 约定路由, 同时支持配置的路由方式
- 完善的插件体系, 覆盖从源码到构建产物的每个声明周期
- 高性能, 通过插件支持 PWA、以路由为单元的 code splitting 等
- 支持静态页面导出, 适配各种环境, 比如中台业务、无线业务、egg、支付宝钱包、云凤蝶等
- 开发启动快, 支持一键开启 dll 和 hard-source-webpack-plugin 等
- 一键兼容到 IE9, 基于 umi-plugin-polyfills
- 完善的 TypeScript 支持, 包括 d.ts 定义和 umi test
- 与 dva 数据流的深入融合, 支持 duck directory、model 的自动加载、code splitting 等

### umi 应用约定目录结构

- pages 页面
- components 组件
- layouts 布局
- models 状态
- config 配置
- mock 数据模拟
- test 测试等

### umi 基本使用

#### 安装

`npm i umi -g`

#### 项目目录

```
md umi-app
cd umi-app
```

#### 新建 index 页

```
umi g page index
umi g page about
```

#### 起服务看效果

```
umi dev
```

> 访问 index: http://localhost:8000
> 访问 about: http://localhost:8000/about

#### 动态路由

以\$开头的文件或目录

```
umi g page users/'$id'
```

获取参数和以前写法相同

```js
export default function({ match }) {
  return (
    <div>
      <h1>user id: {match.params.id}</h1>
    </div>
  )
}
```

#### 嵌套路由

目录下面出现\_layout 组件则会转换路由配置为嵌套路由

```js
// 创建父组件 umi g layout ./users
export default function(props) {
  return (
    <div>
      <h1>Page _layout</h1>
      <div>{props.children}</div>
    </div>
  )
}
// 创建兄弟组件 umi g page users/index
```

#### 页面跳转

```js
// 用户列表跳转至用户详情页, users/index.js
import Link from 'umi/link'
import router from 'umi/router'
export default function() {
  return (
    <div className={styles.normal}>
      <h1>用户列表</h1>
      <ul>
        {users.map(u => (
          // 声明式
          // <li key={u.id}>
          // <Link to={`/users/${u.id}`}>{u.name}</Link>
          // </li>
          // 命令式
          <li key={u.id} onClick={() => router.push(`/users/${u.id}`)}>
            {u.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

#### 404 页面

约定 `pages/404.js` 为 404 页面，需返回 React 组件。

创建 404 页面: `umi g page ./404`

> 开发模式下, umi 会添加一个默认的 404 页面来辅助开发，可以通过精确访问/404 来验证 404 页面

#### 布局页

约定`src/layouts/index.js`为全局路由，返回一个 React 组件，通过`props.children`渲染子组件

- 创建布局页面: `umi g page ../layouts/index`

```js
export default function(props) {
  return (
    <div>
      <h1>Layouts index</h1>
      <div>{props.children}</div>
    </div>
  )
}
```

> 注意重启生效

- 针对特定路由指定布局页

```js
if (props.location.pathname === '/404' || props.location.pathname === 'login') {
  return <>{props.children}</>
}
```

#### 通过注释扩展路由

约定路由文件的首个注释如果包含 yaml 格式的配置, 则会被用于扩展路由

- 权限路由, about.js

```js
/**
 * title: 用户中心
 * Routes:
 * - ./routes/PrivateRoute.js
 */
```

- 创建./routes/PrivateRoute.js

```js
import Redirect from 'umi/redirect'

export default function PrivateRoute(props) {
  if (new Date().getDay() % 2 === 0) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { redirect: props.location.pathname }
        }}
      />
    )
  }
  return <div>PrivateRoute{props.children}</div>
}
```

> 创建登录验页面: umi g page login

### 引入 dva

#### 安装 umi-plugin-react

`npm i umi-plugin-react -D`

> Win10 有权限错误，通过管理员权限打开 vscode

#### 配置

创建配置文件：.umirc.js

```js
export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: true
      }
    ]
  ]
}
```

#### 创建 model

model 用来维护页面数据状态

- 创建 src/models/goods.js

```js
export default {
  namespace: 'goods', // model 的命名控件，区分多个 model
  state: [{ title: 'web' }], // 初始状态
  effects: {}, // 异步操作
  reducers: {
    // 更新状态
    addGood(state, action) {
      return [...state, { title: action.payload }]
    }
  }
}
```

> 1. namespace: model 的命名控件, 只能用字符串。一个大型应用可能包含多个 model, 通过 namespace 区分
> 2. state: 保存状态数据
> 3. reducer: 用于修改 state, 由 action 触发。reducer 是一个纯函数，它接受当前的 state 以及一个 action 对象。action 对象里面可以包含数据体 (payload) 作为入参，返回一个新的 state。
> 4. effects: 用于处理异步操作 (例如: 与服务端交互) 和业务逻辑, 也是由 action 触发。但是它不可以修改 state，要通过触发 action 调用 reducer 实现对 state 的间接操作。

#### 使用状态

类似 redux, 使用 connect 获取数据状态并映射给组件

- 创建页面 goods.js: `umi g page goods`

```js
import styles from './goods.css'
import { connect } from 'dva'

export default connect(
  state => ({ goodsList: state.goods }) // 获取指定命名空间的模型状态
)(function({ goodsList, addGood }) {
  return (
    <div className={styles.normal}>
      <h1>Page goods</h1>
      <ul>
        {goodsList.map(good => (
          <li key={good.title}>{good.title}</li>
        ))}
      </ul>
    </div>
  )
})
```

- 更新模型 src/models/goods.js

```js
export default {
  namespace: 'goods', // model 的命名控件，区分多个 model
  state: [{ title: 'web' }], // 初始状态
  effects: {}, // 异步操作
  reducers: {
    // 更新状态
    addGood(state, action) {
      return [...state, { title: action.payload }]
    }
  }
}
```

- 调用 reducer: goods.js

```js
export default connect(
  state => ({ goodsList: state.goods }), // 获取指定命名空间的模型状态
  {
    addGood: title => ({ type: 'goods/addGood', payload: title })
  }
)(function({ goodsList, addGood }) {
  return (
    <div className={styles.normal}>
      <h1>Page goods</h1>
      <ul>
        {goodsList.map(good => (
          <li key={good.title}>{good.title}</li>
        ))}
      </ul>
      <button onClick={() => addGood('商品' + new Date().getTime())}>
        add
      </button>
    </div>
  )
})
```

#### 数据 mock

模拟数据接口

mock 目录和 pages 平级, 新建 mock/goods.js

```js
let data = [{ title: 'web' }, { title: 'java' }]
export default {
  // "method url": Object 或 Array
  // "get /api/goods": { result: data },

  // "method url": (req, res) => {}
  'get /api/goods': function(req, res) {
    setTimeout(() => {
      res.json({ result: data })
    }, 250)
  }
}
```

> 注意重启生效

#### effect 异步处理

基于 redux-saga, 使用 generator 函数来控制异步流程

- 请求接口, models/goods.js

```js
// 首先安装axios
import axios from 'axios'

// api
function getGoods() {
  return axios.get('/api/goods')
}

export default {
  namespace: 'goods', // model 的命名控件，区分多个 model
  state: [], // 初始状态
  effects: {
    // 异步操作, action-动作, 参数等, saga-接口对象
    *getList(action, { call, put }) {
      const res = yield call(getGoods)
      yield put({ type: 'init', payload: res.data.result })
    }
  },
  reducers: {
    // 更新状态
    init(state, action) {
      return action.payload
    },
    addGood(state, action) {
      return [...state, { title: action.payload }]
    }
  }
}
```

- 组件调用, goods.js

```js
import { useEffect } from 'react'

export default connect(
  state => ({ goodsList: state.goods, loading: state.loading }), // 获取指定命名空间的模型状态
  {
    addGood: title => ({ type: 'goods/addGood', payload: title }),
    getList: () => ({
      // 获取数据
      type: 'goods/getList'
    })
  }
)(function({ goodsList, addGood, getList, loading }) {
  useEffect(() => {
    getList()
  }, [])
  console.log(loading)
  if (loading.effects['goods/getList']) {
    return <div>加载中...</div>
  }

  return (
    <div className={styles.normal}>
      <h1>Page goods</h1>
      <ul>
        {goodsList.map(good => (
          <li key={good.title}>{good.title}</li>
        ))}
      </ul>
      <button onClick={() => addGood('商品' + new Date().getTime())}>
        add
      </button>
    </div>
  )
})
```

#### 加载状态

利用内置的 dva-loading 实现

获取加载状态, goods.js

```js
export default connect(
  state => ({ loading: state.loading }), // 获取指定命名空间的模型状态
  {}
)(function({ goodsList, addGood, getList, loading }) {
  console.log(loading)
  if (loading.effects['goods/getList']) {
    return <div>加载中...</div>
  }
})
```

## 项目实践

### 引入 antd

- 添加 antd: `npm i antd -S`
- 修改.umirc.js

```js
plugins: [
  [
    'umi-plugin-react',
    {
      antd: true
    }
  ]
]
```
