"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyConnections } from "./my-connections";
import { PendingRequests } from "./pending-requests";
import { DiscoverPeople } from "./discover-people";

export function ConnectionsTabs() {
  return (
    <Tabs defaultValue="connections" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="connections">My Connections</TabsTrigger>
        <TabsTrigger value="requests">Pending Requests</TabsTrigger>
        <TabsTrigger value="discover">Discover People</TabsTrigger>
      </TabsList>

      <TabsContent value="connections">
        <MyConnections />
      </TabsContent>

      <TabsContent value="requests">
        <PendingRequests />
      </TabsContent>

      <TabsContent value="discover">
        <DiscoverPeople />
      </TabsContent>
    </Tabs>
  );
}
