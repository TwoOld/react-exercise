import React from 'react'
// import JsxTest from './components/JsxTest'
// import StateMgt from './components/StateMgt'
// import EventHandle from './components/EventHandle'
// import ContextTest from './components/ContextTest'
// import HocTest from './components/HocTest'
// import Composition from './components/Composition'
// import CompositionChildren from './components/CompositionChildren'
// import HooksTest from './components/HooksTest'

// import Button from 'antd/lib/button'
// import "antd/dist/antd.css"

// import { Button } from 'antd'
// import WrappedNormalLoginForm from './components/FormTest'
// import KFormTest from './components/KFormTest'
// import Dialog from './components/Dialog'
// import Dialog2 from './components/Dialog2'
// import Tree from './components/Tree'
// import CommentList from './components/CommentList'
import ReduxTest from './components/ReduxTest'
import KReduxTest from './components/KReduxTest'
import KReactReduxTest from './components/KReactReduxTest'
import ReduxExercise1 from './components/ReduxExercise1'

function App(props) {
  return (
    <div>
      <h1>{props.title}</h1>
      {/* <JsxTest /> */}
      {/* 状态管理 */}
      {/* <StateMgt /> */}
      {/* 事件处理 */}
      {/* <EventHandle /> */}
      {/* 上下文 */}
      {/* <ContextTest /> */}
      {/* 高阶组件 HOC */}
      {/* <HocTest /> */}
      {/* 组件复合 */}
      {/* <Composition /> */}
      {/* 组件复合 修改children */}
      {/* <CompositionChildren /> */}
      {/* Hooks 上手 */}
      {/* <HooksTest /> */}
      {/* <Button>HELLO</Button> */}
      {/* Form 组件 */}
      {/* <WrappedNormalLoginForm /> */}
      {/* <KFormTest /> */}
      {/* 弹窗 */}
      {/* <Dialog>something!!!</Dialog> */}
      {/* <Dialog2>anything!!!</Dialog2> */}
      {/* 树 */}
      {/* <Tree /> */}
      {/* 常见组件优化 */}
      {/* <CommentList /> */}
      {/* Redux 上手 */}
      {/* <ReduxTest /> */}
      {/* Redux 原理 */}
      {/* <KReduxTest /> */}
      <KReactReduxTest />
      {/* Redux 练习 */}
      {/* <ReduxExercise1 /> */}
    </div>
  )
}

export default App
