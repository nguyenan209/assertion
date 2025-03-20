import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Welcome, {session.user?.name || session.user?.email}!</h1>
        <form
          action={async () => {
            "use server";
            await signOut({ redirect: true, callbackUrl: "/signin" });
          }}
        >
          <Button type="submit">Sign Out</Button>
        </form>
      </div>
    </div>
  );
}