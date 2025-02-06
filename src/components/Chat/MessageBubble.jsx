import React from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MessageBubble = ({ message, isUser }) => {
  const formattedTime = format(new Date(message.timestamp), 'h:mm a');

  // Custom renderer for code blocks
  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={atomDark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  const renderContent = () => {
    if (message.isError) {
      return (
        <div className="flex items-center text-red-500">
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="font-medium">{message.text}</span>
        </div>
      );
    }

    return (
      <>
        {message.files && message.files.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {message.files.map((file, index) => (
              <div
                key={index}
                className={`group flex items-center gap-2 rounded-lg p-2 transition-all hover:scale-[1.02] ${
                  isUser
                    ? 'bg-white/10 hover:bg-white/20'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className={`rounded-lg p-2 ${
                  isUser ? 'bg-white/10' : 'bg-white'
                }`}>
                  {file.type?.startsWith('image/') ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs opacity-60">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button className="ml-2 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              code: CodeBlock,
              p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
              a: ({ children, href }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline-offset-4 hover:underline ${
                    isUser ? 'text-white/90 hover:text-white' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  {children}
                </a>
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
      </>
    );
  };

  return (
    <div className={`group mb-6 flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-75 blur-sm"></div>
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-75 blur-sm"></div>
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`group relative flex max-w-[85%] flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Name */}
        <div className={`text-sm font-medium mb-1 ${isUser ? 'text-purple-600' : 'text-blue-600'}`}>
          {isUser ? 'You' : 'Vita AI'}
        </div>
        
        {/* Message Bubble */}
        <div
          className={`relative rounded-2xl px-4 py-2 shadow-sm ${
            isUser
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
              : 'bg-white border border-gray-200'
          }`}
        >
          {/* Message Tail */}
          <div
            className={`absolute top-4 ${
              isUser ? '-right-2' : '-left-2'
            } h-4 w-4 transform ${
              isUser 
                ? 'rotate-45 bg-gradient-to-br from-purple-500 to-pink-500' 
                : 'rotate-45 bg-white border border-gray-200'
            }`}
          />
          
          {renderContent()}
        </div>

        {/* Message Metadata */}
        <div
          className={`flex items-center gap-2 px-1 text-xs ${
            isUser ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <span className="text-gray-400">{formattedTime}</span>
          {isUser && (
            <div className="flex items-center gap-0.5">
              <svg
                className={`h-4 w-4 ${message.seen ? 'text-purple-500' : 'text-gray-400'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {message.seen && (
                <svg
                  className="h-4 w-4 -ml-3 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
