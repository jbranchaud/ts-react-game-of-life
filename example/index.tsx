import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Game } from './game';

const App = () => {
  return (
    <div>
      <Game />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
