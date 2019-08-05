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
      <RadioGroup name="mvvm">
        <Radio value="vue">vue</Radio>
        <Radio value="react">react</Radio>
        <Radio value="react">angular</Radio>
      </RadioGroup>
    </div>
  )
}
