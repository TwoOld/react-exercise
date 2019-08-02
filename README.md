# 目标

1. 掌握第三方组件正确使用方式
2. 能设计并实现自己的组件
3. 常见组件化技术

# 知识要点

1. 使用 antd
2. 设计并实现表单控件
3. 实现弹窗类组件
4. 实现树组件
5. 使用 PureComponent
6. 使用 memo

# 资源

[ant design](https://ant.design/docs/react/use-with-create-react-app-cn)

# 起步

## 使用第三方组件

安装： `npm install antd --save`

范例：试用 ant-design 组件库

```js
import React, { Component } from 'react'
import Button from 'antd/lib/button'
import 'antd/dist/antd.css'
class App extends Component {
  render() {
    return (
      <div className="App">
        <Button type="primary">Button</Button>
      </div>
    )
  }
}
export default App
```

### 配置按需加载

安装 react-app-rewired 取代 react-scripts，可以扩展 webpack 的配置，类似 vue.config.js

`npm install react-app-rewired customize-cra babel-plugin-import -D`

```js
// 根目录创建config-overrides.js
const { override, fixBabelImports } = require('customize-cra')
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css'
  })
)

// 修改package.json
{
    "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-app-rewired eject"
    }
}
```

配置后

```js
import React, { Component } from 'react'
import { Button } from 'antd'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Button type="primary">Button</Button>
      </div>
    )
  }
}
export default App
```

支持装饰器配置

`npm install -D @babel/plugin-proposal-decorators`

```js
// config-overrides.js
const { addDecoratorsLegacy } = require('customize-cra')

module.exports = override(
  ...,
  addDecoratorsLegacy()
)
```

配置后，可使用装饰器写法使用高阶组件

```js
// 装饰器语法 @withLog
// 先后顺序：从下往上
@withLog
@withContent
class Lesson2 extends React.Component {
  render() {
    return (
      <div>
        {this.props.stage} - {this.props.title}
      </div>
    )
  }
}
```

## 表单组件设计与实现

### antd 表单使用

```js
import React from 'react'
import { Form, Icon, Input, Button } from 'antd'

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    // validateFields 哪来的？
    // 全局校验怎么实现的？
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render() {
    // getFieldDecorator 哪来的？
    // 做什么的？ 装饰器工厂，字段装饰器能够生成一个装饰器
    // 设置字段名称、校验规则、增强input使它可以校验
    const { getFieldDecorator } = this.props.form

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {/* 装饰器工厂，先返回一个设置后的装饰器，再进行调用装饰器 */}
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

// 经过包装以后，表单就拥有了额外能力：全局校验、输入控件的装饰器
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(
  NormalLoginForm
)

export default WrappedNormalLoginForm
```

### 表单设计思路

- 表单组件要求实现**数据收集、校验、提交**等特性，可通过高阶组件扩展
- 高阶组件给表单组件传递一个 input 组件**包装函数**接管其输入事件并统一管理表单数据
- 高阶组件给表单组件传递一个**校验函数**使其具备数据校验功能

### 表单组件实现

- 表单基本结构，创建 components/KFormTest.js

```js
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
```

> 尝试实现 Form（布局、提交）、FormItem（错误信息）、Input（前缀图标）

## 弹窗类组件设计与实现

### 设计思路

弹窗类组件的要求弹窗内容在 A 处声明，却在 B 处展示。React 中相当于弹窗内容看起来被 render 到一个组件里面去，实际改变的是网页上另一处的 DOM 结构，这个显然不符合正常逻辑。但是通过使用框架提供的特定 API 创建组件实例并指定挂载目标仍可完成任务。

```js
// 常见用法如下：Dialog在当前组件声明，但是却在body中另一个div中显示
<div class="foo">
  <div> ... </div>
  {needDialog ? (
    <Dialog>
      <header>Any Header</header>
      <section>Any content</section>
    </Dialog>
  ) : null}
</div>
```

### 具体实现

#### 方案 1：Portal

传送门，React v16 之后出现的 portal 可以实现内容传送功能。

范例：Dialog 组件

```js
// Dialog.js
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

// App.js
const jsx = <Dialog>something!!!</Dialog>
```

#### 方案 2：unstable_renderSubtreeIntoContainer

在 v16 之前，要用到 react 中两个秘而不宣的 React API: unstable_renderSubtreeIntoContainer,unmountComponentAtNode

```js
// Dialog2.js

import React from 'react'
import {
  unmountComponentAtNode,
  unstable_renderSubtreeIntoContainer
} from 'react-dom'

export default class Dialog2 extends React.Component {
  // render一个null，目的什么内容都不渲染
  render() {
    return null
  }

  componentDidMount() {
    // 首次挂载时候创建宿主div
    const doc = window.document
    this.node = doc.createElement('div')
    doc.body.appendChild(this.node)

    this.createPortal(this.props)
  }

  componentDidUpdate() {
    this.createPortal(this.props)
  }

  componentWillUnmount() {
    // 清理节点
    unmountComponentAtNode(this.node)
    // 清理宿主div
    window.document.body.removeChild(this.node)
  }

  createPortal(props) {
    unstable_renderSubtreeIntoContainer(
      this, //当前组件
      <div className="dialog">{props.children}</div>, // 塞进传送门的JSX
      this.node // 传送门另一端的DOM node
    )
  }
}

// App.js
const jsx = <Dialog2>anything!!!</Dialog2>
```

## 树形组件设计与实现

### 设计思路

React 中实现递归组件更加纯粹，就是组件递归渲染即可。假设我们的节点组件时 TreeNode，它的 render 中只要发现当前节点拥有子节点就要继续渲染自己。节点的打开状态可以通过给组件一个 open 状态来维护。

### 实现

```js
import React, { Component } from 'react'

class TreeNode extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }
  }

  get isFolder() {
    return this.props.model.children && this.props.model.children.length
  }

  toggle = () => {
    if (this.isFolder) {
      this.setState({
        open: !this.state.open
      })
    }
  }

  render() {
    return (
      <ul>
        <li>
          {/* 当前内容显示 */}
          <div onClick={this.toggle}>
            {/* 标题 */}
            {this.props.model.title}
            {/* 有可能显示+-号 */}
            {this.isFolder ? <span>{this.state.open ? '-' : '+'}</span> : null}
          </div>
          {/* 可能存在子树 */}
          {this.isFolder
            ? this.props.model.children.map(model => (
                <div style={{ display: this.state.open ? 'block' : 'none' }}>
                  <TreeNode model={model} key={model.title} />
                </div>
              ))
            : null}
        </li>
      </ul>
    )
  }
}

export default class Tree extends Component {
  treeData = {
    title: 'Web全栈架构师',
    children: [
      {
        title: 'Java架构师'
      },
      {
        title: 'JS高级',
        children: [
          {
            title: 'ES6'
          },
          {
            title: '动效'
          }
        ]
      },
      {
        title: 'Web全栈',
        children: [
          {
            title: 'Vue训练营',
            expand: true,
            children: [
              {
                title: '组件化'
              },
              {
                title: '源码'
              },
              {
                title: 'docker部署'
              }
            ]
          },
          {
            title: 'React',
            children: [
              {
                title: 'JSX'
              },
              {
                title: '虚拟DOM'
              }
            ]
          },
          {
            title: 'Node'
          }
        ]
      }
    ]
  }
  render() {
    return (
      <div>
        <TreeNode model={this.treeData} />
      </div>
    )
  }
}
```

## 常见组件优化技术

### 定制组件的 shouldComponentUpdate 钩子

范例：通过 shouldComponentUpdate 优化组件

```js
import React, { Component } from 'react'

// 容器组件
export default class CommentList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comments: []
    }
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        comments: [
          { body: 'react is very good', author: 'facebook' },
          { body: 'vue is very good', author: 'youyuxi' }
        ]
      })
    }, 1000)
  }

  render() {
    return (
      <div>
        {this.state.comments.map((c, i) => (
          <Comment key={i} data={c} />
        ))}
      </div>
    )
  }
}

class Comment extends Component {
  // 添加shouldComponentUpdate判断
  // 参数是将要变更属性
  shouldComponentUpdate({ data: { body, author } }) {
    if (body === this.props.data.body && author === this.props.data.author) {
      return false // 不渲染
    }
    return true
  }

  render() {
    console.log('Comment')
    return (
      <div>
        <p>{this.props.data.body}</p>
        <p> --- {this.props.data.author}</p>
      </div>
    )
  }
}
```

### PureComponent

```js
class Comment extends React.PureComponent {
  render() {
    console.log('Comment')
    // 注意这里直接获取body和author
    return (
      <div>
        <p>{this.props.body}</p>
        <p> --- {this.props.author}</p>
      </div>
    )
  }
}
```

> 缺点是必须要用 class 形式，而且要注意是**浅比较**

### React.memo

React v16.6.0 之后的版本，可以使用一个新功能 React.memo 来完美实现让函数式的组件也有了 PureComponent 的功能

```js
const Comment = React.memo(function({ body, author }) {
  console.log('render')
  return (
    <div>
      <p>{body}</p>
      <p> --- {author}</p>
    </div>
  )
})
```
