import React, { useMemo, useState } from 'react';
import { FiMessageCircle, FiSend, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';

const starterPrompts = [
    'How can I reduce my spending this month?',
    'What looks unusual in my transactions?',
    'Give me a simple budget recommendation.',
];

const FinanceAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Ask me about spending patterns, budgets, unusual expenses, or cash flow.',
        },
    ]);

    const conversationHistory = useMemo(() => {
        return messages.map((entry) => ({
            role: entry.role,
            content: entry.content,
        }));
    }, [messages]);

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

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    role: 'assistant',
                    content: response.data?.reply || 'I could not generate a response just now.',
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
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isOpen ? (
                <div className='fixed bottom-6 right-6 z-50 w-[calc(100vw-1.5rem)] max-w-[24rem] overflow-hidden rounded-3xl border border-gray-200 bg-[var(--app-surface)] shadow-2xl shadow-slate-900/20'>
                    <div className='flex items-center justify-between border-b border-gray-200 px-4 py-3'>
                        <div>
                            <p className='text-sm font-semibold text-gray-900'>Finance Assistant</p>
                            <p className='text-xs text-gray-500'>Gemini-powered spending advice</p>
                        </div>
                        <button
                            type='button'
                            onClick={() => setIsOpen(false)}
                            className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100'
                            aria-label='Close assistant'
                        >
                            <FiX />
                        </button>
                    </div>

                    <div className='max-h-[24rem] space-y-3 overflow-y-auto px-4 py-4'>
                        {messages.map((entry, index) => (
                            <div
                                key={`${entry.role}-${index}`}
                                className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${entry.role === 'user'
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-100 text-slate-800'
                                        }`}
                                >
                                    {entry.content}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className='flex justify-start'>
                                <div className='max-w-[85%] rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600'>
                                    Analyzing your finances...
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='border-t border-gray-200 px-4 py-3'>
                        <div className='mb-3 flex flex-wrap gap-2'>
                            {starterPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    type='button'
                                    onClick={() => sendMessage(prompt)}
                                    className='rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-[11px] text-gray-700 hover:bg-gray-100'
                                    disabled={isLoading}
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>

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
                                className='min-h-[48px] flex-1 resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary'
                                disabled={isLoading}
                            />
                            <button
                                type='submit'
                                className='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white disabled:opacity-60'
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
                    className='fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-medium text-white shadow-lg shadow-purple-600/25 hover:scale-[1.02]'
                >
                    <FiMessageCircle />
                    Finance AI
                </button>
            )}
        </>
    );
};

export default FinanceAssistant;