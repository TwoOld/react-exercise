import React, { Component } from 'react'
import { createPortal } from 'react-dom'

export default class Dialog extends Component {
  constructor(props) {
    super(props)

    this.node = document.createElement('div')
    document.body.appendChild(this.node)
  }

  render() {
    // 将参数1声明的jsx挂载到node上
    return createPortal(<>{this.props.children}</>, this.node)
  }

  // 清理div
  componentWillUnmount() {
    document.body.removeChild(this.node)
  }
}
