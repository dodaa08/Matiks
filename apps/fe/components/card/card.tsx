import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowBigRight } from "lucide-react";

export default function CardC() {
  return (
    <Card className="w-72  hover:scale-101 transition duration-300 ease-in-out cursor-pointer">
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              New Game
            </p>
            <span className="text-2xl font-bold">Sprint Duals</span>
          </div>
          <div className="flex size-10 items-center justify-center rounded-full bg-orange-500 text-white shadow">
            <ArrowBigRight className="size-5" />
          </div>
        </div>
        <p className="flex items-center gap-2 text-sm">
          <span className="flex items-center text-green-600">
            <ArrowUp className="size-4" />
            3.48% Played
          </span>
          <span className="whitespace-nowrap text-muted-foreground">
            Since last month
          </span>
        </p>
      </CardContent>
    </Card>
  );
}