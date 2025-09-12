"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface ToastProps {
  message: string;
  show: boolean;
  type?: "add" | "remove";
  onUndo?: () => void;
}

export default function Toast({ message, show, type = 'add', onUndo }: ToastProps) {
    const bgColor = type === "add" ? "bg-green-600" : "bg-red-600";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          <span>{message}</span>
          {onUndo && (
            <button
              onClick={onUndo}
              className="underline text-sm hover:text-gray-200 transition"
            >
              Undo
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
