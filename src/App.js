import React from 'react'
import JsxTest from './components/JsxTest'
import StateMgt from './components/StateMgt'
import EventHandle from './components/EventHandle'
import ContextTest from './components/ContextTest'
import HocTest from './components/HocTest'
import Composition from './components/Composition'
import CloneChildren from './components/CloneChildren'
import HooksTest from './components/HooksTest'

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
      {/* 修改 children */}
      {/* <CloneChildren /> */}
      {/* Hooks */}
      <HooksTest />
    </div>
  )
}

export default App
