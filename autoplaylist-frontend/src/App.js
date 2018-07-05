import React from 'react';
import './App.css';
import {applyMiddleware, compose, createStore} from "redux";
import {Provider} from "react-redux";
import WelcomeView from "./Welcome/WelcomeView";
import HttpNetworkingMiddleware from "./Networking/HttpNetworkingMiddleware";
import BaseReducer from "./BaseReducer";

// Node doesn't support these so tests fail...
if (!console["group"]) console["group"] = () => {};
if (!console["groupCollapsed"]) console["groupCollapsed"] = () => {};
if (!console["groupEnd"]) console["groupEnd"] = () => {};

const logger = store => next => action => {
    console.group("Action:", action.type);
    console.info('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    console.groupEnd(action.type);
    return result
};

const enhancer = compose(
    applyMiddleware(logger, HttpNetworkingMiddleware)
);

const store = createStore(
    BaseReducer,
    enhancer
);

const App = () => (
    <Provider store={store}>
        <div className="App">
            <WelcomeView/>
        </div>
    </Provider>
);
/*
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

*/
export default App;
