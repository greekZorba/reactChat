import React from 'react';
import { observer } from 'mobx-react';
import Prompt from './Prompt';
import Lobby from './Lobby';
import Room from './Room';

@observer
export default class App extends React.Component {
  render() {
    const { state, socket } = this.props;

    if (!state.user) {
      return (
        <Prompt
          login={socket.login}
        />
      )

    } else if (!state.activeRoomId) {
      return (
        <Lobby
          user={state.user}
          rooms={state.rooms}
          fetchRooms={socket.fetchRooms}
          createRoom={socket.createRoom}
          enterRoomById={id => state.enterRoom({ id })}
        />
      )

    } else {
      return (
        <Room
          user={state.user}
          roomId={state.activeRoomId}
          room={state.activeRoom}
          update={state.updateActiveRoom}
          message={socket.messageToRoom}
        />
      )
    }
  }
}
