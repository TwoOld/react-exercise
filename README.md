# 目标

1. 掌握 react-router
2. 实现 react-router

## react-router

### 安装

`npm i react-router-dom -S`

### 基本使用

react-router 中奉行一切皆组件的思想，路由器-**Router**、链接-**Link**、路由-**Route**、独占-**Switch**、重定向-**Redirect**都以组件形式存在

创建 RouterTest.js

```js
import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom'

function ProductList() {
  return (
    <div>
      <h3>ProductList</h3>
    </div>
  )
}

function ProductMgt() {
  return (
    <div>
      <h3>ProductMgt</h3>
    </div>
  )
}

export default class RouterTest extends Component {
  render() {
    return (
      <BrowserRouter>
        <nav>
          {/* 导航 */}
          <Link to="/">商品列表</Link>
          <Link to="/management">商品管理</Link>
        </nav>

        {/* 路由配置 */}
        {/* 直接在组件中定义路由 */}
        {/* react-router 匹配时不是独占的 */}
        {/* 根路由要添加 exact, render 可以实现条件渲染 */}
        <Route path="/" component={ProductList} exact />
        <Route path="/management" component={ProductMgt} />
      </BrowserRouter>
    )
  }
}
```

### 动态路由

使用 :name 的形式定义动态路由

```js
<Route path="/detail/:name" component={Detail} />
```

添加导航链接

```js
<Link to="/detail/web">web</Link>
```

创建 Detail 组件并获取参数

```js
function Detail({ match, history, location }) {
  console.log(match, history, location)

  return (
    <div>
      <h3>Detail</h3>
      {match.params.name}
      <button onClick={history.goBack}>返回</button>
    </div>
  )
}
```

### 嵌套

Route 组件嵌套在其他页面组件中就产生了嵌套关系

修改 ProductMgt，添加新增和搜索选项

```js
function ProductMgt() {
  return (
    <div>
      <h3>ProductMgt</h3>
      <Link to="/management/add">Add</Link>
      <Link to="/management/search">Search</Link>
      <Route path="/management/add" component={() => <div>i am add</div>} />
      <Route
        path="/management/search"
        component={() => <div>i am search</div>}
      />
      {/* 默认打开页面 */}
      <Redirect to="/management/add" />
    </div>
  )
}
```

### 404 页面

设定一个没有 path 的路由在列表最后面，表示一定匹配

```js
<Switch>
  <Route path="/" component={ProductList} exact />
  <Route component={() => <div>页面不存在</div>} />
</Switch>
```

### 路由守卫

思路：创建高阶组件包装 Route 使其具有权限判断功能

创建 PrivateRoute

```js
function PrivateRoute({ component: Comp, isLogin, ...rest }) {
  // 单独解构出 component 和 isLogin
  // component 为渲染目标，isLogin 通常来自 Redux
  // rest 为传递给 Route 的属性
  return (
    <Route
      {...rest}
      render={
        // pros 包含match等信息直接传递给目标组件 props === ({ match, history, location })
        props =>
          isLogin ? (
            <Comp />
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { redirect: props.location.pathname } // 重定向地址
              }}
            />
          )
      }
    />
  )
}
```

配置路由

```js
<PrivateRoute path="/management" component={ProductMgt} isLogin={true} />
<Route path="/login" component={() => <div>login page</div>} />
```

> 给 PrivateRoute 传递 isLogin={true} 试试

> 将 login 结合 Redux

## 原理

react-router 秉承一切皆组件，因此实现的核心就是**BrowserRouter**、**Route**、**Link**

**BrowserRouter**：历史记录管理对象 history 初始化及向下传递，location 变更监听

创建 KRouterTest.js，首先实现 KBrowserRouter

