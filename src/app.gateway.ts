import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

let connections: string[] = [];
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    console.log(client.id);
    this.server.emit('msgToClient', payload);
    this.server.emit('healthUpdate', 'Server is healthy');
  }

  afterInit(server: Server) {
    this.logger.log('init');
  }

  handleDisconnect(client: Socket) {
    connections = connections.filter((c) => c == client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    if (!connections.includes(client.id)) {
      connections.push(client.id);
    }
    this.logger.log(`Client connected: ${client.id}`);
  }
}
