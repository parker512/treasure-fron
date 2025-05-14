import { create } from "zustand";

interface Message {
  id: number;
  sender: number;
  content: string;
  timestamp: string;
}

interface ChatState {
  currentChatId: number | null;
  messages: Message[];
  setCurrentChatId: (id: number) => void;
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentChatId: null,
  messages: [],
  setCurrentChatId: (id) => set({ currentChatId: id }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setMessages: (msgs) => set({ messages: msgs }),
}));
