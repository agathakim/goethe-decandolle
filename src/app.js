import React from 'react';
import ReactDOM from 'react-dom';
// import {Provider} from 'react-redux';
//
// import AppState from './reducers/index';

import '../node_modules/react-vis/dist/style.css';
import './stylesheets/main.css';
import Root from './components/root.js';

const extensionContainer = document.createElement('div');
extensionContainer.setAttribute('id', 'goethe-application');
document.querySelector('body').appendChild(extensionContainer);

ReactDOM.render(<Root />, document.querySelector('#goethe-application'));
