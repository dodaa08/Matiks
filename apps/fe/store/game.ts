import { create } from "zustand";
import type { onlineUser, GameStartPayload, Score } from "@/types/types";

export type Status = "IDLE" | "SEARCHING" | "RUNNING" | "STOPPED"

type GameStore = {
  socket: WebSocket | null;
  status: Status;
  game: GameStartPayload | null;
  onlineUsers: onlineUser[];
  scores: Score[];

  setSocket: (socket: WebSocket | null) => void;
  startSearch: () => void;
  sendAnswer: (questionId: string, answer: number) => void;
  reset: () => void;
};

// Create the box
export const useGame = create<GameStore>((set, get) => ({
  status: "IDLE",
  game: null,
  socket: null,
  onlineUsers: [],
  scores: [],

  setSocket: (socket) => set({ socket }),

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
}));