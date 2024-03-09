"use client";
import React, { useState, useEffect } from "react";
import SocketApi from "@/api/socket-api";
import { useConnectSocket } from "@/hooks/useConnectSocket";
interface Message {
  name: string;
  message: string;
  // fromUserId: string;
  toUserId: string;
  geoData?: {
    latitude: number;
    longitude: number;
  };
}
const Chat = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [fromUserId, setFromUserId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  useConnectSocket();

  useEffect(() => {
    SocketApi.receivePrivateMessage((message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  useEffect(() => {
    handleAuthorize();
  }, []);

  const handleAuthorize = async () => {
    const response = await fetch("http://localhost:3000/stage/api/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      setFromUserId(data._id);
      console.log("Authorized:", data);
    } else {
      console.error("Authorize failed:", response.status, response.statusText);
    }
  };

  useEffect(() => {
    if (fromUserId && toUserId) {
      const roomName = [fromUserId, toUserId].sort().join("-");
      SocketApi.joinRoom(roomName);
    }
  }, [fromUserId, toUserId]);

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      (message || (latitude && longitude)) &&
      name &&
      fromUserId &&
      toUserId
    ) {
      const payload = {
        name,
        message,
        fromUserId,
        toUserId,
        geoData: latitude && longitude ? { latitude, longitude } : undefined,
      };
      SocketApi.sendPrivateMessage(payload);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <input
        className="p-2 border-2 border-gray-300 rounded-md"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Enter your name"
      />

      <input
        className="p-2 border-2 border-gray-300 rounded-md"
        type="text"
        value={toUserId}
        onChange={(event) => setToUserId(event.target.value)}
        placeholder="Enter recipient's user ID"
      />
      <input
        className="p-2 border-2 border-gray-300 rounded-md"
        type="number"
        value={latitude || ""}
        onChange={(event) => setLatitude(Number(event.target.value))}
        placeholder="Enter your latitude"
      />

      <input
        className="p-2 border-2 border-gray-300 rounded-md"
        type="number"
        value={longitude || ""}
        onChange={(event) => setLongitude(Number(event.target.value))}
        placeholder="Enter your longitude"
      />
      <div className="flex flex-col-reverse overflow-auto">
        {messages.map((msg: Message, index: number) => (
          <div
            key={index}
            className={`m-2 p-2 rounded-lg ${
              msg.name === name
                ? "ml-auto bg-blue-500 text-white"
                : "mr-auto bg-gray-300 text-black"
            }`}
          >
            <h3 className="font-bold">{msg.name}</h3>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <form className="m-2" onSubmit={sendMessage}>
        <input
          className="w-full p-2 border-2 border-gray-300 rounded-md"
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type a message"
        />
        <button
          className="w-full p-2 mt-2 bg-blue-500 text-white rounded-md"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
