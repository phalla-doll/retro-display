import { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { X, GripVertical, Trash2, Plus, Clock, ListPlus } from 'lucide-react';

export type PlaylistItem = {
  id: string;
  text: string;
};

export type LoopSettings = {
  enabled: boolean;
  interval: number;
};

interface PlaylistDialogProps {
  onClose: () => void;
  playlist: PlaylistItem[];
  setPlaylist: (items: PlaylistItem[]) => void;
  loopSettings: LoopSettings;
  setLoopSettings: (settings: LoopSettings) => void;
  currentInput: string;
}

export function PlaylistDialog({
  onClose, playlist, setPlaylist, loopSettings, setLoopSettings, currentInput
}: PlaylistDialogProps) {
  const [newItemText, setNewItemText] = useState('');

  const handleAdd = (text: string) => {
    if (!text.trim()) return;
    setPlaylist([...playlist, { id: Math.random().toString(36).substring(2, 9), text: text.toUpperCase() }]);
    setNewItemText('');
  };

  const handleDelete = (id: string) => {
    setPlaylist(playlist.filter(item => item.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/60">
          <h2 className="text-lg font-semibold text-white">Message Playlist</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-6 no-scrollbar">
          
          {/* Loop Settings */}
          <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLoopSettings({ ...loopSettings, enabled: !loopSettings.enabled })}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${loopSettings.enabled ? 'bg-white' : 'bg-zinc-700'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-black transition-transform ${loopSettings.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
              <span className="text-sm font-medium text-zinc-300">Enable Loop</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-zinc-500" />
              <select
                value={loopSettings.interval}
                onChange={(e) => setLoopSettings({ ...loopSettings, interval: Number(e.target.value) })}
                disabled={!loopSettings.enabled}
                className="bg-zinc-800 text-white text-xs px-2 py-1 rounded-md border border-zinc-700 focus:outline-none disabled:opacity-50"
              >
                <option value={5}>5s</option>
                <option value={10}>10s</option>
                <option value={15}>15s</option>
                <option value={30}>30s</option>
                <option value={60}>60s</option>
              </select>
            </div>
          </div>

          {/* Playlist */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Messages</h3>
            {playlist.length === 0 ? (
              <div className="text-center py-8 text-zinc-600 text-sm border border-dashed border-zinc-800 rounded-xl">
                No messages in playlist.
              </div>
            ) : (
              <Reorder.Group axis="y" values={playlist} onReorder={setPlaylist} className="flex flex-col gap-2">
                {playlist.map((item) => (
                  <Reorder.Item key={item.id} value={item} className="flex items-center gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800/60 group cursor-grab active:cursor-grabbing">
                    <GripVertical size={16} className="text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-mono text-zinc-300 truncate">{item.text}</p>
                    </div>
                    <button onClick={() => handleDelete(item.id)} className="text-zinc-600 hover:text-red-400 transition-colors shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </div>

          {/* Add New */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Add Message</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleAdd(currentInput)}
                disabled={!currentInput.trim()}
                className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:hover:bg-zinc-800 text-white text-xs py-2 rounded-lg transition-colors border border-zinc-700"
              >
                <ListPlus size={14} />
                Add Current Editor Message
              </button>
              <div className="relative flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(newItemText); }}
                    placeholder="Or type a new message..."
                    className="w-full bg-zinc-900 text-white text-xs px-3 py-2 rounded-lg border border-zinc-800 focus:outline-none focus:border-zinc-600 font-mono uppercase"
                  />
                </div>
                <button 
                  onClick={() => handleAdd(newItemText)}
                  disabled={!newItemText.trim()}
                  className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white p-2 rounded-lg transition-colors shrink-0"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
