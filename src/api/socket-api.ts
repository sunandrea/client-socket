import { Socket } from "socket.io-client";
import io from "socket.io-client";

interface ChatMessage {
  name: string;
  message: string;
  // fromUserId: string;

  toUserId: string;
}

const token =
  "s%3AslhgvBIJRUtp-YEE5i2izfibitwehG2N.3QjMNHbVszFCtKHEjUxQL9BpDjy0mzksbncSMGfNo%2FY";

class SocketApi {
  static socket: null | Socket = null;

  static createConnection() {
    this.socket = io(`http://localhost:3000`, {
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log(`connected on client`);
    });

    this.socket.on("disconnect", (e) => {
      console.log(`disconnect on client`);
    });
  }

  static joinRoom(room: string) {
    if (this.socket) {
      this.socket.emit("joinRoom", room);
    }
  }

  static leaveRoom(room: string) {
    if (this.socket) {
      this.socket.emit("leaveRoom", room);
    }
  }

  static sendPrivateMessage(message: ChatMessage) {
    if (this.socket) {
      this.socket.emit("text-chat", message);
    }
  }

  static receivePrivateMessage(callback: (msg: ChatMessage) => void) {
    if (this.socket) {
      this.socket.on("text-chat", (message: ChatMessage) => {
        console.log(`message`, message);
        callback(message);
      });
    }
  }
}

export default SocketApi;