```js
// 创建一个上下文保存history, location等
const RouterContext = React.createContext()

// Router: 管理历史记录变更，location变更等等，并传递给后代
class KBrowserRouter extends Component {
  constructor(props) {
    super(props)

    this.history = createBrowserHistory(this.props)

    // 创建状态管理 location
    this.state = {
      location: this.history.location
    }

    // 开启监听
    this.unlisten = this.history.listen(location => {
      this.setState({ location })
    })
  }

  componentWillUnmount() {
    this.unlisten && this.unlisten()
  }

  render() {
    return (
      <RouterContext.Provider
        value={{ history: this.history, location: this.state.location }}
        children={this.props.children}
      />
    )
  }
}
```

实现 KRoute

```js
import pathToRegexp from 'path-to-regexp'

const cache = {}
const cacheLimit = 10000
let cacheCount = 0

// 转换path为正则和关键字数组
// /detail/web <==> /detail/:name
function compilePath(path, options) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {})
  if (pathCache[path]) return pathCache[path]
  const keys = []
  const regexp = pathToRegexp(path, keys, options)
  const result = { regexp, keys }
  if (cacheCount < cacheLimit) {
    pathCache[path] = result
    cacheCount++
  }
  return result
}

/**
 * 匹配pathname和path.
 */
function matchPath(pathname, options = {}) {
  if (typeof options === 'string') options = { path: options }

  // 用户在 Route 上配置的 path
  const { path, exact = false, strict = false, sensitive = false } = options
  const paths = [].concat(path)
  // 转换path为match
  return paths.reduce((matched, path) => {
    if (!path) return null
    if (matched) return matched

    // keys: /detail/:name/:id 有可能多个
    // 转换path为正则和占位符数组
    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive
    })

    // 获得正则匹配数组
    const match = regexp.exec(pathname)
    if (!match) return null

    // 结构出匹配url和值数组
    const [url, ...values] = match
    const isExact = pathname === url
    if (exact && !isExact) return null

    return {
      path, // 待匹配path
      url: path === '/' && url === '' ? '/' : url, // url匹配部分
      isExact, // 精确匹配
      params: keys.reduce((memo, key, index) => {
        // 参数
        memo[key.name] = values[index]
        return memo
      }, {})
    }
  }, null)
}

class KRoute extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          const location = context.location
          // 根据 pathname 和用户传递的 props 获取 match 对象
          const match = matchPath(location.pathname, this.props)

          // 要传递一些参数
          const props = { ...context, match }

          // children component render
          let { children, component, render } = this.props
          if (typeof children === 'function') {
            children = children(props)
          }

          return (
            <RouterContext.Provider value={props}>
              {children // children 优先级最高，无论匹配与否若存在就执行
                ? children
                : props.match // 后面的 component 和 render 必须匹配
                ? component // 若匹配首先查找 component,
                  ? React.createElement(component) // 存在即渲染
                  : render // 不存在则查找 render
                  ? render(props) // 存在即按 render 渲染结果
                  : null
                : null}
            </RouterContext.Provider>
          )
        }}
      </RouterContext.Consumer>
    )
  }
}
```

实现 KLink

```js
class KLink extends Component {
  handleClick(event, history) {
    event.preventDefault()
    history.push(this.props.to)
  }
  render() {
    const { to, ...rest } = this.props
    return (
      <RouterContext.Consumer>
        {context => {
          return (
            <a
              {...rest}
              onClick={event => this.handleClick(event, context.history)}
              href={to}
            >
              {this.props.children}
            </a>
          )
        }}
      </RouterContext.Consumer>
    )
  }
}
```

使用

```js
export default class KRouterTest extends Component {
  render() {
    return (
      <KBrowserRouter>
        <nav>
          <KLink to="/vue">vue</KLink>
          <KLink to="/react">react</KLink>
          <KLink to="/hello/Scarlett">hello</KLink>
        </nav>
        <KRoute path="/vue" component={() => <div>vue</div>} />
        <KRoute path="/react" component={() => <div>react</div>} />
        <KRoute
          path="/hello/:name"
          render={({ match }) => <>{match.params.name}</>}
        />
        <KRoute children={() => 'xxx'} />
      </KBrowserRouter>
    )
  }
}
```
