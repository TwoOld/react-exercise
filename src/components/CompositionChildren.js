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
