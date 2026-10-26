"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/store/game";
import { CardImage, ResultState } from "@/components/card/card-result";

const Result = () => {
    const router = useRouter();
    const lastResult = useGame((e) => e.lastResult);
    const myUserId = useGame((e) => e.myUserId);
    const endReason = useGame((e) => e.endReason);

    const findResult = lastResult?.find((e) => e.userId === myUserId);
    const findResultOpp = lastResult?.find((e) => e.userId !== myUserId);

    // Refresh or direct visit: no stored result, go back to the dashboard.
    // Wait for myUserId to load first, otherwise the lookups above are unreliable.
    useEffect(() => {
        if (myUserId && (!findResult || !findResultOpp)) router.replace("/dashboard");
    }, [myUserId, findResult, findResultOpp, router]);

    if (!myUserId || !findResult || !findResultOpp) return null;

    // An aborted match has its own state, regardless of the score-based outcome.
    const outcome: ResultState | null =
        endReason === "ABORTED" ? "ABORTED" : findResult.result;
    if (outcome !== "WON" && outcome !== "LOST" && outcome !== "TIE" && outcome !== "ABORTED") return null;

    return (
        <CardImage
            result={outcome}
            myScore={findResult.score}
            opponentScore={findResultOpp.score}
        />
    );
};

export default Result;
