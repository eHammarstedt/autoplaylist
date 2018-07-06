import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import authenticate from './Networking/Oauth2'
import getParameterByName from './Util/QueryString'


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            session: null,
            userId: null,
            playLists: [],
            error: null
        };

        if (window.location.pathname === "/callback") {
            const state = getParameterByName("state");
            const code = getParameterByName("code");
            const error = getParameterByName("error");
            // todo handle error
            window.history.pushState('Main', 'Title', '/');

            let sessionIdPromise = fetch('http://localhost:8080/sessions', {
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
                        session: response
                    });
                    return response
                });

            sessionIdPromise
                .then(sessionId => {
                    fetch('http://localhost:8080/sessions/' + sessionId + '/userId')
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

            sessionIdPromise
                .then(sessionId => {
                    fetch('http://localhost:8080/sessions/' + sessionId + '/playlists')
                        .then(response => response.json())
                        .then(playlists => {
                            if (playlists.error) {
                                console.log("error:", playlists.error);
                                this.setState({
                                    error: playlists.error
                                });
                            } else {
                                this.setState({
                                    playLists: playlists
                                });
                            }
                        });
                });
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Autoplaylist</h1>
                </header>
                <div>
                    {this.state.error && (<div>{this.state.error}</div>)}
                    {(!this.state.session && !this.state.error) && (<button onClick={authenticate}>
                        Activate Lasers
                    </button>)}
                    {this.state.userId && (<div>Logged in as {this.state.userId}</div>)}
                    {this.state.session && (<div>Session: {this.state.session}</div>)}
                </div>
                <div>
                    <ul>
                        {this.state.playLists.map(item => (
                            <li key={item.id}>{item.name}</li>
                        ))}
                    </ul>
                </div>
                {(this.state.session || this.state.error) && (
                    <a href={"http://localhost:3000/"}>log out or something</a>)}
            </div>
        );
    }
}

export default App;
