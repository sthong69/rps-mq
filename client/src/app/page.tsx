"use client";
import { useEffect, useState } from "react";
import { Room } from "@/lib/types";
import GameView from "@/components/GameView";
import LoginForm from "@/components/LoginForm";
import RoomList from "@/components/RoomList";
import { setupUserQueue } from "./actions/setupUserQueue";
import { sendMessage } from "./actions/sendMessage";

function App() {
  const [username, setUsername] = useState<string>(
    localStorage.getItem("username") ?? ""
  );
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (username) {
      handleSetup(username);
      handleRefresh();
    }
  }, [username]);

  // Setup user queue, binds it to the "update" queue and start listening to messages
  const handleSetup = async (name: string) => {
    if (name.trim()) {
      const result = await setupUserQueue(name);
      if (result.success) {
        // Start listening to messages
        const eventSource = new EventSource(
          `/api/listen?username=${encodeURIComponent(name)}`
        );
        eventSource.onmessage = (event) => {
          const newMessage = JSON.parse(JSON.parse(event.data));
          setRooms(newMessage);
          console.log("Received message:", newMessage);
        };
        eventSource.onerror = (error) => {
          console.error("EventSource failed:", error);
          eventSource.close();
        };
      }
    }
  };

  const handleLogin = async (name: string) => {
    const result = await sendMessage("connections", name);
    if (result.success) {
      console.log("User connected");
      await handleSetup(name);
      localStorage.setItem("username", name);
      setUsername(name);
    }
  };

  const handleDisconnect = () => {
    localStorage.setItem("username", "");
    setUsername("");
  };

  const handleRefresh = async () => {
    const result = await sendMessage("connections", username);
    if (result.success) {
      console.log("Refreshed");
    }
  };

  const handleJoinRoom = async (roomID: string, playerMove: string) => {
    const result = await sendMessage(
      "join",
      JSON.stringify({
        roomID: roomID,
        player: username,
        playerMove: playerMove,
      })
    );
    if (result.success) {
      console.log("Room created");
    }
  };

  const handleRoomCreation = async (playerMove: string) => {
    const result = await sendMessage(
      "create",
      JSON.stringify({ player: username, playerMove: playerMove })
    );
    if (result.success) {
      console.log("Room created");
    }
  };

  if (!username) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <RoomList
      username={username}
      rooms={rooms}
      onJoinRoom={handleJoinRoom}
      onRoomCreation={handleRoomCreation}
      onDisconnect={handleDisconnect}
      onRefresh={handleRefresh}
    />
  );
}

export default App;
