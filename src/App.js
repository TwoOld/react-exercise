import React from 'react'
import JsxTest from './components/JsxTest'
import StateMgt from './components/StateMgt'
import EventHandle from './components/EventHandle'
import Lifecycle from './components/Lifecycle'

class App extends React.Component {
  state = { prop: 'some content' }
  componentDidMount() {
    this.setState({ prop: 'new content' }, () => {
      console.log('属性改变')
    })
    console.log('setState触发', this.state.prop)
    setTimeout(() => {
      this.setState({ prop: '' }, () => {
        console.log('属性改变')
      })
      console.log('setState触发', this.state.prop)
    }, 2000)
  }
  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        {/* <JsxTest /> */}
        {/* 状态管理 */}
        {/* <StateMgt /> */}
        {/* 事件处理 */}
        {/* <EventHandle /> */}
        {/* 生命周期 */}
        {this.state.prop && <Lifecycle prop={this.state.prop} />}
      </div>
    )
  }
}

export default App
