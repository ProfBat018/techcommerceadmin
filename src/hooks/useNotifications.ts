import { useEffect, useRef } from "react";
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { NotificationMessage } from "@/types/NotificationMessage";

type Handler = (payload: any) => void;

interface UseNotificationsOptions {
  on: Record<string, Handler>;
}

export function useNotifications({ on }: UseNotificationsOptions) {
  const connectionRef = useRef<HubConnection | null>(null);
  const handlersRef = useRef<Record<string, Handler>>(on);

  // Обновляем ref при изменении on
  useEffect(() => {
    handlersRef.current = on;
  }, [on]);

  useEffect(() => {
    if (connectionRef.current) return; // уже подключено

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
          const handler = handlersRef.current[message.type];
          if (handler) {
            handler(message.payload);
          } else {
            console.warn(
              `⚠️ No handler for notification type: ${message.type}`
            );
          }
        });
      })
      .catch((err) => {
        console.error("❌ SignalR connection error:", err);
      });

    connection.onclose((error) => {
      console.warn("🔌 SignalR disconnected:", error);
    });

    return () => {
      connection.stop().then(() => {
        console.log("🛑 SignalR stopped");
      });
    };
  }, []);
}
