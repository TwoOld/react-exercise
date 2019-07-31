# 起步

## 组件跨层级通信 - Context

React 中使用 Context 实现祖代组件向后代组件跨层级传值。Vue 中的 provide&inject 来源于 Conetxt

在 Context 模式下有两个角色：

- Provider：外层提供数据的组件
- Consumer：内层获取数据的组件

### 使用 Context

创建 Context=>获取 Provider 和 Consumer=>Provider 提供值=>Consumer 消费值

范例：模拟 redux 存放全局状态，在组件间共享

```js
import React from 'react'

// 创建 Context
const Context = React.createContext()
// 获取Provider和Consumer
const Provider = Context.Provider
const Consumer = Context.Consumer

function Child(props) {
  return (
    <div onClick={() => props.add()}>
      {props.counter}
      <Consumer>{value => <ChildChild {...value} />}</Consumer>
    </div>
  )
}

function ChildChild(props) {
  return <div>{props.counter + ' ChildChild'}</div>
}

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
        <Consumer>{value => <Child {...value} />}</Consumer>
      </Provider>
    )
  }
}
```

> 函数组件中可以通过 useContext 引入上下文，后面 hooks 部分介绍

## 高阶组件

为了提高组件复用率，可测试性，就要**保证组件功能单一性**；但是若要满足复杂需求就要扩展功能单一的组件，在 React 里就有了 HOC（Higher-Order Components）的概念，**高阶组件是一个工厂函数**，它**接收一个组件**并**返回另一个组件**

### 基本使用

范例：为展示组件添加获取数据能力

```js
import React from 'react'

function Lesson(props) {
  return (
    <div>
      {props.stage} - {props.title}
    </div>
  )
}

const lessons = [
  { stage: 'React', title: '1' },
  { stage: 'React', title: '2' },
  { stage: 'React', title: '3' }
]

// 定义高阶组件withContent
// 包装后的组件传入参数，根据该参数获取显示数据
// function withContent(Comp) {
//   return function(props) {
//     const content = lessons[props.idx]
//     return <Comp {...content} />
//   }
// }
const withContent = Comp => props => {
  const content = lessons[props.idx]
  return <Comp {...content} />
}

const withLog = Comp => {
  return class extends React.Component {
    componentDidMount() {
      console.log('didMount', this.props)
    }

    render() {
      return <Comp {...this.props} />
    }
  }
}

// 包装
const LessonWithContent = withLog(withContent(Lesson))

// 装饰器语法 @withLog
// 先后顺序：从下往上
// @withLog
// @withContent
// class Lesson2 extends React.Component {
//   render() {
//     return (
//       <div>
//         {this.props.stage} - {this.props.title}
//       </div>
//     )
//   }
// }

export default function HocTest() {
  return (
    <div>
      {[0, 0, 0].map((item, idx) => (
        <LessonWithContent key={idx} idx={idx} />
        // <Lesson2 key={idx} idx={idx} />
      ))}
    </div>
  )
}
```

```js
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
      <Consumer>{value => <ChildChild {...value} />}</Consumer>
    </div>
  )
})

function ChildChild(props) {
  return <div>{props.counter + ' ChildChild'}</div>
}

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
```

## 组件复合 - Composition

复合组件给与你足够的敏捷去定义自定义组件的外观和行为，这种方式更明确和安全。如果组件间有公用的非 UI 逻辑，将它们抽取为 JS 模块导入使用而不是继承它。

### 组件复合

范例：Dialog 组件负责提示，内容从外部传入即可

```js
import React from 'react'

// Dialog定义组件外观和行为
function Dialog(props) {
  // props.children就代表了标签内部内容
  // children是什么？ 答案是合法的js表达式
  return (
    <div style={{ border: '1px solid blue' }}>
      {props.children.def}
      <div>{props.children.footer}</div>
    </div>
  )
}

export default function Composition() {
  return (
    <div>
      <Dialog>
        {{
          def: (
            <>
              <h1>组件复合</h1>
              <p>
                复合组件给与你足够的敏捷去定义自定义组件的外观和行为，这种方式更明确和安全。如果组件间有公用的非
                UI 逻辑，将它们抽取为 JS 模块导入使用而不是继承它。
              </p>
            </>
          ),
          footer: <button onClick={() => alert('React')}>CONFIRM</button>
        }}
      </Dialog>
    </div>
  )
}
```

