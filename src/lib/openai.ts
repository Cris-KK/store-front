// 请在 .env 文件中配置 OPENAI_API_KEY
export async function callOpenAI(messages: { role: string; content: string }[]): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) throw new Error('缺少 OpenAI API Key');

    const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'qwen-plus-2025-04-28',
            messages
        })
    });

    if (!response.ok) {
        throw new Error('OpenAI API 调用失败');
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '客服无回复';
}