import { combineReducers } from 'redux'
import modals from './modals'
import user from './user'
const rootReducer = combineReducers({
  modals,
  user
})

export default rootReducer
