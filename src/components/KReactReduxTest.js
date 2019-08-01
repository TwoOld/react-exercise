import React, { Component } from 'react'
import { connect } from '../kstore/kreact-redux'
import { add, minus, asyncAdd } from '../kstore/counter'

@connect(
  state => ({ num: state }),
  {
    add,
    minus,
    asyncAdd
  }
)
class KReactReduxTest extends Component {
  render() {
    return (
      <div>
        {this.props.num}
        <div>
          <button onClick={() => this.props.add(2)}>+</button>
          <button onClick={() => this.props.minus()}>-</button>
          <button onClick={() => this.props.asyncAdd()}>+</button>
        </div>
      </div>
    )
  }
}

export default KReactReduxTest
