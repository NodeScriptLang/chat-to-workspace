'use client';

import Cookies from 'js-cookie';
import { Thread } from "@/components/ui/thread";
import { FunctionCall } from '@/components/ui/assistant-ui/function-call';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Label,
  Input
} from "@/components/ui/all";
import { LoginForm } from "../login-form";


export default function Home() {
  return (
    <main className="h-full">
        <div className="flex items-center justify-center min-h-screen">
            <LoginForm />
        </div>
    </main>
  );
}
