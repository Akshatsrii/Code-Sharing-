import React, { useRef } from "react";
import Editor from "@monaco-editor/react";
import { useEditorStore } from "../store/useEditorStore";
import { Code2 } from "lucide-react";

const CodeEditor = ({ language }) => {
  const { code, setCode, theme } = useEditorStore();
  const editorRef = useRef(null);

  // editor mount
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // code change
  const handleEditorChange = (value = "") => {
    setCode(language, value);
  };

  const isDark = theme === "vs-dark";

  return (
    <div
      className={`w-full h-full rounded-2xl overflow-hidden shadow-lg border transition-all duration-300 ${
        isDark
          ? "bg-black border-orange-500/20"
          : "bg-white border-orange-200"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          isDark
            ? "bg-zinc-900 border-orange-500/20"
            : "bg-orange-50 border-orange-200"
        }`}
      >
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-orange-500" />
          <span
            className={`font-semibold text-sm uppercase tracking-wide ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            {language} Editor
          </span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isDark
                ? "bg-orange-500/20 text-orange-400"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            {language}
          </span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="h-[calc(100%-60px)]">
        <Editor
          height="100%"
          language={language}
          value={code[language] || ""}
          theme={isDark ? "vs-dark" : "light"}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            lineHeight: 24,
            padding: {
              top: 16,
              bottom: 16,
            },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            formatOnPaste: true,
            formatOnType: true,
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            matchBrackets: "always",
            wordWrap: "on",
            suggestOnTriggerCharacters: true,
          }}
          loading={
            <div
              className={`flex items-center justify-center h-full ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Loading editor...
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CodeEditor;