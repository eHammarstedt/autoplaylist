import { createStore } from 'redux'
import { baseReducer } from './baseReducer';

const store = createStore(baseReducer)

export default store
