import Logger from '@root/logger';
import { Server, Socket } from 'socket.io';
import { documentService } from '../services/db/document.service';
import { otServer } from './OTServer';

const log: Logger = new Logger('SOCKET.IO', 'debug');
const roomUsers: Record<string, { userId: string, username: string }[]> = {}; 

export let socketIOUserObject: Server;
export const connectedUsersMap: Map<string, string> = new Map();
let users: string[] = [];

export class SocketIOUserHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOUserObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      log.info('Socket is connected and ready to receive...🔥...💥');

      socket.on('get-document', async ({ documentId, userId, username }: { documentId: string, userId: string, username: string }) => {
        socket.join(documentId);
        log.print(`Connected with socket id: ${socket.id}  roomId: ${documentId}`);

        if (!roomUsers[documentId]) {
          log.print(`Initializing roomUsers for roomId: ${documentId}`);
          roomUsers[documentId] = [];
        }

        const existingUser = roomUsers[documentId].find((user) => user.username === username);  
        if (!existingUser) {
          log.print(`Adding new user ${username} to room ${documentId}`);
          roomUsers[documentId].push({ userId, username });
          socket.broadcast.to(documentId).emit('user-joined', username);
          log.print(`Notified other users in room ${documentId} of new user ${username}`);
        } else {
          log.print(`User ${username} already in room ${documentId}, not re-adding or notifying.`);
        }

        this.io.in(documentId).emit('connected-users', roomUsers[documentId].map((user) => user.username));
  
        try {
          const value = await documentService.getDocumentById(documentId, userId);
          socket.emit('load-document', value?.data);
        } catch (error) {
          console.error('Error', error);
        }

        socket.on("send-changes", (delta, version) => {
          var deltaToSend = otServer.receiveDelta(version, delta);
          //broadcasting the changes to all the clients in the room with id = documentId, by emitting "receive-changes" event
          socket.broadcast.to(documentId).emit("receive-changes", deltaToSend);
          socket.emit("server-ack");
        });
        socket.on("save-document", async (data) => {
          await documentService.updateDocument(documentId, data);
        });
      });

  

      socket.on('setup', (data: { userId: string }) => {
        this.addClientToMap(data.userId, socket.id);
        this.addUser(data.userId);
        this.io.emit('user online', users);
      });

      socket.on('disconnect', () => {
        log.warn('Socket is DISCONNECTED...🛑...🛑');
        this.removeClientFromMap(socket.id);
      });
    });
  }
  

  private addClientToMap(username: string, socketId: string): void {
    if (!connectedUsersMap.has(username)) {
      connectedUsersMap.set(username, socketId);
    }
  }

  private removeClientFromMap(socketId: string): void {
    const disconnectedUser = Array.from(connectedUsersMap.entries()).find(([_, id]) => id === socketId);
    if (disconnectedUser) {
      connectedUsersMap.delete(disconnectedUser[0]);
      this.removeUser(disconnectedUser[0]);
      this.io.emit('user online', users);
    }
  }

  private addUser(username: string): void {
    users = Array.from(new Set([...users, username]));
  }

  private removeUser(username: string): void {
    users = users.filter((name) => name !== username);
  }
}
