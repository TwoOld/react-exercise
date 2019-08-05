import React, { Component } from 'react'
// import store from '../store'
import { connect } from 'react-redux'
import { add, minus, asyncAdd } from '../store/counter'

// 参数1：mapStateToProps = (state) => { return { num:state } }
// 参数2：mapDispatchToProps = dispatch => { return { add: () => { dispatch({ type: 'add' }) } } }
// connect 的两个任务：
// 1.自动渲染
// 2.状态及修改函数映射到组件属性
@connect(
  state => ({ num: state.counter.count }),
  {
    add,
    minus,
    asyncAdd
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
          <button onClick={() => this.props.asyncAdd()}>+</button>
        </div>
      </div>
    )
  }
}

export default ReduxTest
