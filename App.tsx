import React, { useState, useEffect, useRef } from 'react';
import type { Message, AttachmentType } from './types';
import { streamChatResponse, FileInput } from './services/geminiService';
import Header from './components/Header';
import MessageComponent from './components/Message';
import ChatInput from './components/ChatInput';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;

// Helper functions for file processing
async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = (reader.result as string).split(',')[1];
            resolve(result);
        };
        reader.onerror = error => reject(error);
    });
}

async function extractTextFromPdf(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let textContent = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map(s => (s as any).str).join(' ') + '\n';
    }
    return textContent;
}


const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      sender: 'ai',
      text: 'Greetings, Officer. I am ATOMITY. Present your query, case file, or image for analysis. My operations are optimized for India.',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string, file: File | null) => {
    setIsLoading(true);

    let userMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: text,
    };
    
    let fileInput: FileInput | null = null;
    let promptText = text;

    if (file) {
        const attachmentType: AttachmentType = file.type.startsWith('image/') ? 'image' : (file.type === 'application/pdf' ? 'pdf' : 'text');
        userMessage.attachment = {
            name: file.name,
            type: attachmentType,
            dataUrl: attachmentType === 'image' ? URL.createObjectURL(file) : undefined
        };

        if (attachmentType === 'image') {
            const base64Data = await fileToBase64(file);
            fileInput = { mimeType: file.type, data: base64Data };
            if(!promptText) promptText = "Analyze this image.";
        } else if (attachmentType === 'pdf') {
            const pdfText = await extractTextFromPdf(file);
            promptText = `Based on the following document content, please respond to my query.\n\nDOCUMENT CONTENT:\n---\n${pdfText}\n---\n\nQUERY: ${text || 'Summarize this document and identify key entities.'}`;
            // PDF text is embedded in the prompt, not sent as a separate file part
        } else { // plain text
             const textContent = await file.text();
             promptText = `Based on the following document content, please respond to my query.\n\nDOCUMENT CONTENT:\n---\n${textContent}\n---\n\nQUERY: ${text || 'Summarize this document and identify key entities.'}`;
        }
    }

    const aiPlaceholderMessage: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: '...' };

    setMessages(prev => [...prev, userMessage, aiPlaceholderMessage]);

    let fullResponse = '';
    streamChatResponse(
      promptText,
      fileInput, // only images are passed directly as files
      (chunk) => {
        fullResponse += chunk;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === aiPlaceholderMessage.id ? { ...msg, text: fullResponse } : msg
          )
        );
      },
      () => {
        setIsLoading(false);
        if(userMessage.attachment?.dataUrl) {
            URL.revokeObjectURL(userMessage.attachment.dataUrl);
        }
      },
      (error) => {
        setMessages(prev =>
            prev.map(msg =>
              msg.id === aiPlaceholderMessage.id ? { ...msg, text: `Error: ${error.message}` } : msg
            )
          );
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col h-screen font-sans text-slate-300">
      <Header />
      <main className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-4xl space-y-6">
          {messages.map((msg) => (
            <MessageComponent key={msg.id} message={msg} />
          ))}
          <div ref={chatEndRef} />
        </div>
      </main>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default App;