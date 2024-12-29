import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Move, Room } from "./types";
import { Hand, FileText, Scissors } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function findRoomByID(rooms: Room[], roomID: string) {
  return rooms.find((room) => room.roomID === roomID);
}

export function getWinnerUserName(room: Room) {
  if (room.player1Move === room.player2Move) {
    return "Égalité";
  }

  if (
    (room.player1Move === "rock" && room.player2Move === "scissors") ||
    (room.player1Move === "scissors" && room.player2Move === "paper") ||
    (room.player1Move === "paper" && room.player2Move === "rock")
  ) {
    return room.player1;
  }

  return room.player2;
}

export function getMoveName(move: string) {
  if (move === "rock") {
    return "Pierre";
  }
  if (move === "paper") {
    return "Feuille";
  }
  if (move === "scissors") {
    return "Ciseaux";
  }
}

export const MOVES: Move[] = [
  { value: "rock", icon: <Hand className="h-6 w-6" />, label: "Pierre" },
  { value: "paper", icon: <FileText className="h-6 w-6" />, label: "Feuille" },
  {
    value: "scissors",
    icon: <Scissors className="h-6 w-6" />,
    label: "Ciseaux",
  },
];
