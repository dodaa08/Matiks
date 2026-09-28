export type User = {
    id : string;
    name : string;
    email : string;
};

export type ConnectedUser = User & {
  ws?: WebSocket;
};

export type GameStatus =
  | "RUNNING"
  | "SEARCHING"
  | "STOPPED";


export type GameT = {
    id : string;
    timelimit: number;
    adminId : string;
    gameStatus: GameStatus;
    startedAt : Date;
    endAt : Date | null;

    gameMembers : GameMember[];
    questions : Question[];
};

export type Question = {
  id: string;
  operation: "PLUS" | "MINUS" | "MULTIPLY" | "DIVIDE";
  numOfOprands: number;
  NumsToBeUsed: number[];
};
  

export type Answers = {
    id? : string;
    questionId : string;
    userId : string;
    SubmittedAns : number | null;
    isCorrect? : boolean | null;
};

export type Result = "WON" | "LOST" | "TIE" | "ABORTED" | null;

export type EndReason = "COMPLETED" | "TIMEOUT" | "DISCONNECTED" | "ABORTED";

export type GameMember = {
  id: string;
  gameId: string;
  userId: string;
  result: Result | null;
  score: number;
  questionsAnswered: number;
};