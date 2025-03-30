import { useEffect, useRef } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { NotificationMessage } from "@/types/NotificationMessage";

type Handler = (payload: any) => void;

interface UseNotificationsOptions {
  on: Record<string, Handler>;
}

export function useNotifications({ on }: UseNotificationsOptions) {
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_AUTH_API_URL}/hubs/notification`)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection
      .start()
      .then(() => {
        console.log("✅ SignalR connected");

        connection.on("ReceiveNotification", (message: NotificationMessage) => {
          console.log("📦 message received:", message);
          console.log("🔍 type:", message.type);
          console.log("🔍 payload:", message.payload);
          const handler = on[message.type];
          if (handler) {
            handler(message.payload);
          } else {
            console.warn(`No handler for notification type: ${message.type}`);
          }
        });
      })
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      connection.stop();
    };
  }, [on]);
}
