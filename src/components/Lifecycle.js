import React, { Component } from 'react'

export default class Lifecycle extends Component {
  constructor(props) {
    super(props)
    // 常用于初始化状态
    console.log('1.组件构造函数执行')
    this.state = {}
  }
  //   static getDerivedStateFromProps(props, state) {
  //     console.log('getDerivedStateFromProps 代替 componentWillMount componentWillReceiveProps componentWillUpdate')
  //     console.log(props, state)
  //     return { props, state }
  //   }
  //   getSnapshotBeforeUpdate(prevProps, prevState) {
  //     // 可获取update之前的状态
  //     // return 结果 将作为第三个参数传递给 componentDidUpdate(prevProps, prevState, snap)
  //     return null
  //   }
  componentWillMount() {
    // 此时可以访问状态和属性，可进行api调用等
    console.log('2.组件将要挂载')
  }
  componentDidMount() {
    // 组件已挂载，可进行状态更新操作
    console.log('3.组件已挂载')
  }
  componentWillReceiveProps(nextProps, nextState) {
    // 父组件传递的属性有变化，做相应响应
    console.log('4.将要接收属性传递')
    console.log(nextProps.numObj.num, this.props.numObj.num)
    console.log(nextProps.numObj.num === this.props.numObj.num)
  }
  shouldComponentUpdate(nextProps, nextState) {
    // 组件是否需要更新，需要返回布尔值结果，优化点
    console.log('5.组件是否需要更新？')
    return true
  }
  componentWillUpdate(nextProps, nextState) {
    // 组件将要更新，可做更新统计
    console.log('6.组件将要更新')
  }
  componentDidUpdate(prevProps, prevState) {
    // 组件更新
    console.log('7.组件已更新')
  }
  componentWillUnmount() {
    // 组件将要卸载, 可做清理工作
    console.log('8.组件将要卸载')
  }
  render() {
    console.log('组件渲染')
    return <div>生命周期探究</div>
  }
}
