import { JSX } from "react";

export type Room = {
  roomID: string;
  player1: string;
  player2: string;
  player1Move: "rock" | "paper" | "scissors";
  player2Move: "rock" | "paper" | "scissors";
  status: "waiting" | "closed";
};

export type Move = {
  value: string;
  icon: JSX.Element;
  label: string;
};
