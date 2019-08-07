import React from 'react'
import { Input, Button } from 'antd'

// 创建高阶组件
function kFormCreate(Form) {
  return class extends React.Component {
    constructor(props) {
      super(props)

      this.options = {}
      this.state = {}
    }

    // 全局校验
    validateFields = cb => {
      console.log(this.state)
      const rets = Object.keys(this.options).map(field => {
        return this.validateField(field)
      })

      const ret = rets.every(v => v)
      // 将校验结果传出去，并传递状态
      cb(ret, this.state)
    }

    // 单项校验
    validateField = field => {
      // 获取校验规则
      const { rules } = this.options[field]

      // 校验：ret 如果是 false 校验失败
      const ret = !rules.some(rule => {
        if (rule.required) {
          if (!this.state[field]) {
            // 必填项失败
            // 设置错误信息
            this.setState({
              [field + 'Message']: rule.message
            })

            return true
          }
        }

        return false
      })

      if (ret) {
        this.setState({
          [field + 'Message']: ''
        })
      }

      return ret
    }

    handleChange = e => {
      const { name, value } = e.target
      this.setState(
        {
          [name]: value
        },
        () => {
          this.validateField(name)
        }
      )
    }

    getFieldDec = (field, option) => {
      this.options[field] = option

      // 返回一个装饰器(高阶组件)
      return InputComp => {
        return (
          <div>
            {React.cloneElement(InputComp, {
              name: field, // 控件name
              value: this.state[field] || '',
              onChange: this.handleChange // 输入值变化监听
            })}
            {/* 校验错误信息 */}
            {this.state[field + 'Message'] && (
              <p style={{ color: 'red' }}>{this.state[field + 'Message']}</p>
            )}
          </div>
        )
      }
    }

    render() {
      return (
        <Form
          {...this.props}
          getFieldDec={this.getFieldDec}
          validateFields={this.validateFields}
        />
      )
    }
  }
}

@kFormCreate
class KFormTest extends React.Component {
  onLogin = () => {
    // 校验
    this.props.validateFields((valid, state) => {
      if (valid) {
        console.log('success!!!')
      } else {
        alert('fail!!!')
      }
    })
  }

  render() {
    const { getFieldDec } = this.props

    return (
      <div>
        {getFieldDec('username', {
          rules: [{ required: true, message: '请输入用户名' }]
        })(<Input type="text" />)}
        {getFieldDec('password', {
          rules: [{ required: true, message: '请输入密码' }]
        })(<Input type="password" />)}
        <Button onClick={this.onLogin}>登录</Button>
      </div>
    )
  }
}

export default KFormTest
