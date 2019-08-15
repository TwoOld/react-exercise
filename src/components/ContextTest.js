import React from 'react'

// 创建 Context
const Context = React.createContext()
// 获取Provider和Consumer
const Provider = Context.Provider
const Consumer = Context.Consumer

// withConsumer高阶组件，它根据配置返回一个高阶组件
function withConsumer(Consumer) {
  return Comp => props => {
    return <Consumer>{value => <Comp {...value} />}</Consumer>
  }
}

// 经过withConsumer(Consumer)返回的高阶组件包装，Child获得了上下文中的值
const Child = withConsumer(Consumer)(function(props) {
  return (
    <div onClick={() => props.add()}>
      {props.counter}
      {withConsumer(Consumer)(function(props) {
        return <div>{props.counter + ' ChildChild'}</div>
      })()}
    </div>
  )
})

export default class ContextTest extends React.Component {
  state = {
    counter: 0
  }

  add = () => {
    this.setState({
      counter: this.state.counter + 1
    })
  }

  render() {
    return (
      <Provider value={{ counter: this.state.counter, add: this.add }}>
        {/* <Consumer>{value => <Child {...value} />}</Consumer> */}
        <Child />
      </Provider>
    )
  }
}
