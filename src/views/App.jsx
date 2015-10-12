import React from 'react';

import Home from './Home';
import configureStore from '../store/configureStore';

import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

const store = configureStore();

export default React.createClass({
  displayName: 'App',

  render() {
    const provider = <Provider store={store}>
      <Home/>
    </Provider>;

    if (true) {
      return <div>
        {provider}
        <DebugPanel bottom right style={{ maxHeight: '50%', height: '50%' }}>
          <DevTools
            store={store}
            monitor={LogMonitor}
            // select={ (state) => (state.sampleCounter) }
          />
        </DebugPanel>
      </div>;
    }

    return provider;
  },
});
