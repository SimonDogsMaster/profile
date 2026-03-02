"use client";

import { useEffect, useState } from "react";

type ScrollRigState = {
  progress: number;
  offset: number;
};

export function useScrollRig(): ScrollRigState {
  const [state, setState] = useState<ScrollRigState>({ progress: 0, offset: 0 });

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(scrollTop / maxScroll, 1);
      const offset = Math.min(scrollTop / Math.max(window.innerHeight, 1), 1.2);
      setState({ progress, offset });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return state;
}
