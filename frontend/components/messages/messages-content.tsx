"use client";

import { useState } from "react";
import { useConnections } from "@/lib/contexts/connections-context";
import { useAuth } from "@/lib/contexts/auth-context";
import { MessagesList } from "@/components/messages/messages-list";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageCircle } from "lucide-react";
import type { Connection, User } from "@/lib/types";

export function MessagesContent() {
  const { user } = useAuth();
  const { acceptedConnections, loading } = useConnections();
  const [selectedConnection, setSelectedConnection] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const getConnectedUser = (connection: Connection): User | undefined => {
    return connection.sender_id === user?.id
      ? connection.receiver
      : connection.sender;
  };

  const uniqueConnections = acceptedConnections.filter(
    (connection, index, self) =>
      index === self.findIndex((c) => c.id === connection.id)
  );

  const filteredConnections = uniqueConnections.filter((connection) => {
    const connectedUser = getConnectedUser(connection);
    if (!connectedUser) return false;

    return (
      connectedUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      connectedUser.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <div className="animate-pulse">Loading messages...</div>;
  }

  if (acceptedConnections.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No connections yet</h3>
          <p className="text-muted-foreground mb-4">
            Connect with people to start messaging.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Connections List */}
      <Card className="lg:col-span-1">
        <CardContent className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search connections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredConnections.map((connection) => {
              const connectedUser = getConnectedUser(connection);
              if (!connectedUser) return null;

              return (
                <div
                  key={connection.id}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                    selectedConnection === connection.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedConnection(connection.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={connectedUser.avatar_url || "/placeholder.svg"}
                        alt={connectedUser.name}
                      />
                      <AvatarFallback>
                        {connectedUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">
                        {connectedUser.name}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        @{connectedUser.username}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Messages Area */}
      <Card className="lg:col-span-2">
        <CardContent className="p-0 h-full">
          {selectedConnection ? (
            (() => {
              const connection = filteredConnections.find(
                (c) => c.id === selectedConnection
              );
              const connectedUser = connection
                ? getConnectedUser(connection)
                : null;

              return connectedUser ? (
                <MessagesList
                  connectionId={selectedConnection}
                  otherUser={connectedUser}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Connection not found</p>
                </div>
              );
            })()
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Select a conversation
                </h3>
                <p className="text-muted-foreground">
                  Choose a connection from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
