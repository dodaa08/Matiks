"use client";
import { Input } from "@/components/ui/input";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useGame } from "@/store/game";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const SYMBOL : Record<string, string> = {
    PLUS : "+",
    MINUS : "-",
    MULTIPLY : "*",
    DIVIDE : "/"
}

const Game = () => {
    const game = useGame((e) => e.game);
    const [timer, setTimer] = useState<number>(0);
    const onlineUsers = useGame((e) => e.onlineUsers);
    const myUserId = useGame((e) => e.myUserId);
    const status = useGame((e) => e.status);
    const lastAnswer = useGame((e) => e.lastAnswer);
    const lastError = useGame((e) => e.lastError);
    const scores = useGame((e) => e.scores);

    const findScore = scores.find((e) => e.userId === myUserId);
    const questionIndex = findScore?.questionsAnswered ?? 0;
    const question = game?.questions[questionIndex];

    const [value, setValue] = useState("");

    const canAnswer = status === "RUNNING" && timer > 0 && !!question;
    const wrongForThisQuestion =
        !!question && lastAnswer?.questionId === question.id && lastAnswer.isCorrect === false;

    const submit = () => {
        if (!question || value.trim() === "") return;
        useGame.getState().sendAnswer(question.id, Number(value));
        setValue("");
    };

    const questionText = question
        ? question.numsToBeUsed.join(` ${SYMBOL[question.operation]} `)
        : "";

    useEffect(() => {
        if (!game) return;

        const calc = () => {
            const deadline = new Date(game.startedAt).getTime() + game.timelimit * 1000;
            return Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        };
        setTimer(calc());
        const id = setInterval(() => setTimer(calc()), 1000);

        return () => clearInterval(id);
    }, [game]);

    
    return (
        <>
            <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 px-4 py-2">
                <div className="flex w-full flex-row justify-between">
                    {game?.members.map((member) => {
                        const player = onlineUsers.find((e) => e.id === member.userId);
                        const memScore = scores.find((e)=>e.userId === member.userId)?.score ?? 0;
                        return (
                            <div key={member.userId} className="flex flex-col items-center space-y-2">
                                <Avatar className="size-17">
                                    <AvatarImage src={player?.image} />
                                    <AvatarFallback>{player?.name[0] ?? "?"}</AvatarFallback>
                                </Avatar>
                                <h1 className="text-center text-lg text-sidebar-foreground">{player?.name}</h1>
                                <h1>Score: {memScore}</h1>
                            </div>
                        );
                    })}
                </div>

                <div>{timer}</div>

                <div className="relative flex h-64 w-full items-center justify-center overflow-hidden">
                    <DotPattern />
                    <div className="absolute text-3xl text-sidebar-foreground">{questionText}</div>
                </div>

                <div className="flex flex-col items-center justify-center gap-2">
                    <h1 className="text-center text-sidebar-foreground text-lg">type your answers</h1>
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submit()}
                        disabled={!canAnswer}
                        type="number"
                        className="w-max"
                    />
                    <Button onClick={submit} disabled={!canAnswer}>Submit</Button>
                </div>
            </div>
        </>
    );
};

export default Game;
