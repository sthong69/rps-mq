"use client";
import { Button } from "@/components/ui/button";
import { Move, Room } from "@/lib/types";
import RoomCard from "./RoomCard";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Fragment, useState } from "react";
import { cn, MOVES } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

type RoomListProps = {
  username: string;
  rooms: Room[];
  onJoinRoom: (roomID: string, playerMove: string) => void;
  onRoomCreation: (playerMove: string) => void;
  onDisconnect: () => void;
  onRefresh: () => void;
};

export default function RoomList({
  username,
  rooms,
  onJoinRoom,
  onRoomCreation,
  onDisconnect,
  onRefresh,
}: RoomListProps) {
  const [selectedMove, setSelectedMove] = useState<Move>(MOVES[0]);
  const [showClosed, setShowClosed] = useState<boolean>(true);

  return (
    <div className="container mx-auto p-4 divide-y">
      <div className="pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">
            Bienvenue dans RPS MQ, {username} !
          </h1>
          <p className="mb-4">
            Vous pouvez créer une salle ou rejoindre une salle existante de
            pierre feuille ciseaux.
          </p>
        </div>
        <Button variant={"destructive"} onClick={() => onDisconnect()}>
          Déconnexion
        </Button>
      </div>
      <div className="pt-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <h1 className="text-2xl font-bold mb-4">Salles disponibles</h1>
            <Button onClick={() => onRefresh()}>
              <RefreshCw className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Créer une salle</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Créer une salle</DialogTitle>
                  <DialogDescription>
                    Choisissez un mouvement pour commencer une partie !
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center gap-4 py-8">
                  {MOVES.map((move) => (
                    <Button
                      key={move.value}
                      variant={
                        selectedMove.value === move.value
                          ? "default"
                          : "outline"
                      }
                      className={cn(
                        "flex flex-col items-center p-4 h-auto",
                        selectedMove.value === move.value &&
                          "ring-2 ring-primary"
                      )}
                      onClick={() => setSelectedMove(move)}
                    >
                      {move.icon}
                      <span className="mt-2">{move.label}</span>
                    </Button>
                  ))}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        onRoomCreation(selectedMove.value);
                        setSelectedMove(MOVES[0]);
                        onRefresh();
                      }}
                    >
                      Créer une salle
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={showClosed}
                onCheckedChange={() => setShowClosed(!showClosed)}
              />
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Affichez les parties terminées
              </label>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => {
            if (!showClosed && room.status === "closed") {
              return <Fragment key={room.roomID} />;
            } else {
              return (
                <RoomCard
                  key={room.roomID}
                  username={username}
                  room={room}
                  onJoinRoom={onJoinRoom}
                  onRefresh={onRefresh}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
