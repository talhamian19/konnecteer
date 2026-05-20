"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfileRedirect() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id) {
      router.replace(`/profile/${session.user.id}`);
    }
  }, [session?.user?.id]);

  return null;
}
