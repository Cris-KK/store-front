import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { callOpenAI } from '@/lib/openai';

const CustomerService = () => {
    const { products } = useProducts();
    const { orders } = useOrders();
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { role: 'assistant', content: '您好，我是商城智能客服，请问有什么可以帮您？' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 滚动到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 整理商品和订单数据
    const getSystemPrompt = () => {
        return `
        你是商城的智能客服，请用简洁、专业的语气回答用户问题。
        商城商品数据如下：
        ${JSON.stringify(products, null, 2)}
        当前用户历史订单如下：
        ${JSON.stringify(orders, null, 2)}
    `.trim();
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        // 组装消息
        const systemPrompt = getSystemPrompt();
        const conversation = [
            { role: 'system', content: systemPrompt },
            ...messages,
            userMessage
        ];

        // 调用大模型
        setMessages(prev => [...prev, { role: 'assistant', content: '正在思考中...' }]);
        try {
            console.log('发送给大模型的消息:', conversation);
            const reply = await callOpenAI(conversation);
            console.log('大模型回复:', reply);
            setMessages(prev => [
                ...prev.slice(0, -1),
                { role: 'assistant', content: reply }
            ]);
        } catch (e) {
            console.error('客服AI接口调用失败:', e);
            setMessages(prev => [
                ...prev.slice(0, -1),
                { role: 'assistant', content: '抱歉，客服暂时无法回复，请稍后再试。' }
            ]);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-16 w-full max-w-md mx-auto flex flex-col">
            <Header />
            <div className="pt-14 flex-1 flex flex-col overflow-hidden">
                <Card className="flex-1 flex flex-col p-2 overflow-y-auto bg-white">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex mb-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] px-3 py-2 rounded-lg text-sm whitespace-pre-line
                  ${msg.role === 'user'
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </Card>
                <div className="flex items-center p-2 bg-white border-t">
                    <Input
                        className="flex-1 mr-2"
                        placeholder="请输入您的问题…"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                    />
                    <Button onClick={handleSend} disabled={!input.trim()}>
                        发送
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomerService;