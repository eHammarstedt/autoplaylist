const playlists = (state = [], action) => {
    if(action.type !== 'set_playlists'){
        return state
    } else {
        return action.playlists
    }
}