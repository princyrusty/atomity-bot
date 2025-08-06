import React, { useState, useRef } from 'react';
import SendIcon from './icons/SendIcon';
import AttachmentIcon from './icons/AttachmentIcon';

interface ChatInputProps {
  onSend: (message: string, file: File | null) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputValue.trim() || selectedFile) && !isLoading) {
      onSend(inputValue.trim(), selectedFile);
      setInputValue('');
      handleRemoveFile();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-slate-900/80 backdrop-blur-md sticky bottom-0 border-t border-slate-700/50">
      <div className="container mx-auto max-w-4xl">
        {selectedFile && (
            <div className="mb-2 text-sm text-slate-300 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 flex justify-between items-center">
                <span>File: {selectedFile.name}</span>
                <button type="button" onClick={handleRemoveFile} className="text-slate-400 hover:text-slate-200">&times;</button>
            </div>
        )}
        <div className="relative flex items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/jpeg,image/png,image/webp,application/pdf,text/plain"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-cyan-400 disabled:text-slate-600"
            aria-label="Attach file"
          >
            <AttachmentIcon className="w-6 h-6" />
          </button>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? 'Atomity is analyzing...' : 'Enter your query or attach a file...'}
            disabled={isLoading}
            rows={1}
            className="w-full bg-slate-800 text-slate-200 placeholder-slate-500 border border-slate-700 rounded-lg py-3 pl-4 pr-14 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={isLoading || (!inputValue.trim() && !selectedFile)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cyan-600 text-white disabled:bg-slate-700 disabled:text-slate-500 hover:bg-cyan-500 transition-colors duration-200"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
