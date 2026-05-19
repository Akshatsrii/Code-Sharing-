import React from "react";
import {
  Share2,
  Grid3X3,
  Sparkles,
  Sun,
  Moon,
  Code2
} from "lucide-react";
import { Link } from "react-router-dom";

import { useEditorStore } from "../store/useEditorStore";
import { useUiStore } from "../store/useUiStore";

const Navbar = () => {
  const { isShared, theme, setTheme } = useEditorStore();

  const {
    toggleAIPanel,
    setShareModalOpen
  } = useUiStore();

  const isDark = theme === "vs-dark";

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "vs-dark");
  };

  return (
    <nav
      className={`h-16 sticky top-0 z-50 px-6 flex items-center justify-between border-b ${
        isDark
          ? "bg-black border-zinc-800"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Left */}
      <div className="flex items-center gap-5">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
            <Code2 size={20} />
          </div>

          <div>
            <h1
              className={`text-lg font-bold ${
                isDark
                  ? "text-white"
                  : "text-black"
              }`}
            >
              NoteCode
            </h1>

            <p className="text-xs text-orange-500">
              Online Code Editor
            </p>
          </div>
        </Link>

        {/* Gallery */}
        <Link
          to="/gallery"
          className={`flex items-center gap-2 text-sm ${
            isDark
              ? "text-gray-300 hover:text-orange-400"
              : "text-gray-700 hover:text-orange-500"
          }`}
        >
          <Grid3X3 size={16} />
          Gallery
        </Link>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle (ONLY ONE) */}
        <button
          onClick={handleThemeToggle}
          className={`p-2 rounded-xl ${
            isDark
              ? "bg-zinc-900 text-orange-400"
              : "bg-orange-50 text-orange-600"
          }`}
        >
          {isDark ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

        {/* AI Assistant */}
        <button
          onClick={toggleAIPanel}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
            isDark
              ? "bg-zinc-900 text-orange-400"
              : "bg-orange-50 text-orange-600"
          }`}
        >
          <Sparkles size={16} />
          AI Assistant
        </button>

        {/* Share */}
        <button
          onClick={() =>
            setShareModalOpen(true)
          }
          disabled={isShared}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 text-white ${
            isShared
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          <Share2 size={16} />
          {isShared ? "Shared" : "Share"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;