"use client";

import Chat from "@/components/Chat";
import Login from "@/components/Login";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Login />
      <Chat />
    </main>
  );
}
