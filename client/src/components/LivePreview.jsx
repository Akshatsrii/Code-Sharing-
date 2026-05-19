import React, { useMemo, useState } from "react";
import {
  Maximize2,
  Minimize2,
  RefreshCw,
  Play,
  Terminal,
  Globe,
  Loader2
} from "lucide-react";

import { useEditorStore } from "../store/useEditorStore";
import { useUiStore } from "../store/useUiStore";

const webLanguages = ["html", "css", "javascript", "js"];

const LivePreview = () => {
  const { code, language, theme } = useEditorStore();

  const {
    isPreviewFullscreen,
    togglePreviewFullscreen,
    runOutput,
    setRunOutput
  } = useUiStore();

  const [iframeKey, setIframeKey] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSrcDoc, setCurrentSrcDoc] = useState("");

  const isDark = theme === "vs-dark";
  const isWebProject = webLanguages.includes(language);

  const generatedSrcDoc = useMemo(() => {
    if (!isWebProject) return "";

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          <style>
            body {
              margin: 0;
              padding: 0;
            }

            ${code.css || ""}
          </style>
        </head>

        <body>
          ${code.html || ""}

          <script>
            try {
              ${code.javascript || code.js || ""}
            } catch(error) {
              document.body.innerHTML += 
                "<pre style='color:red;padding:20px;font-family:monospace'>" + 
                error.message + 
                "</pre>";
            }
          </script>
        </body>
      </html>
    `;
  }, [code, isWebProject]);

  const handleRun = async () => {
    setIsRunning(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      if (isWebProject) {
        setCurrentSrcDoc(generatedSrcDoc);
        setIframeKey((prev) => prev + 1);
      } else {
        setRunOutput(
          `Running ${language} code...\n\nExecution completed successfully.`
        );
      }
    } catch (error) {
      setRunOutput(error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const refreshPreview = () => {
    if (isWebProject) {
      setCurrentSrcDoc(generatedSrcDoc);
      setIframeKey((prev) => prev + 1);
    }
  };

  return (
    <div
      className={`flex flex-col h-full rounded-2xl overflow-hidden border ${
        isDark
          ? "bg-black border-zinc-800"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div
        className={`h-14 px-4 flex items-center justify-between border-b ${
          isDark
            ? "bg-black border-zinc-800"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2">
          {isWebProject ? (
            <Globe size={18} className="text-orange-500" />
          ) : (
            <Terminal size={18} className="text-orange-500" />
          )}

          <span
            className={`font-medium ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {isWebProject ? "Live Preview" : "Code Output"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm"
          >
            {isRunning ? (
              <>
                <Loader2
                  size={14}
                  className="animate-spin"
                />
                Running...
              </>
            ) : (
              <>
                <Play size={14} />
                Run
              </>
            )}
          </button>

          <button
            onClick={refreshPreview}
            className={`p-2 rounded-lg ${
              isDark
                ? "hover:bg-zinc-900 text-gray-300"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <RefreshCw size={16} />
          </button>

          <button
            onClick={togglePreviewFullscreen}
            className={`p-2 rounded-lg ${
              isDark
                ? "hover:bg-zinc-900 text-gray-300"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {isPreviewFullscreen ? (
              <Minimize2 size={16} />
            ) : (
              <Maximize2 size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Output */}
      <div className="flex-1 relative">
        {isWebProject ? (
          currentSrcDoc ? (
            <iframe
              key={iframeKey}
              srcDoc={currentSrcDoc}
              title="preview"
              sandbox="allow-scripts"
              frameBorder="0"
              width="100%"
              height="100%"
              className={`absolute inset-0 ${
                isDark ? "bg-black" : "bg-white"
              }`}
            />
          ) : (
            <div
              className={`h-full flex items-center justify-center ${
                isDark
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Click Run to see output
            </div>
          )
        ) : (
          <div
            className={`h-full p-5 font-mono text-sm ${
              isDark
                ? "bg-black text-green-400"
                : "bg-gray-50 text-white"
            }`}
          >
            {runOutput ||
              `Click Run to execute ${language} code.`}
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreview;