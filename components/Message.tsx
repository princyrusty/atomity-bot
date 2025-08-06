import React, { useMemo, Suspense, lazy } from 'react';
import type { Message as MessageType, MapData } from '../types';
import AtomIcon from './icons/AtomIcon';

const MapComponent = lazy(() => import('./MapComponent'));

interface MessageProps {
  message: MessageType;
}

const ThinkingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1.5">
    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
  </div>
);

// Helper function to parse basic markdown and return React nodes
const renderMarkdown = (text: string): React.ReactNode[] => {
    if (!text) return [];
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1 my-2">{listItems}</ul>);
            listItems = [];
        }
    };

    const parseLine = (lineContent: string, key: string): React.ReactNode[] => {
        // Split by **bold** pattern, keeping the delimiters
        const parts = lineContent.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={`${key}-strong-${i}`}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    lines.forEach((line, index) => {
        const key = `line-${index}`;

        if (line.startsWith('## ')) {
            flushList();
            elements.push(<h2 key={key} className="text-xl font-bold mt-4 mb-2">{parseLine(line.substring(3), key)}</h2>);
        } else if (line.startsWith('### ')) {
            flushList();
            elements.push(<h3 key={key} className="text-lg font-semibold mt-3 mb-1">{parseLine(line.substring(4), key)}</h3>);
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
            listItems.push(<li key={key}>{parseLine(line.substring(2), key)}</li>);
        } else if (line.trim() !== '') {
            flushList();
            elements.push(<p key={key}>{parseLine(line, key)}</p>);
        }
    });

    flushList(); // Ensure any trailing list gets rendered

    return elements;
};

const parseMessageWithMap = (text: string) => {
  const mapRegex = /\[MAP_DATA\](\{.*\})/;
  const match = text.match(mapRegex);

  if (!match) {
    return { textBefore: text, mapData: null, textAfter: '' };
  }

  const fullMatch = match[0];
  const jsonString = match[1];
  const parts = text.split(fullMatch);

  try {
    const mapData: MapData = JSON.parse(jsonString);
    return {
      textBefore: parts[0] || '',
      mapData,
      textAfter: parts[1] || ''
    };
  } catch (error) {
    console.error("Failed to parse map data JSON:", error);
    // If JSON is invalid, return the original text to be rendered as-is
    return { textBefore: text, mapData: null, textAfter: '' };
  }
};


const Message: React.FC<MessageProps> = ({ message }) => {
  const isAI = message.sender === 'ai';

  const { textBefore, mapData, textAfter } = useMemo(
    () => (isAI ? parseMessageWithMap(message.text) : { textBefore: message.text, mapData: null, textAfter: '' }),
    [message.text, isAI]
  );
  
  const wrapperClasses = `flex items-start gap-3 w-full ${isAI ? '' : 'flex-row-reverse'}`;
  const bubbleClasses = `max-w-xl lg:max-w-3xl px-5 py-3 rounded-2xl flex flex-col ${
    isAI
      ? 'bg-slate-800 text-slate-200 rounded-tl-none'
      : 'bg-cyan-600/80 text-white rounded-br-none'
  }`;

  return (
    <div className={wrapperClasses}>
      {isAI && (
        <div className="w-8 h-8 flex-shrink-0 bg-slate-700 rounded-full flex items-center justify-center">
          <AtomIcon className="w-5 h-5 text-cyan-400" />
        </div>
      )}
      <div className={`${bubbleClasses} prose prose-sm prose-invert prose-p:my-2 prose-headings:text-slate-100 prose-headings:my-3 prose-strong:text-slate-50`}>
        {message.attachment && message.attachment.type === 'image' && message.attachment.dataUrl && (
          <img src={message.attachment.dataUrl} alt={message.attachment.name} className="mt-1 mb-2 rounded-lg max-h-60 w-auto object-contain self-start" />
        )}
        {message.attachment && message.attachment.type !== 'image' && (
             <div className="text-xs mb-1 p-2 bg-slate-700/50 rounded-md">
                Attached: {message.attachment.name}
            </div>
        )}
        {message.text === '...' ? (
          <ThinkingIndicator />
        ) : isAI ? (
          <>
            <div>{renderMarkdown(textBefore)}</div>
            {mapData && (
              <Suspense fallback={<div className="text-center p-4">Loading Map...</div>}>
                <div className="h-80 w-full my-4 not-prose">
                   <MapComponent mapData={mapData} />
                </div>
              </Suspense>
            )}
            <div>{renderMarkdown(textAfter)}</div>
          </>
        ) : (
          textBefore && <p>{textBefore}</p>
        )}
      </div>
    </div>
  );
};

export default Message;