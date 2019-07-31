import React from 'react'
import JsxTest from './components/JsxTest'
import StateMgt from './components/StateMgt'
import EventHandle from './components/EventHandle'

function App(props) {
  return (
    <div>
      <h1>{props.title}</h1>
      {/* <JsxTest /> */}
      {/* 状态管理 */}
      <StateMgt />
      {/* 事件处理 */}
      {/* <EventHandle /> */}
    </div>
  )
}

export default App