> 这些内容也完全可以作为属性传入

如果传入的是函数，还可以实现作用域插槽的功能

```js
import React from 'react'

const messages = {
  hello: { title: 'hello', content: 'hello~' },
  hi: { title: 'hi', content: 'hi~' }
}
// Dialog定义组件外观和行为
function Dialog(props) {
  const { def, footer } = props.children(messages[props.msg])
  // props.children就代表了标签内部内容
  // children是什么？ 答案是合法的js表达式
  return (
    <div style={{ border: '1px solid blue' }}>
      {def}
      <div>{footer}</div>
    </div>
  )
}

export default function Composition() {
  return (
    <div>
      <Dialog msg="hello">
        {({ title, content }) => ({
          def: (
            <>
              <h1>{title}</h1>
              <p>{content}</p>
            </>
          ),
          footer: <button onClick={() => alert('React')}>CONFIRM</button>
        })}
      </Dialog>
    </div>
  )
}
```

### 高阶应用：修改 children

如果 props.children 是 jsx，此时它是不能修改的

范例：实现 RadioGroup 和 Radio 组件，可通过 Radio Group 设置 Radio 的 name

```js
import React from 'react'

function Radio({ children, ...rest }) {
  return (
    <label>
      <input type="radio" {...rest} />
      {children}
    </label>
  )
}

function RadioGroup(props) {
  return (
    <div>
      {React.Children.map(props.children, radio => {
        // 要修改虚拟dom 只能克隆它
        // 参数1是克隆对象
        // 参数2是设置的属性
        return React.cloneElement(radio, { name: props.name })
      })}
    </div>
  )
}

export default function CompositionChildren() {
  return (
    <div>
      <RadioGroup name="mvvm">
        <Radio value="vue">vue</Radio>
        <Radio value="react">react</Radio>
        <Radio value="react">angular</Radio>
      </RadioGroup>
    </div>
  )
}
```

## Hooks

Hook 是 React16.8 一个新增项，它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

Hook 的特点：

- 是你在无需修改组件结构的情况下复用状态逻辑
- 可将组件中相互关联的部分拆分成更小的函数，复杂组件将变得更容易理解
- 更简洁、更易理解的代码

### 准备工作

- 升级 react、react-dom

```
npm i react react-dom -S
```

### 状态钩子 State Hook

- 创建 HooksTest.js

```js
import React, { useState, useEffect } from 'react'

export default function HooksTest() {
  // useState(initialState)，接收初始状态，返回一个由状态和其更新函数组成的数组
  const [fruit, setFruit] = useState('')
  return (
    <div>
      <p>{fruit === '' ? '请选择喜爱的水果：' : `您的选择是：${fruit}`}</p>
    </div>
  )
}
```

> 更新函数类似 setState，但它不会整合新旧状态

- 声明多个状态变量

```js
import React, { useState, useEffect } from 'react'

// 声明列表组件
function FruitList({ fruits, onSetFruit }) {
  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li onClick={() => onSetFruit(fruit)} key={index}>
          {fruit}
        </li>
      ))}
    </ul>
  )
}

export default function HooksTest() {
  // useState(initialState)，接收初始状态，返回一个由状态和其更新函数组成的数组
  const [fruit, setFruit] = useState('')
  // 声明数组状态
  const [fruits, setFruits] = useState(['banana', 'apple'])

  return (
    <div>
      <p>{fruit === '' ? '请选择喜爱的水果：' : `您的选择是：${fruit}`}</p>
      {/* 列表 */}
      <FruitList fruits={fruits} onSetFruit={setFruit} />
    </div>
  )
}
```

- 输入组件

```js
import React, { useState, useEffect } from 'react'

// 声明输入组件
function FruitAdd(props) {
  // 输入内容状态及设置内容状态的方法
  const [pname, setPname] = useState('')
  // 键盘事件处理
  const onAddFruit = e => {
    if (e.key === 'Enter') {
      props.onAddFruit(pname)
      setPname('')
    }
  }

  return (
    <div>
      <input
        type="text"
        value={pname}
        onChange={e => setPname(e.target.value)}
        onKeyDown={onAddFruit}
      />
    </div>
  )
}

export default function HooksTest() {
  // 声明数组状态
  const [fruits, setFruits] = useState(['banana', 'apple'])

  return (
    <div>
      {/* 键盘事件处理 */}
      <FruitAdd onAddFruit={pname => setFruits([...fruits, pname])} />
    </div>
  )
}
```

