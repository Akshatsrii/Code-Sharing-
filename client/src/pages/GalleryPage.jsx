import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import {
  Star,
  GitFork,
  User,
  Search,
  Clock,
  Code2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEditorStore } from "../store/useEditorStore";

const GalleryPage = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { theme } = useEditorStore();
  const isDark = theme === "vs-dark";

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/code"
        );

        const data = await response.json();
        setSnippets(data);
      } catch (error) {
        console.error("Error fetching snippets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredSnippets = useMemo(() => {
    return snippets.filter(
      (snippet) =>
        snippet.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        snippet.author
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [snippets, searchTerm]);

  const tags = [
    "Trending",
    "Recent",
    "HTML",
    "JavaScript",
    "Python",
    "React",
    "Full Stack"
  ];

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? "bg-black text-white"
          : "bg-white text-black"
      }`}
    >
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Community Gallery
            </h1>

            <p className="text-orange-500 mt-2">
              Discover projects shared by developers
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500"
            />

            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none ${
                isDark
                  ? "bg-zinc-900 border-orange-500/20 text-white"
                  : "bg-orange-50 border-orange-200 text-black"
              }`}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-3 overflow-x-auto mb-8 pb-2">
          {tags.map((tag, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium ${
                index === 0
                  ? "bg-orange-500 text-white"
                  : isDark
                  ? "bg-zinc-900 text-gray-300"
                  : "bg-orange-50 text-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredSnippets.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No snippets found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSnippets.map((snippet) => (
              <Link
                key={snippet._id}
                to={`/s/${snippet._id}`}
                className={`rounded-2xl border overflow-hidden shadow-lg hover:scale-[1.02] transition ${
                  isDark
                    ? "bg-zinc-900 border-orange-500/20"
                    : "bg-white border-orange-200"
                }`}
              >
                {/* Top */}
                <div className="p-5 border-b border-orange-500/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">
                        {snippet.title ||
                          "Untitled Project"}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <User size={14} />
                        {snippet.author || "Anonymous"}
                      </div>
                    </div>

                    <div className="px-3 py-1 rounded-lg bg-orange-500 text-white text-xs font-medium">
                      {snippet.language || "web"}
                    </div>
                  </div>

                  {/* Code Preview */}
                  <div
                    className={`h-36 rounded-xl p-4 font-mono text-xs overflow-hidden ${
                      isDark
                        ? "bg-black text-green-400"
                        : "bg-gray-100 text-black"
                    }`}
                  >
                    {typeof snippet.code === "object"
                      ? snippet.code.javascript ||
                        snippet.code.html ||
                        snippet.code.css ||
                        "// No code"
                      : snippet.code || "// No code"}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={14} />
                    {formatDate(snippet.createdAt)}
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-orange-500">
                      <Star size={14} />
                      {snippet.likes || 0}
                    </div>

                    <div className="flex items-center gap-1 text-orange-500">
                      <GitFork size={14} />
                      {snippet.forks || 0}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;