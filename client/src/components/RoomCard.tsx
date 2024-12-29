"use client";
import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "./ui/card";
import { Move, Room } from "@/lib/types";
import { cn, getMoveName, getWinnerUserName, MOVES } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface RoomCardProps {
  username: string;
  room: Room;
  onJoinRoom: (roomID: string, playerMove: string) => void;
  onRefresh: () => void;
}

const RoomCard = (props: RoomCardProps) => {
  const [selectedMove, setSelectedMove] = React.useState<Move>(MOVES[0]);

  return (
    <Card className={props.room.status === "closed" ? "opacity-50" : ""}>
      <CardHeader>
        <CardTitle>Salle n°{props.room.roomID}</CardTitle>
        {props.room.status === "closed" ? (
          <CardDescription>
            Gagnant : {getWinnerUserName(props.room)}
          </CardDescription>
        ) : (
          <></>
        )}
      </CardHeader>
      <CardContent>
        <p>{`Joueur 1 : ${props.room.player1} ${
          props.room.status == "closed"
            ? `(${getMoveName(props.room.player1Move)})`
            : ""
        }`}</p>
        <p>{`Joueur 2 : ${
          props.room.status === "closed"
            ? `${props.room.player2} (${getMoveName(props.room.player2Move)})`
            : "N/A"
        }`}</p>
        <p>
          Statut:{" "}
          {props.room.status === "closed"
            ? "Partie terminée"
            : "En attente d'un joueur..."}
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              disabled={
                props.room.status === "closed" ||
                props.username == props.room.player1
              }
              className="mt-4"
            >
              {props.room.status === "waiting" ? "Rejoindre" : "Terminée"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Rejoindre la salle n°{props.room.roomID}
              </DialogTitle>
              <DialogDescription>
                Choisissez un mouvement pour rejoindre la partie !
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center gap-4 py-8">
              {MOVES.map((move) => (
                <Button
                  key={move.value}
                  variant={
                    selectedMove.value === move.value ? "default" : "outline"
                  }
                  className={cn(
                    "flex flex-col items-center p-4 h-auto",
                    selectedMove.value === move.value && "ring-2 ring-primary"
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
                    props.onJoinRoom(props.room.roomID, selectedMove.value);
                    setSelectedMove(MOVES[0]);
                    props.onRefresh();
                  }}
                >
                  Rejoindre
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
