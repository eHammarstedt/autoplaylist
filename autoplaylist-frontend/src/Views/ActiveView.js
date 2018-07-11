import React from 'react'
import Playlists from './DisplayPlaylists/Playlists'
import Login from './Login/Login'

const ActiveView = ({error, loggedIn, authenticate, playLists}) => {
    if (error){
        return(
            <div>{error}</div>
        )
    }
    if (!loggedIn){
        return (
            <Login authenticate={authenticate}/>
        )
    } 
    else {
        return (
            <Playlists list={playLists}/>
            // {(loggedIn || error) && (
            //     <button onClick={this.logout}>
            //         Log out
            //     </button>
            // )}
        )
    }
}

export default ActiveView