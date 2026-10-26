export type onlineUser = {
    id : string,
    name : string,
    image? : string
}

export type Result = "WON" | "LOST" | "TIE" | "ABORTED" | null;
export type EndReason = "COMPLETED" | "TIMEOUT" | "DISCONNECTED" | "ABORTED";
export type GameStatus =
  | "RUNNING"
  | "SEARCHING"
  | "STOPPED";



export type gameMember = {
    gameId : string,
    name : string,
    user : onlineUser,
    result : Result,
    score : number,
    questionsAnswered: number;
};

export type dummyOnlines = {
    id : string,
    image : string,
    name : string
}

export type GameStartPayload = {
  gameId: string;
  timelimit: number;
  startedAt: string; // Dates become ISO strings after JSON
  questions: Question[];
  members: { userId: string }[];
};

export type Score = {
  userId: string;
  score: number;
  questionsAnswered: number;
};


export type Question = {
  id: string;
  operation: "PLUS" | "MINUS" | "MULTIPLY" | "DIVIDE";
  numOfOperands: number;
  numsToBeUsed: number[];
};

export type GameT = {
    id : string;
    timelimit: number;
    adminId : string;
    gameStatus: GameStatus;
    startedAt : Date | null;
    endAt : Date | null;

    gameMembers : gameMember[];
    questions : Question[];
};

export type StoppedResult = Score & { result: Result };