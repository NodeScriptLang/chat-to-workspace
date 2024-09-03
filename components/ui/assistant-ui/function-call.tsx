import { makeAssistantToolUI } from "@assistant-ui/react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coyWithoutShadows as syntaxStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DynamicComponentLoader from "./dynamic-component";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../card";

const FunctionCall = makeAssistantToolUI<any, any>({
    toolName: "function_call",
    render: ({ part, status }) => {
        const code = `${part.args.name}\(${Object.keys(part.args.parameters).length > 0 ? JSON.stringify(part.args.parameters) : ''}\)${part.result ? '; ✅' :''}`;
        return <>
            <p style={{ marginBottom: '20px' }}>
                <SyntaxHighlighter
                    language="javascript"
                    style={syntaxStyle}
                    lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
                    wrapLines={true}>
                        {code}
                </SyntaxHighlighter>
                {part.result ? '': <div className="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500 m-6"></div>}
            </p>
            {part.result && part.result?.html ?
                <div style={{ margin: '50px -150px' }}>
                    <div dangerouslySetInnerHTML={{ __html: part.result.html }}></div>
                </div>
                : ''}
            {part.result && part.result.react ? 
                <div style={{ margin: '50px -150px' }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{part.result.title || 'Result'}</CardTitle>
                            <CardDescription>{part.result.description || 'Here is your result'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DynamicComponentLoader sourceCode={part.result.react} />
                        </CardContent>
                    </Card>
                </div>
            :''}
        </>
    },
});

export { FunctionCall };