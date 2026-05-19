import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  Link as LinkIcon,
  Share2
} from "lucide-react";

import { useUiStore } from "../store/useUiStore";
import { useEditorStore } from "../store/useEditorStore";

const ShareModal = () => {
  const {
    isShareModalOpen,
    setShareModalOpen,
    addToast
  } = useUiStore();

  const {
    code,
    theme
  } = useEditorStore();

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const isDark = theme === "vs-dark";

  const handleShare = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/code/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            language: "workspace",
            title: title || "Untitled Snippet",
            author: author || "Anonymous",
          }),
        }
      );

      const data = await response.json();

      const shareUrl = `http://localhost:5173/s/${data._id}`;

      setShareData({
        url: shareUrl,
        id: data._id,
      });

      addToast("Snippet shared successfully!", "success");
    } catch (error) {
      console.error(error);
      addToast("Failed to share snippet", "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareData) return;

    await navigator.clipboard.writeText(shareData.url);

    setCopied(true);
    addToast("Link copied successfully!", "success");

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const closeModal = () => {
    setShareModalOpen(false);

    setTimeout(() => {
      setShareData(null);
      setTitle("");
      setAuthor("");
      setCopied(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isShareModalOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          />

          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: "-50%",
              y: "-50%",
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              x: "-50%",
              y: "-50%",
            }}
            className={`fixed top-1/2 left-1/2 z-[101] w-[90%] max-w-md rounded-2xl shadow-2xl border p-6 ${
              isDark
                ? "bg-black border-orange-500/20"
                : "bg-white border-orange-200"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Share2 className="text-orange-500" size={20} />
                <h2
                  className={`text-xl font-bold ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Share Code
                </h2>
              </div>

              <button
                onClick={closeModal}
                className={`p-2 rounded-lg ${
                  isDark
                    ? "hover:bg-zinc-900 text-white"
                    : "hover:bg-orange-50 text-black"
                }`}
              >
                <X size={18} />
              </button>
            </div>

            {!shareData ? (
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="text-sm font-medium text-orange-500">
                    Project Title
                  </label>

                  <input
                    type="text"
                    placeholder="Enter project title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border outline-none ${
                      isDark
                        ? "bg-zinc-900 text-white border-orange-500/20"
                        : "bg-orange-50 text-black border-orange-200"
                    }`}
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="text-sm font-medium text-orange-500">
                    Author Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={`w-full mt-2 px-4 py-3 rounded-xl border outline-none ${
                      isDark
                        ? "bg-zinc-900 text-white border-orange-500/20"
                        : "bg-orange-50 text-black border-orange-200"
                    }`}
                  />
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  disabled={loading}
                  className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LinkIcon size={18} />
                      Generate Link
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Success */}
                <div className="bg-green-100 text-green-600 p-3 rounded-xl text-center text-sm font-medium">
                  Share link generated successfully!
                </div>

                {/* Link Copy */}
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={shareData.url}
                    className={`flex-1 px-4 py-3 rounded-xl border text-sm ${
                      isDark
                        ? "bg-zinc-900 text-white border-orange-500/20"
                        : "bg-orange-50 text-black border-orange-200"
                    }`}
                  />

                  <button
                    onClick={copyToClipboard}
                    className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl"
                  >
                    {copied ? (
                      <Check size={18} />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl border border-orange-300 text-orange-500 hover:bg-orange-50 transition"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;