"use client";

import { useState, useEffect } from "react";
import { getCountdown } from "@/lib/utils";

export function useCountdown(kickoffTime: Date) {
  const [countdown, setCountdown] = useState(getCountdown(kickoffTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(kickoffTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [kickoffTime]);

  return countdown;
}
