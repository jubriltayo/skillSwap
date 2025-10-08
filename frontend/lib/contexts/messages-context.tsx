"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { MessageService, Message } from "@/lib/services/messages";

interface MessagesContextType {
  messages: Record<string, Message[]>;
  loading: boolean;
  sendMessage: (connectionId: string, message: string) => Promise<any>;
  loadMessages: (connectionId: string) => Promise<any>;
}

const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined
);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);

  const loadMessages = useCallback(async (connectionId: string) => {
    setLoading(true);
    try {
      const result = await MessageService.getMessages(connectionId);

      if (result.success && result.data) {
        const messagesArray = Array.isArray(result.data)
          ? result.data
          : [result.data];

        setMessages((prev) => ({
          ...prev,
          [connectionId]: messagesArray,
        }));
      } else {
        setMessages((prev) => ({
          ...prev,
          [connectionId]: [],
        }));
      }
      return result;
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (connectionId: string, messageText: string) => {
      const result = await MessageService.sendMessage(
        connectionId,
        messageText
      );

      if (result.success && result.data) {
        const newMessage = result.data as Message;

        setMessages((prev) => {
          const currentMessages = prev[connectionId] || [];
          const updatedMessages = [...currentMessages, newMessage];

          return {
            ...prev,
            [connectionId]: updatedMessages,
          };
        });
      }
      return result;
    },
    []
  );

  return (
    <MessagesContext.Provider
      value={{
        messages,
        loading,
        sendMessage,
        loadMessages,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
}
