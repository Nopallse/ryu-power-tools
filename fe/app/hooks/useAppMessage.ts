"use client";

import { useCallback } from "react";
import { App } from "antd";

export function useAppMessage() {
  const { message } = App.useApp();
  
  return useCallback((type: "success" | "error" | "info" | "warning" | "loading", content: string, duration?: number) => {
    return message[type](content, duration);
  }, [message]);
}
