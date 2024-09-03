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


export default function Home() {
  const loggedIn = Cookies.get('myapp_session');
  console.log(loggedIn)
  
  return (
    <main className="h-full">
      {loggedIn ? (
        <>
          <Thread />
          <FunctionCall />
        </>
      ) : (
        <>
          <div className="flex items-center justify-center min-h-screen">
            <LoginForm />
          </div>
        </>
      )}
      <div className="grid-cols-3"></div>
      <div className="grid-cols-4"></div>
      <div className="grid-cols-5"></div>
      <div className="grid-cols-6"></div>
      <div className="grid-cols-7"></div>
    </main>
  );
}
