import Room from './Room';

const LOBBY_ROOM_ID = "LOBBY";

export default function createSocketHandler(io){

  // ** clear empty rooms in interval globally
  if(global.clearEmptyRoomsInterval) clearInterval(global.clearEmptyRoomsInterval);
  global.clearEmptyRoomsInterval = setInterval(() => {
    Room.clearEmptyRooms();
    io.to(LOBBY_ROOM_ID).emit('rooms', Room.instances);
  }, 1000);
 
  return function socketHandler(socket){

  // 1: login(connected) -> emit logined with userData
  const { nickname, avatarUrl } = socket.handshake.query;
  const user = { id: socket.id, nickname, avatarUrl };
  socket.emit('logined', { user });

  // 2: fetchRooms -> emit rooms with roomsData
  socket.on('fetchRooms', () => {
    socket.emit('rooms', Room.instances);
  })

  // 3: createRoom -> emit room with roomData
  socket.on('createRoom', ({ title }) => {
    const room = Room.create({ title, user });
    if(room){
      socket.join(room.id, () => {
        socket.emit('room', room)
      })
    }
  })

  // 4: enterRoom -> broadcast room with RoomData
  socket.on('enterRoom', ({ id }) => {
    const room = Room.enter({ id, user });
    if(room){
      socket.join(room.id, () => {
        socket.emit('room', room) // to self
        socket.to(room.id).emit('room', room) // to others
      })
    }
  })

  // 5: leaveRoom -> broadcast room with RoomData
  const leaveRoomHandler = () => {
    const room = Room.leave({ user });
    if(room){
      socket.leave(room.id, () => {
        socket.to(room.id).emit('room', room);
      })
    }
  };

  socket.on('leaveRoom', leaveRoomHandler);

  // unexpected disconnection
  socket.on('disconnect', leaveRoomHandler);

  // 6: message -> broadcast room with RoomData(messages)
  socket.on('message', ({id, user, content}) => {
    const message = Room.message({ id, user, content });
    if(message){
      const roomData = { message };
      socket.emit('room', roomData); // to self
      socket.to(id).emit('room', roomData); // to other members
    }
  })
}
}
