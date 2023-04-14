import { Server, Socket } from "socket.io";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
  },
};

const rooms: Record<string, { name: string }> = {};
const messages: Record<
  string,
  { message: string; username: string; time: string }
> = {};

function socket({ io }: { io: Server }) {
  console.log("socket enabled");

  io.on(EVENTS.connection, (socket: Socket) => {
    console.log(
      `${dayjs().format("MMM D, h:mm:ss")} : User connected ${socket.id}`
    );

    socket.emit(EVENTS.SERVER.ROOMS, rooms);

    // when user create a new room
    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      // crate a roomId
      const roomId = uuid();
      // add a new room to rooms object
      rooms[roomId] = {
        name: roomName,
      };

      // socket.join(roomId)
      socket.join(roomId);

      // broadcast an event saying there is a new room
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

      //emit back to the room creator  with all the rooms
      socket.emit(EVENTS.SERVER.ROOMS, rooms);

      //emit event back the room creator saying they have joined a room
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });

    // when user sends room message
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, message, username }) => {
        const date = new Date();

        messages[roomId] = {
          message,
          username,
          time: `${date.getHours()}:${date.getMinutes()}`,
        };

        console.log(messages)

        socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, messages[roomId]);
      }
    );

    // when a user joins a room
    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
      socket.join(roomId);

      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
  });
}

export default socket;
