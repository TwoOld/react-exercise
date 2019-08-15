import React from 'react'

// // Dialog定义组件外观和行为
// function Dialog(props) {
//   // props.children就代表了标签内部内容
//   // children是什么？ 答案是合法的js表达式
//   return (
//     <div style={{ border: '1px solid blue' }}>
//       {props.children.def}
//       <div>{props.children.footer}</div>
//     </div>
//   )
// }

// export default function Composition() {
//   return (
//     <div>
//       <Dialog>
//         {{
//           def: (
//             <>
//               <h1>组件复合</h1>
//               <p>
//                 复合组件给与你足够的敏捷去定义自定义组件的外观和行为，这种方式更明确和安全。如果组件间有公用的非
//                 UI 逻辑，将它们抽取为 JS 模块导入使用而不是继承它。
//               </p>
//             </>
//           ),
//           footer: <button onClick={() => alert('React')}>CONFIRM</button>
//         }}
//       </Dialog>
//     </div>
//   )
// }

// 函数形式 children
const messages = {
  hello: { title: 'hello', content: 'hello~' },
  hi: { title: 'hi', content: 'hi~' }
}
// Dialog定义组件外观和行为
function Dialog(props) {
  // props.children就代表了标签内部内容
  // children是什么？ 答案是合法的js表达式
  const { def, footer } = props.children(messages[props.msg])

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
