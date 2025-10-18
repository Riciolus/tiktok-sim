"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type CommentContextType = {
  isCommentActive: boolean;
  setIsCommentActive: Dispatch<SetStateAction<boolean>>;
};

// Default value (optional)
const CommentContext = createContext<CommentContextType | null>(null);

export function CommentProvider({ children }: { children: ReactNode }) {
  const [isCommentActive, setIsCommentActive] = useState(false);

  const value = { isCommentActive, setIsCommentActive };

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
}

export function useComment() {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useComment must be used within a CommentProvider");
  }
  return context;
}
