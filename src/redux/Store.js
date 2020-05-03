import { createStore, applyMiddleware } from 'redux'
import reducers from './Reducer'
import ReduxThunk from 'redux-thunk'

export default createStore(reducers, {}, applyMiddleware(ReduxThunk));