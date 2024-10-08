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
import { LoginForm } from "./login-form";
import { redirect } from 'next/navigation'
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const loggedIn = Cookies.get('myapp_session');
    if (!loggedIn) {
      redirect('/login');
    }
  });

  return (
    <main className="h-full">
      <Thread />
      <FunctionCall />
    </main>
  );
}
