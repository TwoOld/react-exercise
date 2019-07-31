import React from 'react'
import JsxTest from './components/JsxTest'
import StateMgt from './components/StateMgt'
import EventHandle from './components/EventHandle'
import ContextTest from './components/ContextTest'
import HocTest from './components/HocTest'
import Composition from './components/Composition'
import CompositionChildren from './components/CompositionChildren'
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
      {/* 组件复合 修改children */}
      {/* <CompositionChildren /> */}
      {/* Hooks */}
      <HooksTest />
    </div>
  )
}

export default App
