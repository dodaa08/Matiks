"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGame } from "@/store/game";

export type ResultState = "WON" | "LOST" | "TIE" | "ABORTED";

const COPY: Record<ResultState, { badge: string; message: string; image: string }> = {
  ABORTED: {
    badge: "ABORTED",
    message: "Opponent left the match",
    image: "https://i.pinimg.com/1200x/a0/68/c7/a068c724ce1eb1f49342b2eeadbeb914.jpg",
  },
  WON: {
    badge: "WON",
    message: "You won!",
    image: "https://i.pinimg.com/1200x/a8/1d/e1/a81de1888b96c5063359346724cb17f2.jpg",
  },
  LOST: {
    badge: "LOST",
    message: "Better luck next time",
    image: "https://i.pinimg.com/1200x/a0/68/c7/a068c724ce1eb1f49342b2eeadbeb914.jpg",
  },
  TIE: {
    badge: "TIE",
    message: "It's a tie",
    image: "https://i.pinimg.com/736x/2a/c5/3d/2ac53d3c8ad60454cb6e011e58fb9f71.jpg",
  },
};

export function CardImage({
  result,
  myScore,
  opponentScore,
}: {
  result: ResultState;
  myScore: number;
  opponentScore: number;
}) {
  const copy = COPY[result];

  const handleNewGame = () => {
    useGame.getState().clearResult();
    useGame.getState().startSearch();
  };

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={copy.image}
        alt="Game result"
        className="relative z-20 aspect-video w-full object-cover"
      />

      <CardHeader>
        <CardAction>
          <Badge variant="secondary">{copy.badge}</Badge>
        </CardAction>
        <CardTitle>Game Ended</CardTitle>
        <CardDescription>{copy.message}</CardDescription>

        <div className="flex justify-center space-x-10 py-10">
          <CardDescription className="flex flex-col">
            <div>You</div>
            <div>{myScore}</div>
          </CardDescription>
          <CardDescription className="flex flex-col">
            <div>Opponent</div>
            <div>{opponentScore}</div>
          </CardDescription>
        </div>
      </CardHeader>

      <CardFooter>
        <Button className="w-full" onClick={handleNewGame}>
          New Game
        </Button>
      </CardFooter>
    </Card>
  );
}
