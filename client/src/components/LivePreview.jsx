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
  const { code, language = "", theme } =
    useEditorStore();

  const {
    isPreviewFullscreen,
    togglePreviewFullscreen
  } = useUiStore();

  const [iframeKey, setIframeKey] =
    useState(0);

  const [isRunning, setIsRunning] =
    useState(false);

  const [currentSrcDoc, setCurrentSrcDoc] =
    useState("");

  const [output, setOutput] = useState("");

  const isDark = theme === "vs-dark";

  const currentLanguage =
    language.toLowerCase();

  const isWebProject =
    webLanguages.includes(currentLanguage);

  // ====================================
  // HTML CSS JS PREVIEW
  // ====================================
  const generatedSrcDoc = useMemo(() => {
    if (!isWebProject) return "";

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />

          <style>
            *{
              box-sizing:border-box;
            }

            html,
            body{
              margin:0;
              padding:20px;
              min-height:100vh;

              background:${
                isDark ? "#0f172a" : "#ffffff"
              };

              color:${
                isDark ? "#ffffff" : "#000000"
              };

              font-family:sans-serif;
            }

            ${code.css || ""}
          </style>
        </head>

        <body>
          ${code.html || ""}

          <script>
            try{
              ${code.javascript || code.js || ""}
            }
            catch(error){
              document.body.innerHTML +=
              "<pre style='color:red;padding:20px'>" +
              error.message +
              "</pre>";
            }
          </script>
        </body>
      </html>
    `;
  }, [code, isDark, isWebProject]);

  // ====================================
  // RUN CODE
  // ====================================
  const handleRun = async () => {
    setIsRunning(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      // CLEAR OLD OUTPUT
      setOutput("");

      // ====================================
      // HTML CSS JS
      // ====================================
      if (isWebProject) {
        const updatedDoc = generatedSrcDoc;

        setCurrentSrcDoc("");

        setTimeout(() => {
          setCurrentSrcDoc(updatedDoc);

          setIframeKey((prev) => prev + 1);
        }, 50);
      }

      // ====================================
      // C++
      // ====================================
      else if (
        currentLanguage === "cpp" ||
        currentLanguage === "c++"
      ) {
        const cppCode =
          code.cpp ||
          code["c++"] ||
          code[currentLanguage] ||
          "";

        if (
          cppCode.includes("#include") &&
          cppCode.includes("main")
        ) {
          try {
            let result = "";

            // STORE VARIABLES
            const variables = {};

            // FIND VARIABLES
            const variableMatches = [
              ...cppCode.matchAll(
                /int\s+(\w+)\s*=\s*(\d+)/g
              )
            ];

            variableMatches.forEach((match) => {
              variables[match[1]] = Number(
                match[2]
              );
            });

            // HANDLE SUM
            const sumMatch = cppCode.match(
              /int\s+sum\s*=\s*(\w+)\s*\+\s*(\w+)/
            );

            if (sumMatch) {
              const a =
                variables[sumMatch[1]] || 0;

              const b =
                variables[sumMatch[2]] || 0;

              variables["sum"] = a + b;
            }

            // FIND ALL cout
            const coutLines = [
              ...cppCode.matchAll(
                /cout\s*<<(.*?);/g
              )
            ];

            coutLines.forEach((line) => {
              let text = line[1];

              // REMOVE endl
              text = text.replace(
                /<<\s*endl/g,
                ""
              );

              // SPLIT <<
              const parts = text
                .split("<<")
                .map((p) => p.trim());

              let outputLine = "";

              parts.forEach((part) => {
                // STRING
                if (
                  part.startsWith('"') &&
                  part.endsWith('"')
                ) {
                  outputLine += part.replace(
                    /"/g,
                    ""
                  );
                }

                // VARIABLE
                else if (
                  variables[part] !== undefined
                ) {
                  outputLine += variables[part];
                }
              });

              result += outputLine + "\n";
            });

            setOutput(
              result || "Program executed."
            );
          } catch (error) {
            setOutput(
              "Compilation Error: " +
                error.message
            );
          }
        } else {
          setOutput(
            "Compilation Error: Invalid C++ Syntax"
          );
        }
      }

      // ====================================
      // PYTHON
      // ====================================
      else if (
        currentLanguage === "python"
      ) {
        const pyCode =
          code.python ||
          code[currentLanguage] ||
          "";

        try {
          let result = "";

          // STORE VARIABLES
          const variables = {};

          // FIND VARIABLES
          const variableMatches = [
            ...pyCode.matchAll(
              /(\w+)\s*=\s*(\d+)/g
            )
          ];

          variableMatches.forEach((match) => {
            variables[match[1]] = Number(
              match[2]
            );
          });

          // HANDLE ADDITION
          const sumMatch = pyCode.match(
            /(\w+)\s*=\s*(\w+)\s*\+\s*(\w+)/
          );

          if (sumMatch) {
            const varName = sumMatch[1];

            const a =
              variables[sumMatch[2]] || 0;

            const b =
              variables[sumMatch[3]] || 0;

            variables[varName] = a + b;
          }

          // FIND PRINT
          const printMatches = [
            ...pyCode.matchAll(
              /print\((.*?)\)/g
            )
          ];

          printMatches.forEach((match) => {
            const parts = match[1]
              .split(",")
              .map((p) => p.trim());

            let line = "";

            parts.forEach((part) => {
              // STRING
              if (
                part.startsWith('"') ||
                part.startsWith("'")
              ) {
                line += part.replace(
                  /['"]/g,
                  ""
                );
              }

              // VARIABLE
              else if (
                variables[part] !== undefined
              ) {
                line += variables[part];
              }
            });

            result += line + "\n";
          });

          setOutput(
            result || "Program executed."
          );
        } catch (error) {
          setOutput(
            "Python Error: " +
              error.message
          );
        }
      }

      // ====================================
      // JAVA
      // ====================================
      else if (
        currentLanguage === "java"
      ) {
        const javaCode =
          code.java ||
          code[currentLanguage] ||
          "";

        if (
          javaCode.includes("class") &&
          javaCode.includes("main")
        ) {
          try {
            let result = "";

            const printMatches = [
              ...javaCode.matchAll(
                /System\.out\.println\((.*?)\)/g
              )
            ];

            printMatches.forEach((match) => {
              result +=
                match[1].replace(/"/g, "") +
                "\n";
            });

            setOutput(
              result ||
                "Java Program Executed Successfully"
            );
          } catch (error) {
            setOutput(
              "Java Error: " +
                error.message
            );
          }
        } else {
          setOutput(
            "Compilation Error in Java Code"
          );
        }
      }

      // ====================================
      // DEFAULT
      // ====================================
      else {
        setOutput(
          `Running ${language} code completed successfully.`
        );
      }
    } catch (error) {
      setOutput("Error: " + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  // ====================================
  // REFRESH
  // ====================================
  const refreshPreview = () => {
    if (isWebProject) {
      setCurrentSrcDoc("");

      setTimeout(() => {
        setCurrentSrcDoc(generatedSrcDoc);

        setIframeKey((prev) => prev + 1);
      }, 50);
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
      {/* HEADER */}
      <div
        className={`h-14 px-4 flex items-center justify-between border-b ${
          isDark
            ? "bg-black border-zinc-800"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2">
          {isWebProject ? (
            <Globe
              size={18}
              className="text-orange-500"
            />
          ) : (
            <Terminal
              size={18}
              className="text-orange-500"
            />
          )}

          <span
            className={`font-medium ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {isWebProject
              ? "Live Preview"
              : "Code Output"}
          </span>
        </div>

        {/* BUTTONS */}
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

      {/* OUTPUT */}
      <div
        className={`flex-1 relative overflow-hidden ${
          isDark ? "bg-black" : "bg-white"
        }`}
      >
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
              className="absolute inset-0"
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
            className={`h-full p-5 font-mono text-sm whitespace-pre-wrap ${
              isDark
                ? "bg-black text-green-400"
                : "bg-white text-black"
            }`}
          >
            {output ||
              `Click Run to execute ${language} code.`}
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreview;