import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiMessageCircle, FiSend, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

const starterPrompts = [
    'How can I reduce my spending this month?',
    'What looks unusual in my transactions?',
    'What spending category should I review first?',
];

const FinanceAssistant = () => {
    const { isDark } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Ask me about spending patterns, budgets, unusual expenses, or cash flow.',
            status: 'ok',
        },
    ]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const conversationHistory = useMemo(() => {
        return messages
            .filter((entry) => entry.status !== 'error')
            .slice(-8)
            .map((entry) => ({
                role: entry.role,
                content: entry.content,
            }));
    }, [messages]);

    const shellClassName = isDark
        ? 'fixed bottom-6 right-6 z-50 flex h-[min(38rem,calc(100vh-3rem))] w-[calc(100vw-1.5rem)] max-w-[24rem] flex-col overflow-hidden rounded-3xl border border-slate-700 bg-[var(--app-surface)] shadow-2xl shadow-slate-950/40 backdrop-blur-xl'
        : 'fixed bottom-6 right-6 z-50 flex h-[min(38rem,calc(100vh-3rem))] w-[calc(100vw-1.5rem)] max-w-[24rem] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-[var(--app-surface)] shadow-2xl shadow-slate-900/20';

    const headerClassName = isDark
        ? 'flex items-center justify-between border-b border-slate-700 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-4 py-3'
        : 'flex items-center justify-between border-b border-gray-200/80 bg-gradient-to-r from-violet-50 via-white to-cyan-50 px-4 py-3';

    const headerTitleClassName = isDark ? 'text-sm font-semibold text-slate-100' : 'text-sm font-semibold text-gray-900';
    const headerSubtitleClassName = isDark ? 'text-xs text-slate-400' : 'text-xs text-gray-500';
    const closeButtonClassName = isDark
        ? 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white'
        : 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100';

    const assistantBubbleClassName = isDark
        ? 'chat-reply-enter max-w-[85%] rounded-2xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-sm leading-6 text-slate-100'
        : 'chat-reply-enter max-w-[85%] rounded-2xl bg-slate-100 px-4 py-3 text-sm leading-6 text-slate-800';

    const typingBubbleClassName = isDark
        ? 'chat-reply-enter max-w-[85%] rounded-2xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-sm text-slate-300'
        : 'chat-reply-enter max-w-[85%] rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600';

    const suggestionsCardClassName = isDark
        ? 'mb-3 rounded-2xl border border-slate-700 bg-slate-900/80 p-3'
        : 'mb-3 rounded-2xl border border-gray-200 bg-slate-50/80 p-3';

    const suggestionsTitleClassName = isDark ? 'text-xs font-semibold uppercase tracking-[0.16em] text-slate-300' : 'text-xs font-semibold uppercase tracking-[0.16em] text-gray-500';
    const suggestionsSubtitleClassName = isDark ? 'text-xs text-slate-400' : 'text-xs text-gray-500';
    const hideSuggestionsButtonClassName = isDark
        ? 'inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-600 text-slate-300 transition hover:bg-slate-800 hover:text-white'
        : 'inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-white hover:text-gray-800';

    const suggestionButtonClassName = isDark
        ? 'rounded-full border border-slate-600 bg-slate-800 px-3 py-1.5 text-[11px] text-slate-100 shadow-sm transition hover:border-slate-500 hover:bg-slate-700'
        : 'rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] text-gray-700 shadow-sm transition hover:border-primary/30 hover:bg-primary/5';

    const showSuggestionsButtonClassName = isDark
        ? 'inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700'
        : 'inline-flex items-center gap-2 rounded-full border border-gray-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-slate-100';

    const textareaClassName = isDark
        ? 'min-h-[48px] flex-1 resize-none rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-400 focus:border-[var(--app-accent)]'
        : 'min-h-[48px] flex-1 resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-primary';

    const sendButtonClassName = 'inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-purple-600/20 disabled:opacity-60';

    const launchButtonClassName = 'fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-white shadow-lg shadow-purple-600/25 hover:scale-[1.02]';

    const sendMessage = async (text) => {
        const content = String(text || '').trim();

        if (!content || isLoading) {
            return;
        }

        const nextMessages = [...messages, { role: 'user', content }];
        setMessages(nextMessages);
        setMessage('');
        setIsLoading(true);

        try {
            const response = await axiosInstance.post(API_PATHS.AI.CHAT, {
                message: content,
                history: conversationHistory,
            });

            const reply = response?.data?.reply || 'I could not generate a response just now.';

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    role: 'assistant',
                    content: reply,
                    status: 'ok',
                },
            ]);
        } catch (error) {
            console.error('Chat request failed:', error);
            const errorMessage = error.response?.data?.message || 'Unable to reach the finance assistant right now.';
            toast.error(errorMessage);
            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    role: 'assistant',
                    content: errorMessage,
                    status: 'error',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isOpen ? (
                <div className={shellClassName}>
                    <div className={headerClassName}>
                        <div>
                            <p className={headerTitleClassName}>Finance Assistant</p>
                            <p className={headerSubtitleClassName}>Gemini-powered spending advice</p>
                        </div>
                        <button
                            type='button'
                            onClick={() => setIsOpen(false)}
                            className={closeButtonClassName}
                            aria-label='Close assistant'
                        >
                            <FiX />
                        </button>
                    </div>

                    <div className='flex-1 space-y-3 overflow-y-auto px-4 py-4'>
                        {messages.map((entry, index) => (
                            <div
                                key={`${entry.role}-${index}`}
                                className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${entry.role === 'user'
                                        ? 'bg-primary text-white'
                                        : assistantBubbleClassName
                                        }`}
                                >
                                    {entry.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className='flex justify-start'>
                                <div className={typingBubbleClassName}>
                                    <div className='flex items-center gap-2'>
                                        <span className={isDark ? 'font-medium text-slate-100' : 'font-medium text-slate-700'}>Thinking</span>
                                        <span className='flex items-center gap-1' aria-hidden='true'>
                                            <span className='chat-typing-dot' />
                                            <span className='chat-typing-dot' />
                                            <span className='chat-typing-dot' />
                                        </span>
                                    </div>
                                    <p className={isDark ? 'mt-1 text-xs text-slate-400' : 'mt-1 text-xs text-slate-500'}>Analyzing your finances...</p>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className='border-t border-gray-200 px-4 py-3'>
                        {showSuggestions ? (
                            <div className={suggestionsCardClassName}>
                                <div className='mb-2 flex items-center justify-between gap-3'>
                                    <div>
                                        <p className={suggestionsTitleClassName}>
                                            Suggestions
                                        </p>
                                        <p className={suggestionsSubtitleClassName}>Tap one to start a question</p>
                                    </div>
                                    <button
                                        type='button'
                                        onClick={() => setShowSuggestions(false)}
                                        className={hideSuggestionsButtonClassName}
                                        aria-label='Hide suggestions'
                                    >
                                        <FiX />
                                    </button>
                                </div>

                                <div className='flex flex-wrap gap-2'>
                                    {starterPrompts.map((prompt) => (
                                        <button
                                            key={prompt}
                                            type='button'
                                            onClick={() => sendMessage(prompt)}
                                            className={suggestionButtonClassName}
                                            disabled={isLoading}
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className='mb-3 flex justify-end'>
                                <button
                                    type='button'
                                    onClick={() => setShowSuggestions(true)}
                                    className={showSuggestionsButtonClassName}
                                >
                                    <FiMessageCircle />
                                    Show suggestions
                                </button>
                            </div>
                        )}

                        <form
                            className='flex items-end gap-2'
                            onSubmit={(event) => {
                                event.preventDefault();
                                sendMessage(message);
                            }}
                        >
                            <textarea
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                placeholder='Ask about spending, savings, or budgets...'
                                rows={2}
                                className={textareaClassName}
                                disabled={isLoading}
                            />
                            <button
                                type='submit'
                                className={sendButtonClassName}
                                disabled={isLoading || !message.trim()}
                                aria-label='Send message'
                            >
                                <FiSend />
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <button
                    type='button'
                    onClick={() => setIsOpen(true)}
                    className={launchButtonClassName}
                >
                    <FiMessageCircle />
                    Finance AI
                </button>
            )}
        </>
    );
};

export default FinanceAssistant;