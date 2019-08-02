import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import store from './store'
import { Provider } from 'react-redux'
// import store from './kstore'
// import { Provider } from './kstore/kreact-redux'

ReactDOM.render(
  <Provider store={store}>
    <App title="hello React" />
  </Provider>,
  document.getElementById('root')
)
