import { useEffect } from "react";
import SocketApi from "@/api/socket-api";

export const useConnectSocket = () => {
  useEffect(() => {
    SocketApi.createConnection();
  }, []);

  return SocketApi.socket;
};
