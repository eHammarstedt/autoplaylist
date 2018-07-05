import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import * as queryString from "query-string";


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            session: null,
            userId: null,
            playLists: [],
            error: null
        };
    }

    componentDidMount() {
        const parsed = queryString.parse(window.location.search);
        const session = parsed.session;
        const error = parsed.error;

        if (error) {
            this.setState({
                error: error
            });
            return;
        }

        session && this.setState({
            session: session,
            userId: parsed.userId
        });

        console.log("State: ", this.state);
        if (session && this.state.playLists.length === 0) {
            fetch('http://localhost:8080/playlists/' + session)
                .then(response => response.json())
                .then(playlists => {
                    this.setState({
                        playLists: playlists
                    });
                    console.log("playlists:", playlists);
                    console.log("callback state: ", this.state);
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
                    {(!this.state.session && !this.state.error) && <a href="http://localhost:8080/login">Log in with Spotify</a>}
                    {this.state.session && "Logged in as " + this.state.userId + " with session: " + this.state.session}
                </div>
                <div>
                    <ul>
                        {this.state.playLists.map(item => item.name).map(item => (
                            <li>{item}</li>
                        ))}
                    </ul>
                </div>
                {(this.state.session || this.state.error) && (<a href={"http://localhost:3000/"}>log out or something</a>)}
            </div>
        );
    }
}


export default App;
