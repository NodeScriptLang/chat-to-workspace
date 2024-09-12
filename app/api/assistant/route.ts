import { NextRequest, NextResponse } from "next/server";
import { AssistantResponse } from "ai";
import OpenAI from "openai";
import fetch from 'node-fetch';
import { getSession } from "@/lib/session";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "NO_KEY",
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
    // Parse the request body
    const input: {
        threadId: string | null;
        message: string;
    } = await req.json();

    // Create a thread if needed
    const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

    const session = await getSession(req, new NextResponse());

    // Add a message to the thread
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: input.message,
    });

    return AssistantResponse(
        { threadId, messageId: createdMessage.id },
        async ({ forwardStream, sendDataMessage }) => {
            // Run the assistant on the thread
            const runStream = openai.beta.threads.runs.stream(threadId, {
                assistant_id:
                    session.assistantId ??
                    (() => {
                        throw new Error("ASSISTANT_ID is not set");
                    })(),
            });

            // forward run status would stream message deltas
            let runResult = await forwardStream(runStream);

            // status can be: queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired
            while (
                runResult?.status === "requires_action" &&
                runResult.required_action?.type === "submit_tool_outputs"
            ) {
                const tool_outputs = await Promise.all(
                    runResult.required_action.submit_tool_outputs.tool_calls.map(
                        async (toolCall: any) => {
                            const parameters = JSON.parse(toolCall.function.arguments);

                            const url = 'https://yofg6hd6.run.nodescript.dev/lib/execute-module';
                            const body = {
                                name: toolCall.function.name,
                                params: parameters,
                                workspaceId: session.workspaceId,
                                token: session.token
                            };

                            sendDataMessage({
                                role: "data",
                                data: {
                                    type: "tool-call",
                                    toolCallId: toolCall.id,
                                    toolName: "function_call",
                                    args: { parameters, name: toolCall.function.name }
                                },
                            })

                            const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
                            let text = await res.text();

                            let textOrJson:any = text;

                            try {
                                textOrJson = JSON.parse(text);
                            } catch {}
                            
                            const hasHtml = !! (textOrJson.html || textOrJson.react);

                            if (hasHtml) {
                                text = `HTML was displayed to the user. No need to respond. The HTML was ${textOrJson.html || textOrJson.react}`;
                            }

                            sendDataMessage({
                                role: "data",
                                data: {
                                    type: "tool-result",
                                    toolCallId: toolCall.id,
                                    result: textOrJson
                                },
                            });
                            
                            return {
                                tool_call_id: toolCall.id,
                                output: text
                            };
                        },
                    )
                );

                runResult = await forwardStream(
                    openai.beta.threads.runs.submitToolOutputsStream(
                        threadId,
                        runResult.id,
                        { tool_outputs },
                    ),
                );
            }
        },
    );
}