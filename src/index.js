import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// React类负责逻辑控制，比如修改数据 -> vdom
// ReactDOM类负责渲染，vdom -> dom
// babel-loader可以转换 jsx -> vdom，React.createElement()
// <h1>React</h1> => React.createElement('h1','React')
// const jsx = <h1>React</h1>
// console.log(jsx)
// ReactDOM.render(jsx, document.getElementById('root'))

ReactDOM.render(<App title="hello" />, document.getElementById('root'))
