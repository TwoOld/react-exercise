export const add = pname => ({ type: 'add', payload: pname })
export const init = pnames => dispatch => {
  setTimeout(() => {
    dispatch({ type: 'init', payload: pnames })
  }, 1000)
}
export function fruitReducer(state = [], action) {
  switch (action.type) {
    case 'init':
      return action.payload
    case 'add':
      return [...state, action.payload]
    default:
      return state
  }
}
