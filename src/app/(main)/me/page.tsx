"use client";
import { authClient, useSession } from "@/lib/auth-client";

const Me = () => {
  const { data: session } = useSession();

  const handleLogOut = async () => {
    if (session?.user) {
      await authClient.signOut();
    }
  };

  return (
    <div>
      <p>Name: {session?.user.name}</p>
      <p>Email: {session?.user.email}</p>
      <p className="cursor-pointer" onClick={handleLogOut}>
        LogOut
      </p>
    </div>
  );
};

export default Me;
