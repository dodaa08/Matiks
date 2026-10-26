import { create } from "zustand";
import type { onlineUser, GameStartPayload, Score, EndReason, StoppedResult  } from "@/types/types";

export type Status = "IDLE" | "SEARCHING" | "RUNNING" | "STOPPED"

type GameStore = {
  socket: WebSocket | null;
  status: Status;
  game: GameStartPayload | null;
  onlineUsers: onlineUser[];
  scores: Score[];
  endReason: EndReason | null;
  lastResult: StoppedResult[] | null;
  myUserId : string  | null;
  lastAnswer: { questionId: string; answer: number; isCorrect: boolean; score: number } | null
  lastError: string | null
  setSocket: (socket: WebSocket | null) => void;
  startSearch: () => void;
  clearResult: ()=>void;
  sendAnswer: (questionId: string, answer: number) => void;
  reset: () => void;
  setMyUserId : (id : string)=>void;
};

// Create the box
export const useGame = create<GameStore>((set, get) => ({
  status: "IDLE",
  game: null,
  socket: null,
  onlineUsers: [],
  scores: [],
  endReason : null,
  lastResult : null,
  myUserId : null,
  lastAnswer:  null,
  lastError: null,

  setSocket: (socket) => set({ socket }),
  setMyUserId :  (id) => set({ myUserId: id }),

  startSearch: () => {
    const { socket, status } = get();
    if (socket?.readyState !== WebSocket.OPEN) return;
    if (status !== "IDLE") return;
    socket.send(JSON.stringify({ type: "WAITING" }));
  },

  sendAnswer: (questionId, answer) => {
    get().socket?.send(
      JSON.stringify({ type: "ANSWER", data: { questionId, answer } })
    );
  },

  reset: () => set({ status: "IDLE", game: null, scores: [] }),
  clearResult : ()=>set({ status: "IDLE", endReason : null, lastResult : null })
}));
