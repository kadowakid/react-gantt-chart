import React from 'react';
import ReactDOM from 'react-dom';
import { createStore,applyMiddleware } from 'redux';
import { Provider }  from 'react-redux';
import createLogger from 'redux-logger';
import App from './component/App';
import { reducer } from './reducer';

const dev = process.env.NODE_ENV === 'development';

const logger = createLogger();
const storeWithMiddleware = applyMiddleware(logger)(createStore);
const store = !dev ? createStore(reducer) : storeWithMiddleware(reducer);

ReactDOM.render (
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
