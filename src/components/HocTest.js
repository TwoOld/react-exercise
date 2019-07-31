import React from 'react'

function Lesson(props) {
  return (
    <div>
      {props.stage} - {props.title}
    </div>
  )
}

const lessons = [
  { stage: 'React', title: '1' },
  { stage: 'React', title: '2' },
  { stage: 'React', title: '3' }
]

// 定义高阶组件withContent
// 包装后的组件传入参数，根据该参数获取显示数据
// function withContent(Comp) {
//   return function(props) {
//     const content = lessons[props.idx]
//     return <Comp {...content} />
//   }
// }
const withContent = Comp => props => {
  const content = lessons[props.idx]
  return <Comp {...content} />
}

const withLog = Comp => {
  return class extends React.Component {
    componentDidMount() {
      console.log('didMount', this.props)
    }

    render() {
      return <Comp {...this.props} />
    }
  }
}

// 包装
const LessonWithContent = withLog(withContent(Lesson))

// 装饰器语法 @withLog
// 先后顺序：从下往上
// @withLog
// @withContent
// class Lesson2 extends React.Component {
//   render() {
//     return (
//       <div>
//         {this.props.stage} - {this.props.title}
//       </div>
//     )
//   }
// }

export default function HocTest() {
  return (
    <div>
      {[0, 0, 0].map((item, idx) => (
        <LessonWithContent key={idx} idx={idx} />
        // <Lesson2 key={idx} idx={idx} />
      ))}
    </div>
  )
}
