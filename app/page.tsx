"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Vault() {
  const { data: session } = useSession();
  if (!session)
    return <button onClick={() => signIn()}>Sign in to Access Vault</button>;

  return (
    <div className="p-4">
      <h1>Welcome, {session.user?.name}</h1>
      <p>Your documents will appear here</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
