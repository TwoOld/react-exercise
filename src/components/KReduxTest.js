import React, { Component } from 'react'
import { createStore, applyMiddleware } from '../kstore/kredux'
import logger from '../kstore/kredux-logger'
import thunk from '../kstore/kredux-thunk'

const counterReducer = function(state = 0, action) {
  const num = action.payload || 1
  switch (action.type) {
    case 'add':
      return state + num
    case 'minus':
      return state - num
    default:
      // 初始化
      return state
  }
}

const store = createStore(counterReducer, applyMiddleware(logger, thunk))

export default class KReduxTest extends Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate())
  }
  render() {
    return (
      <div>
        {store.getState()}
        <div>
          <button onClick={() => store.dispatch({ type: 'add' })}>+</button>
          <button onClick={() => store.dispatch({ type: 'minus' })}>-</button>
          <button
            onClick={() =>
              store.dispatch(function() {
                setTimeout(() => {
                  store.dispatch({ type: 'add', payload: 2 })
                }, 1000)
              })
            }
          >
            +
          </button>
        </div>
      </div>
    )
  }
}
