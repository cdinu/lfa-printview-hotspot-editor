import React from 'react';
import { Provider } from 'react-redux';

import Home from './Home';
import configureStore from '../store/configureStore';

const store = configureStore();

export default function App() {
  return (
    <Provider store={store}>
      <Home/>
    </Provider>
  );
}
