import React, { Component } from 'react'

// 容器组件
export default class CommentList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      comments: []
    }
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        comments: [
          { body: 'react is very good', author: 'facebook' },
          { body: 'vue is very good', author: 'youyuxi' }
        ]
      })
    }, 1000)
  }

  render() {
    return (
      <div>
        {this.state.comments.map((c, i) => (
        //   <Comment key={i} data={c} />
        //   <Comment2 key={i} {...c} />
          <Comment3 key={i} {...c} />
        ))}
      </div>
    )
  }
}

class Comment extends Component {
  // 添加shouldComponentUpdate判断
  // 参数是将要变更属性
  shouldComponentUpdate({ data: { body, author } }) {
    if (body === this.props.data.body && author === this.props.data.author) {
      return false // 不渲染
    }
    return true
  }

  render() {
    console.log('comment')
    return (
      <div>
        <p>{this.props.data.body}</p>
        <p> --- {this.props.data.author}</p>
      </div>
    )
  }
}

class Comment2 extends React.PureComponent {
  render() {
    console.log('Comment2')
    // 注意这里直接获取body和author
    return (
      <div>
        <p>{this.props.body}</p>
        <p> --- {this.props.author}</p>
      </div>
    )
  }
}

const Comment3 = React.memo(function({ body, author }) {
  console.log('Comment3')
  return (
    <div>
      <p>{body}</p>
      <p> --- {author}</p>
    </div>
  )
})