### 副作用钩子 Effect Hook

`useEffect`给函数组件增加了执行副作用操作的能力。

数据获取，设置订阅以及手动更改 React 组件中的 DOM 都属于副作用

- 异步数据获取

```js
useEffect(() => {
  setTimeout(() => {
    console.log('msg')
  }, 1000)
})
```

> 测试会发现副作用操作会被频繁调用

- 设置依赖

```js
// 设置空数组意为没有依赖，则副作用仅执行一次
useEffect(() => {...}, [])
```

> 如果副作用操作对某状态有依赖，务必添加依赖

```js
useEffect(() => {
  document.title = fruit
}, [fruit])
```

- 清除工作：有一些副作用是需要清除的，清除工作非常的重要，可以防止引起内存泄漏

```js
useEffect(() => {
  const timer = setInterval(() => {
    console.log('msg')
  }, 1000)
  return () => {
    clearInterval(timer)
  }
}, [])
```

> 组件卸载后会执行返回的清理函数

### useReducer

useReducer 是 useState 的可选项，常用于组件有复杂状态逻辑时，类似于 redux 中 reducer 概念

- 商品列表状态维护

```js
import React, { useState, useEffect, useReducer } from 'react'

// 添加fruit状态维护fruitReducer
// 理解为vuex里面的mutations
function fruitReducer(state, action) {
  switch (action.type) {
    case 'init':
      return action.payload
    case 'add':
      return [...state, action.payload]
    default:
      return state
  }
}

export default function HooksTest() {
  //   const [fruits, setFruits] = useState([])
  // 代替组件内部状态
  // 参数1是reducer
  // 参数2是初始值
  const [fruits, dispatch] = useReducer(fruitReducer, [])

  // 异步获取水果列表
  useEffect(() => {
    console.log('useEffect')

    setTimeout(() => {
      //   setFruits(['banana', 'apple'])
      // 变更状态，派发动作即可
      dispatch({ type: 'init', payload: ['banana', 'apple'] })
    }, 1000)
  }, []) // 依赖为空表示只执行一次

  return (
    <div>
      {/* 修改为派发动作 */}
      <FruitAdd
        onAddFruit={pname => dispatch({ type: 'add', payload: pname })}
      />
    </div>
  )
}
```

### useContext

useContext 用于在快速在函数组件中导入上下文

```js
import React, { useState, useEffect, useReducer, useContext } from 'react'

function FruitList({ fruits, onSetFruit }) {
  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li onClick={() => onSetFruit(fruit)} key={index}>
          {fruit}
        </li>
      ))}
    </ul>
  )
}

function FruitAdd(props) {
  // 获取dispatch
  const { dispatch } = useContext(Context)

  const [pname, setPname] = useState('')

  const onAddFruit = e => {
    if (e.key === 'Enter') {
      //   props.onAddFruit(pname)
      // 修改为派发动作
      dispatch({ type: 'add', payload: pname })
      setPname('')
    }
  }

  return (
    <div>
      <input
        type="text"
        value={pname}
        onChange={e => setPname(e.target.value)}
        onKeyDown={onAddFruit}
      />
    </div>
  )
}

// 添加fruit状态维护fruitReducer
// 理解为vuex里面的mutations
function fruitReducer(state, action) {
  switch (action.type) {
    case 'init':
      return action.payload
    case 'add':
      return [...state, action.payload]
    default:
      return state
  }
}

const Context = React.createContext()

export default function HooksTest() {
  const [fruit, setFruit] = useState('')

  const [fruits, dispatch] = useReducer(fruitReducer, [])

  return (
    <Context.Provider value={{ fruits, dispatch }}>
      <div>
        <p>{fruit === '' ? '请选择喜爱的水果：' : `您的选择是：${fruit}`}</p>
        <FruitList fruits={fruits} onSetFruit={setFruit} />
        {/* 不再需要绑定onAddFruit */}
        <FruitAdd />
      </div>
    </Context.Provider>
  )
}
```
