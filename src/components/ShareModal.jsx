import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUiStore } from '../store/useUiStore';
import { useEditorStore } from '../store/useEditorStore';
import { X, Copy, Check, Link as LinkIcon, Globe, Lock } from 'lucide-react';

const ShareModal = () => {
  const { isShareModalOpen, setShareModalOpen, addToast } = useUiStore();
  const { shareSnippet, snippetId } = useEditorStore();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareData, setShareData] = useState(null);

  const handleShare = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const id = shareSnippet();
      setShareData({
        url: `notecode.app/s/${id}`,
        id
      });
      addToast('Snippet shared successfully!', 'success');
      setLoading(false);
    }, 800);
  };

  const copyToClipboard = () => {
    if (!shareData) return;
    navigator.clipboard.writeText(shareData.url);
    setCopied(true);
    addToast('Link copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isShareModalOpen && (
        <React.Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShareModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 glass-panel border border-glassBorder shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-glassBorder">
               <h2 className="text-xl font-semibold text-white">Share Snippet</h2>
               <button 
                 onClick={() => setShareModalOpen(false)}
                 className="p-1 rounded-md text-mutedForeground hover:bg-white/10 hover:text-white transition-colors"
               >
                 <X size={20} />
               </button>
            </div>
            
            <div className="p-6 space-y-6">
              {!shareData ? (
                <>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-sm font-medium text-mutedForeground">Visibility</label>
                       <div className="grid grid-cols-2 gap-3">
                         <button className="flex flex-col items-center gap-2 p-3 rounded-lg border border-primary bg-primary/10 text-white transition-all">
                           <Globe size={20} className="text-primary" />
                           <span className="text-sm">Public</span>
                         </button>
                         <button className="flex flex-col items-center gap-2 p-3 rounded-lg border border-glassBorder bg-secondary/30 text-mutedForeground hover:bg-secondary/50 transition-all">
                           <Lock size={20} />
                           <span className="text-sm">Unlisted</span>
                         </button>
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-mutedForeground">Expires In</label>
                      <select className="w-full bg-secondary/50 border border-glassBorder rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors">
                        <option value="never">Never</option>
                        <option value="1h">1 Hour</option>
                        <option value="24h">24 Hours</option>
                        <option value="7d">7 Days</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={handleShare}
                    disabled={loading}
                    className="w-full py-2.5 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-lg font-medium shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    ) : (
                      <>
                        <LinkIcon size={18} />
                        Generate Link
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 scale-in-center">
                    <Check size={32} />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium text-white">Snippet Shared Successfully!</h3>
                    <p className="text-sm text-mutedForeground">Your unique link is ready to be shared with the world.</p>
                  </div>
                  
                  <div className="flex items-center gap-2 p-1.5 bg-black/40 rounded-lg border border-glassBorder">
                    <div className="px-3 text-sm text-mutedForeground truncate flex-1 font-mono">
                      {shareData.url}
                    </div>
                    <button 
                      onClick={copyToClipboard}
                      className="flex items-center gap-1.5 px-3 py-2 bg-secondary rounded-md text-sm text-white hover:bg-secondary/80 transition-colors shrink-0"
                    >
                      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
