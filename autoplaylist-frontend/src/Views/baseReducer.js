import { combineReducers } from 'redux'
import playlists from './DisplayPlaylists/reducer'

export const baseReducer = combineReducers({
    playlists,
    asd:(state={},action)=>(state)
})