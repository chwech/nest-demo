import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
// import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FeishuGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @SubscribeMessage('ping')
  handlePong(client: Socket, data) {
    client.emit('pong', data);
  }

  handleConnection(client: Socket) {
    console.log('websocket连接');
  }
  handleDisconnect(client: Socket) {
    // console.log(`Client disconnected: ${client.id}`);
  }
}
