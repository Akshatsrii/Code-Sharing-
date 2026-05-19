import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Moon,
  Sun,
  Share2,
  Terminal,
  Play,
  Code2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUiStore } from "../store/useUiStore";
import { useEditorStore } from "../store/useEditorStore";

const supportedLanguages = [
  "javascript",
  "python",
  "cpp",
  "java",
  "typescript",
];

const CommandPalette = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    toggleAIPanel,
    setShareModalOpen,
    runCode, // make sure this exists in store
  } = useUiStore();

  const { setTheme, setLanguage } = useEditorStore();

  const [searchTerm, setSearchTerm] = useState("");

  const isDark = document.documentElement.classList.contains("dark");

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Open palette -> Ctrl + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }

      // Close palette -> Escape
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setCommandPaletteOpen]);

  const actions = [
    {
      id: 1,
      label: "Run Code",
      icon: <Play size={16} />,
      action: () => {
        runCode();
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 2,
      label: "Share Snippet",
      icon: <Share2 size={16} />,
      action: () => {
        setShareModalOpen(true);
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 3,
      label: "Toggle AI Assistant",
      icon: <Terminal size={16} />,
      action: () => {
        toggleAIPanel();
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 4,
      label: "Switch to Dark Theme",
      icon: <Moon size={16} />,
      action: () => {
        setTheme("vs-dark");
        document.documentElement.classList.add("dark");
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 5,
      label: "Switch to Light Theme",
      icon: <Sun size={16} />,
      action: () => {
        setTheme("light");
        document.documentElement.classList.remove("dark");
        setCommandPaletteOpen(false);
      },
    },
  ];

  // Add language actions dynamically
  const languageActions = supportedLanguages.map((lang, index) => ({
    id: index + 10,
    label: `Switch to ${lang}`,
    icon: <Code2 size={16} />,
    action: () => {
      setLanguage(lang);
      setCommandPaletteOpen(false);
    },
  }));

  const allActions = [...actions, ...languageActions];

  const filteredActions = useMemo(() => {
    return allActions.filter((action) =>
      action.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  if (!isCommandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border ${
            isDark
              ? "bg-black border-orange-500/20"
              : "bg-white border-orange-200"
          }`}
        >
          {/* Search Header */}
          <div
            className={`flex items-center px-5 py-4 border-b ${
              isDark
                ? "border-orange-500/20 bg-zinc-900"
                : "border-orange-200 bg-orange-50"
            }`}
          >
            <Search className="text-orange-500" size={20} />

            <input
              autoFocus
              type="text"
              placeholder="Search commands..."
              className={`w-full ml-3 bg-transparent outline-none text-sm ${
                isDark ? "text-white" : "text-gray-800"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div
              className={`text-xs px-2 py-1 rounded-md ${
                isDark
                  ? "bg-zinc-800 text-gray-300"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              ESC
            </div>
          </div>

          {/* Commands */}
          <div className="max-h-[450px] overflow-y-auto py-2">
            <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
              Commands
            </div>

            {filteredActions.length > 0 ? (
              filteredActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-all ${
                    isDark
                      ? "text-white hover:bg-zinc-900"
                      : "text-gray-800 hover:bg-orange-50"
                  }`}
                >
                  <span className="text-orange-500">{action.icon}</span>
                  {action.label}
                </button>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No commands found
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;