"use client";
import { createContext, useContext, useState, useCallback } from "react";

type ToastMsg = { id: number; text: string; type?: "success" | "error" };
const ToastCtx = createContext<{ toast: (text: string, type?: ToastMsg["type"]) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastMsg[]>([]);

  const toast = useCallback((text: string, type: ToastMsg["type"] = "success") => {
    const id = Date.now();
    setItems((prev) => [...prev, { id, text, type }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 2500);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-[60]">
        {items.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2 rounded-md shadow text-sm ${
              t.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx.toast;
}