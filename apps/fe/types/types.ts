export type onlineUser = {
    id : string,
    name : string,
    image : string
}

export type Result = "WON" | "LOST" | "TIE" | "ABORTED" | null;
export type EndReason = "COMPLETED" | "TIMEOUT" | "DISCONNECTED" | "ABORTED";

export type gameMember = {
    gameId : string,
    name : string,
    user : onlineUser,
    result : Result,
    score : number,
    questionsAnswered: number;
}
