import OpenAI from 'openai'
import dotenv from 'dotenv'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'
import { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/src/resources/index.js'
import { produtosEmEstoque, produtosEmFalta } from './database'

dotenv.config()
const client = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
})

const schema = z.object({
    produtos: z.array(z.string()),
})

const tools: ChatCompletionTool[] = [
    {
        type: "function",
        function: {
            name: 'produtos_em_estoque',
            description: 'Liste os produtos que estão em estoque.',
            parameters: {
                type: "object",
                properties: {},
                additionalProperties: false,
            },
            strict: true,
        },
    },
    {
        type: "function",
        function: {
            name: 'produtos_em_falta',
            description: "Liste os produtos que estão em falta.",
            parameters: {
                type: "object",
                properties: {},
                additionalProperties: false,
            },
            strict: true,
        },
    }
]


const generateCompletion = async(messages: ChatCompletionMessageParam[], format: any) => {
    const completion = await client.beta.chat.completions.parse({
        model: 'gpt-4o-mini',
        max_completion_tokens: 100,
        response_format: format,
        tools,
        messages,
    })

    if (completion.choices[0].message.refusal) {
        throw new Error("Refusal")
    }

    const { tool_calls } = completion.choices[0].message
    if(tool_calls) {
        const [tool_call] = tool_calls
        const toolsMap = {
            produtos_em_estoque: produtosEmEstoque,
            produtos_em_falta: produtosEmFalta,
        }
        const functionToCall = toolsMap[tool_call.function.name]
        if(!functionToCall){
            throw new Error("Function not found.")
        }
        const result = functionToCall(tool_call.function.parsed_arguments)
        messages.push(completion.choices[0].message)
        messages.push({
            role: 'tool',
            tool_call_id: tool_call.id,
            content: result.toString()
        })
        const completionWithTool = await generateCompletion(messages, zodResponseFormat(schema, 'produtos_schema'))
        return completionWithTool
    }

    return completion
}

export const generateProducts = async (message: string) => {
    const messages: ChatCompletionMessageParam[] = [
        {
            role: 'developer',
            content: 'Liste no máximo 3 produtos que atendam a necessidade do usuário. Considere apenas os produtos em falta.'
        },
        {
            role: 'user',
            content: message,
        },
    ]

    const completion = await generateCompletion(messages, zodResponseFormat(schema, 'produtos_schema'))

    return completion.choices[0].message.parsed
}