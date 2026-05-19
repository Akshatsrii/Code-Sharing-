import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X
} from "lucide-react";

import { useUiStore } from "../store/useUiStore";
import { useEditorStore } from "../store/useEditorStore";

const ToastContainer = () => {
  const { toasts, removeToast } = useUiStore();
  const { theme } = useEditorStore();

  const isDark = theme === "vs-dark";

  const getToastConfig = (type) => {
    switch (type) {
      case "success":
        return {
          icon: (
            <CheckCircle2
              size={20}
              className="text-green-500"
            />
          ),
          bg: isDark
            ? "bg-green-500/10 border-green-500/20"
            : "bg-green-50 border-green-200"
        };

      case "error":
        return {
          icon: (
            <AlertCircle
              size={20}
              className="text-red-500"
            />
          ),
          bg: isDark
            ? "bg-red-500/10 border-red-500/20"
            : "bg-red-50 border-red-200"
        };

      default:
        return {
          icon: (
            <Info
              size={20}
              className="text-orange-500"
            />
          ),
          bg: isDark
            ? "bg-orange-500/10 border-orange-500/20"
            : "bg-orange-50 border-orange-200"
        };
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[120] flex flex-col gap-3">
      <AnimatePresence>
        {toasts?.map((toast) => {
          const config = getToastConfig(
            toast.type
          );

          return (
            <motion.div
              key={toast.id}
              initial={{
                opacity: 0,
                x: 100,
                scale: 0.9
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1
              }}
              exit={{
                opacity: 0,
                x: 100,
                scale: 0.9
              }}
              transition={{
                duration: 0.25
              }}
              className={`
                min-w-[320px]
                max-w-[400px]
                rounded-2xl
                border
                shadow-xl
                px-4
                py-4
                flex
                items-start
                gap-3
                ${config.bg}
                ${
                  isDark
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }
              `}
            >
              <div className="mt-1">
                {config.icon}
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() =>
                  removeToast(toast.id)
                }
                className={`p-1 rounded-lg ${
                  isDark
                    ? "hover:bg-zinc-800"
                    : "hover:bg-orange-100"
                }`}
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;