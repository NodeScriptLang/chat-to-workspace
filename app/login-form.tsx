"use client"

import { useState } from 'react';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/all"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { redirect } from 'next/navigation'
import { useSearchParams } from 'next/navigation';

export function LoginForm() {
    const queryParams = useSearchParams();

    const [workspaceId, setWorkspaceId] = useState(queryParams.get('workspaceId'));
    const [assistantId, setAssistantId] = useState(queryParams.get('assistantId'));
    const [token, setToken] = useState(queryParams.get('token'));

    async function login() {
        const body = { workspaceId, token, assistantId };
        const res = await (await fetch('/api/login', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' }, credentials: 'include' })).json();

        if (res.success) {
            redirect("/")
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-xl">Chat to NodeScript workspace</CardTitle>
                <CardDescription>
                    Enter your workspaceId, assistantId and access token to chat
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="workspaceId">Workspace ID</Label>
                    <Input id="workspaceId" type="text" placeholder="abc_123" required onChange={(e) => setWorkspaceId(e.target.value)} value={workspaceId!} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="assistantId">Assistant ID</Label>
                    <Input id="assistantId" type="text" placeholder="abc_123" required onChange={(e) => setAssistantId(e.target.value)} value={assistantId!} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="token">Access token</Label>
                    <Input id="token" type="password" required onChange={(e) => setToken(e.target.value)} value={token!} />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={login}>Start chatting</Button>
            </CardFooter>
        </Card>
    )
}