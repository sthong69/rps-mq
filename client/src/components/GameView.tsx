import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Room } from "@/lib/types";

type GameViewProps = {
  room: Room;
  onLeave: () => void;
};

export default function GameView({ room, onLeave }: GameViewProps) {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>RPS party</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Players:</h2>
            <p>
              Player 1: {room.player1} - Move:{" "}
              {room.player1Move || "Not played"}
            </p>
            <p>
              Player 2: {room.player2} - Move:{" "}
              {room.player2Move || "Not played"}
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Game Status:</h2>
            <p>
              {room.status === "waiting"
                ? "Waiting for players"
                : "Game in progress"}
            </p>
          </div>
          <Button onClick={onLeave}>Leave Room</Button>
        </CardContent>
      </Card>
    </div>
  );
}
