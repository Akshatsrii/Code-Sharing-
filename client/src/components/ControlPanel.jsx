import React from "react";
import {
  Layout,
  Columns,
  RefreshCcw,
  Code2
} from "lucide-react";

import { useEditorStore } from "../store/useEditorStore";
import { useUiStore } from "../store/useUiStore";

const ControlPanel = () => {
  const {
    language,
    setLanguage,
    theme,
    resetSnippet
  } = useEditorStore();

  const {
    setViewMode,
    viewMode
  } = useUiStore();

  const languages = [
    { id: "html", name: "HTML" },
    { id: "css", name: "CSS" },
    { id: "javascript", name: "JavaScript" },
    { id: "typescript", name: "TypeScript" },
    { id: "python", name: "Python" },
    { id: "cpp", name: "C++" },
    { id: "java", name: "Java" },
    { id: "json", name: "JSON" },
    { id: "rust", name: "Rust" }
  ];

  const isDark = theme === "vs-dark";

  return (
    <div
      className={`h-16 px-6 flex items-center justify-between border-b ${
        isDark
          ? "bg-black border-zinc-800"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        
        {/* Language Dropdown */}
        <div className="relative">
          <Code2
            size={16}
            className="absolute left-3 top-3 text-orange-500"
          />

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
            className={`pl-10 pr-4 py-2 rounded-xl border outline-none text-sm font-medium ${
              isDark
                ? "bg-zinc-900 text-white border-zinc-700"
                : "bg-gray-50 text-black border-gray-200"
            }`}
          >
            {languages.map((lang) => (
              <option
                key={lang.id}
                value={lang.id}
              >
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetSnippet}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${
            isDark
              ? "bg-zinc-900 text-white hover:bg-zinc-800"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <RefreshCcw size={16} />
          Reset
        </button>
      </div>

      {/* Right Section */}
      <div
        className={`flex items-center p-1 rounded-xl ${
          isDark
            ? "bg-zinc-900"
            : "bg-gray-100"
        }`}
      >
        {/* Editor */}
        <button
          onClick={() =>
            setViewMode("editor")
          }
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${
            viewMode === "editor"
              ? "bg-orange-500 text-white"
              : isDark
              ? "text-gray-300"
              : "text-gray-700"
          }`}
        >
          <Layout size={16} />
          Editor
        </button>

        {/* Split */}
        <button
          onClick={() =>
            setViewMode("split")
          }
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${
            viewMode === "split"
              ? "bg-orange-500 text-white"
              : isDark
              ? "text-gray-300"
              : "text-gray-700"
          }`}
        >
          <Columns size={16} />
          Split
        </button>

        {/* Output */}
        <button
          onClick={() =>
            setViewMode("preview")
          }
          className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${
            viewMode === "preview"
              ? "bg-orange-500 text-white"
              : isDark
              ? "text-gray-300"
              : "text-gray-700"
          }`}
        >
          <Layout
            size={16}
            className="rotate-90"
          />
          Output
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;