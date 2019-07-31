import React, { useState, useEffect, useReducer, useContext } from 'react'

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
  const { dispatch } = useContext(Context)
  // 输入内容状态及设置内容状态的方法
  const [pname, setPname] = useState('')
  // 键盘事件处理
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
  // useState(initialState)，接收初始状态，返回一个由状态和其更新函数组成的数组
  const [fruit, setFruit] = useState('')
  // 声明数组状态
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

  useEffect(() => {
    document.title = fruit
  }, [fruit])

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('msg')
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Context.Provider value={{ fruits, dispatch }}>
      <div>
        <p>{fruit === '' ? '请选择喜爱的水果：' : `您的选择是：${fruit}`}</p>
        {/* 列表 */}
        <FruitList fruits={fruits} onSetFruit={setFruit} />
        {/* 键盘事件处理 */}
        <FruitAdd />
      </div>
    </Context.Provider>
  )
}
