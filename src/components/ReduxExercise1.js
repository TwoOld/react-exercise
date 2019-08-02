import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { add, init } from '../store/fruits'

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

@connect(
  state => ({ fruits: state.fruits }),
  {
    init,
    add
  }
)
class ReduxExercise1 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fruit: ''
    }
  }

  componentDidMount() {
    this.props.init(['apple', 'banana'])
  }

  render() {
    return (
      <div>
        <p>
          {this.state.fruit === ''
            ? '请选择喜爱的水果：'
            : `您的选择是：${this.state.fruit}`}
        </p>
        {/* 列表 */}
        <FruitList
          fruits={this.props.fruits}
          onSetFruit={fruit => this.setState({ fruit })}
        />
        {/* 键盘事件处理 */}
        <FruitAdd onAddFruit={pname => this.props.add(pname)} />
      </div>
    )
  }
}

export default ReduxExercise1
