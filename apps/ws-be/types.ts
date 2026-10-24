import { OpsSign } from "@repo/db";

export type GameStatus = "SEARCHING" | "RUNNING" | "STOPPED";
export type EndReason = "COMPLETED" | "TIMEOUT" | "DISCONNECTED" | "ABORTED";
export type User = { id: string; name: string; email: string };
export type Result = "LOST" | "WON" | "TIE" | "ABORTED";

export type GameMember = {
  id: string;
  gameId: string;
  userId: string;
  result: Result | null;
  score: number;
  questionsAnswered: number;
};

export type ConnectedUser = User & {
  ws?: WebSocket;
};

export type Question = {
  id: string;
  operation: OpsSign;
  numOfOperands: number;
  numsToBeUsed: number[];
};


export type GameT = {
  id: string;
  timelimit: number;
  adminId: string;
  gameStatus: GameStatus;
  startedAt: Date;
  endAt: Date | null;
  gameMembers: GameMember[];
  questions: Question[];
};


export type Answers = {
    id? : string;
    questionId : string;
    userId : string;
    SubmittedAns : number | null;
    isCorrect? : boolean | null;
};


export type ClientEvent =
  | { type: "FIND_MATCH" }
  | { type: "ANSWER"; data: { questionId: string; answer: number } };


  export type ServerEvent =
  | { type: "ONLINE_USERS"; users: User[] }
  | { type: "WAITING_FOR_OPPONENT"; data: { gameId: string } }
  | { type: "GAME_START"; data: { gameId: string; timelimit: number; startedAt: string; questions: Question[]; members: { userId: string }[] } }
  | { type: "ANSWER_RESULT"; data: { questionId: string; answer: number; isCorrect: boolean; score: number } }
  | { type: "SCORE_UPDATE"; data: { scores: { userId: string; score: number; questionsAnswered: number }[] } }
  | { type: "STOPPED"; reason: EndReason; result: { userId: string; score: number; questionsAnswered: number; result: Result | null }[] }
  | { type: "ERROR"; message: string };