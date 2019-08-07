import React, { Component } from 'react'
import { createBrowserHistory } from 'history'
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
