import React from 'react';
import {Provider} from 'react-redux'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import store from './Views/store'

// import unregister from './registerServiceWorker';

ReactDOM.render(
<Provider store={store}>
    <App/>
</Provider>
, document.getElementById('root'))

// registerServiceWorker();
// unregister();


// fetch('http://example.com/movies.json')
//     .then(response => response.json())
//     .then(myJson => console.log(myJson));