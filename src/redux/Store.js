import { createStore, applyMiddleware } from 'redux'
import Reducers from './Reducer'
import ReduxThunk from 'redux-thunk'

export default createStore(Reducers, {}, applyMiddleware(ReduxThunk));

