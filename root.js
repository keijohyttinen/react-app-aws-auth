import React, { Component } from 'react';
import { Provider } from 'react-redux';

import store from './app/redux';
import App from './app/App';


export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}
