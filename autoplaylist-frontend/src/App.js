import React, {Component} from 'react';
import './App.css';
import {authenticate, getBackendBaseUrl} from './Networking/Oauth2'
import getParameterByName from './Util/QueryString'
import ActiveView from './Views/ActiveView'
import store from './Views/store'
import {setPlaylists} from './Views/DisplayPlaylists/actions'

class App extends Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);

        this.state = {
            loggedIn: false,
            userId: null,
            playLists: [],
            error: null
        };

        if (window.location.pathname === "/callback") {
            const state = getParameterByName("state");
            const code = getParameterByName("code");
            const error = getParameterByName("error");
            console.log("State:", state);
            console.log("Error:", error);
            // todo handle error
            window.history.pushState('Main', 'Title', '/');

            let loginPromise = fetch(getBackendBaseUrl() + '/sessions', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({code})
            })
                .then(response => response.json())
                .then(response => {
                    console.log("Response: ", response);
                    this.setState({
                        loggedIn: true
                    });
                });

            loginPromise
                .then(() => {
                    fetch(getBackendBaseUrl() + '/users/me',{
                        credentials: 'include'
                    })
                        .then(response => response.json())
                        .then(userId => {
                            if (userId.error) {
                                console.log("error:", userId.error);
                                this.setState({
                                    error: userId.error
                                });
                            } else {
                                this.setState({
                                    userId: userId
                                });
                            }
                        });
                });

            loginPromise
                .then(() => {
                    fetch(getBackendBaseUrl() + '/playlists',{
                        credentials: 'include'
                    })
                        .then(response => response.json())
                        .then(playlists => {
                            if (playlists.error) {
                                console.log("error:", playlists.error);
                                this.setState({
                                    error: playlists.error
                                });
                            } else {
                                const action = setPlaylists(playlists)
                                store.dispatch(action)
                                // this.setState({
                                //     playLists: playlists
                                // });
                            }
                        });
                });
        }
    }

    render() {
        return (
            <div className="App">
                <ActiveView error={this.state.error} loggedIn={this.state.loggedIn} authenticate={authenticate} playLists={store.getState().playlists}/>
            </div>
        );
    }

    logout() {
        this.setState({
            loggedIn: false,
            userId: null,
            playLists: [],
            error: null
        });
    }
}

export default App;
