import React from 'react';

import { observer } from 'mobx-react';
import Prompt from './Prompt';
import Lobby from './Lobby';
import Room from './Room';

@observer
export default class App extends React.Component {
  render() {
    return (
      <div>
        <DevTool />
        <h1>{JSON.stringify(toJS(this.props.state))}</h1>
      </div>
    );
  }
}
