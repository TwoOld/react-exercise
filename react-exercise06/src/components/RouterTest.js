import React, { Component } from 'react'
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../store/user'

function ProductList() {
  return (
    <div>
      <h3>ProductList</h3>
      <Link to="/detail/web">web</Link>
    </div>
  )
}

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

// 路由守卫：定义一个组件 PrivateRoute
// 为其扩展一个功能：用户状态检查的功能
const PrivateRoute = connect(state => ({
  isLogin: state.user.isLogin
}))(function({ component: Comp, isLogin, ...rest }) {
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
})

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
        {/* <Route path="/" component={ProductList} />
        <Route path="/management" component={ProductMgt} /> */}
        {/* <Switch>
          <Route path="/" component={ProductList} />
          <Route path="/management" component={ProductMgt} />
        </Switch> */}
        {/* <Switch>
          <Route path="/management" component={ProductMgt} />
          <Route path="/" component={ProductList} />
        </Switch> */}
        {/* <Switch>
          <Route path="/" component={ProductList} exact/>
          <Route path="/management" component={ProductMgt} />
        </Switch> */}
        {/* 添加 Switch 表示仅匹配一个 */}
        <Switch>
          {/* react-router 匹配时不是独占的 */}
          {/* 根路由要添加 exact, render 可以实现条件渲染 */}
          <Route path="/" component={ProductList} exact />
          <PrivateRoute path="/management" component={ProductMgt} />
          {/* 动态路由 */}
          {/* 使用 :name 的形式定义动态路由 */}
          <Route path="/detail/:name" component={Detail} />
          <Route path="/login" component={Login} />
          <Route component={() => <div>页面不存在</div>} />
        </Switch>
      </BrowserRouter>
    )
  }
}
