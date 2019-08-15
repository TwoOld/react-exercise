import React from 'react'
import JsxTest from './components/JsxTest'
import StateMgt from './components/StateMgt'
import EventHandle from './components/EventHandle'
import Lifecycle from './components/Lifecycle'

class App extends React.Component {
  state = { prop: 'some content', numArr: [{ num: 0 }] }
  componentDidMount() {
    console.log('setState')
    this.setState({ prop: 'new content' }, () => {
      console.log('属性改变')
    })
    setTimeout(() => {
      console.log('setState')
      this.setState({ prop: '' }, () => {
        console.log('属性改变')
      })
    }, 2000)
    setTimeout(() => {
      console.log('setState')
      this.setState({ prop: 'again' }, () => {
        console.log('属性改变')
      })
    }, 4000)
  }
  handleClick = () => {
    let numArr = this.state.numArr
    numArr[0] = Object.assign({}, numArr[0])
    numArr[0].num += 1
    this.setState({
      numArr
    })
  }
  render() {
    return (
      <div>
        <h1 onClick={this.handleClick}>{this.props.title}</h1>
        {/* <JsxTest /> */}
        {/* 状态管理 */}
        {/* <StateMgt /> */}
        {/* 事件处理 */}
        {/* <EventHandle /> */}
        {/* 生命周期 */}
        {this.state.prop && (
          <Lifecycle numObj={this.state.numArr[0]} prop={this.state.prop} />
        )}
      </div>
    )
  }
}

export default App
