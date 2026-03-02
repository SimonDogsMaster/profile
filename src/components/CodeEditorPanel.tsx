"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type Token = {
  text: string;
  color: string;
};

type CodeLine = Token[];
const codeLines: CodeLine[] = [
  [
    { text: "import", color: "#c792ea" },
    { text: " React", color: "#d6deeb" },
    { text: " from", color: "#c792ea" },
    { text: " ", color: "#d6deeb" },
    { text: "\"react\"", color: "#a5d6ff" }
  ],
  [
    { text: "import", color: "#c792ea" },
    { text: " { ", color: "#d6deeb" },
    { text: "motion", color: "#ff8c8c" },
    { text: " }", color: "#d6deeb" },
    { text: " from", color: "#c792ea" },
    { text: " ", color: "#d6deeb" },
    { text: "\"framer-motion\"", color: "#98d68b" }
  ],
  [],
  [
    { text: "export", color: "#c792ea" },
    { text: " default", color: "#c792ea" },
    { text: " function", color: "#c792ea" },
    { text: " App", color: "#5fb0ff" },
    { text: "()", color: "#d6deeb" },
    { text: " {", color: "#d6deeb" }
  ],
  [
    { text: "  const", color: "#c792ea" },
    { text: " [", color: "#d6deeb" },
    { text: "count", color: "#ff7a7a" },
    { text: ", ", color: "#d6deeb" },
    { text: "setCount", color: "#ff7a7a" },
    { text: "]", color: "#d6deeb" },
    { text: " = ", color: "#d6deeb" },
    { text: "useState", color: "#5fb0ff" },
    { text: "(", color: "#d6deeb" },
    { text: "0", color: "#f6c177" },
    { text: ")", color: "#d6deeb" }
  ],
  [],
  [
    { text: "  return", color: "#c792ea" },
    { text: " (", color: "#d6deeb" }
  ],
  [
    { text: "    <", color: "#d6deeb" },
    { text: "motion.div", color: "#ff7a7a" },
    { text: " ", color: "#d6deeb" },
    { text: "animate", color: "#f6c177" },
    { text: "={{ ", color: "#d6deeb" },
    { text: "scale", color: "#ff7a7a" },
    { text: ": ", color: "#d6deeb" },
    { text: "1.1", color: "#f6c177" },
    { text: " }}>", color: "#d6deeb" }
  ],
  [
    { text: "      <", color: "#d6deeb" },
    { text: "h1", color: "#ff7a7a" },
    { text: ">", color: "#d6deeb" },
    { text: "Hello MilerDev!", color: "#c9d1e7" },
    { text: " <", color: "#d6deeb" },
    { text: "/h1", color: "#ff7a7a" },
    { text: ">", color: "#d6deeb" }
  ],
  [
    { text: "      <", color: "#d6deeb" },
    { text: "button", color: "#ff7a7a" },
    { text: " ", color: "#d6deeb" },
    { text: "onClick", color: "#f6c177" },
    { text: "={() => ", color: "#d6deeb" },
    { text: "setCount", color: "#5fb0ff" },
    { text: "(c => c + ", color: "#d6deeb" },
    { text: "1", color: "#f6c177" },
    { text: ")}>", color: "#d6deeb" }
  ],
  [
    { text: "        Clicked: ", color: "#c9d1e7" },
    { text: "{count}", color: "#ff7a7a" },
    { text: " times", color: "#c9d1e7" }
  ],
  [
    { text: "      <", color: "#d6deeb" },
    { text: "/button", color: "#ff7a7a" },
    { text: ">", color: "#d6deeb" }
  ],
  [
    { text: "    <", color: "#d6deeb" },
    { text: "/motion.div", color: "#ff7a7a" },
    { text: ">", color: "#d6deeb" }
  ],
  [
    { text: "  )", color: "#d6deeb" }
  ],
  [{ text: "}", color: "#d6deeb" }]
];

const tabs = [
  { label: "App.tsx", active: true },
  { label: "api/route.ts", active: false },
  { label: "schema.ts", active: false }
];

const totalCharacters = codeLines.flatMap((line) => line.map((token) => token.text)).join("").length;

function useTypingCode() {
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const typingInterval = window.setInterval(() => {
      setVisibleCharacters((value) => (value >= totalCharacters ? 0 : value + 1));
    }, 48);

    const cursorInterval = window.setInterval(() => {
      setCursorVisible((value) => !value);
    }, 560);

    return () => {
      window.clearInterval(typingInterval);
      window.clearInterval(cursorInterval);
    };
  }, []);

  const computed = useMemo(() => {
    let remaining = visibleCharacters;
    let activeLine = 0;
    let lastVisibleLine = 0;

    const lines = codeLines.map((line, lineIndex) => {
      let hasCursor = false;

      const renderedTokens = line.map((token) => {
        const visibleText = token.text.slice(0, Math.max(0, remaining));
        if (visibleText.length > 0) {
          lastVisibleLine = lineIndex;
        }
        remaining -= visibleText.length;

        if (!hasCursor && visibleText.length < token.text.length) {
          activeLine = lineIndex;
          hasCursor = true;
        }

        return {
          ...token,
          visibleText
        };
      });

      return { renderedTokens, hasCursor };
    });

    if (visibleCharacters >= totalCharacters) {
      activeLine = lastVisibleLine;
    }

    return { lines, activeLine };
  }, [visibleCharacters]);

  return {
    lines: computed.lines,
    activeLine: computed.activeLine,
    cursorVisible
  };
}

export function CodeEditorPanel() {
  const reduceMotion = useReducedMotion();
  const { lines, activeLine, cursorVisible } = useTypingCode();

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 22, scale: 0.98 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.12 }}
      className="pointer-events-none absolute inset-x-4 top-6 z-20 hidden lg:block"
    >
      <div className="overflow-hidden rounded-[34px] border border-white/8 bg-[#090d1d]/92 shadow-[0_40px_120px_rgba(0,0,0,0.34)] backdrop-blur-xl">
        <div className="flex items-center gap-4 border-b border-white/8 bg-[#0d1126]/96 px-7 py-4">
          <div className="flex items-center gap-3">
            <span className="size-3.5 rounded-full bg-[#ff7f67]" />
            <span className="size-3.5 rounded-full bg-[#f2d05e]" />
            <span className="size-3.5 rounded-full bg-[#7bd968]" />
          </div>

          <div className="flex items-end gap-2">
            {tabs.map((tab) => (
              <div
                key={tab.label}
                className={
                  tab.active
                    ? "rounded-t-2xl bg-[#151b38] px-6 py-3 text-[15px] font-medium text-[#dce6ff]"
                    : "px-5 py-3 text-[15px] font-medium text-[#616d8e]"
                }
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[linear-gradient(180deg,rgba(5,14,34,0.96),rgba(3,11,28,0.98))]">
          <div className="grid grid-cols-[72px_1fr] font-mono text-[14px] leading-8 xl:text-[15px] xl:leading-9">
            <div className="border-r border-white/5 bg-white/[0.025] px-4 py-6 text-right text-[#58627f]">
              {lines.map((_, index) => (
                <div key={index}>{index + 1}</div>
              ))}
            </div>

            <div className="px-5 py-6">
              {lines.map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className={lineIndex === activeLine ? "bg-cyan-300/8" : ""}
                >
                  {line.renderedTokens.length === 0 ? (
                    <span>&nbsp;</span>
                  ) : (
                    line.renderedTokens.map((token, tokenIndex) => (
                      <span key={`${lineIndex}-${tokenIndex}`} style={{ color: token.color }}>
                        {token.visibleText}
                      </span>
                    ))
                  )}
                  {lineIndex === activeLine && cursorVisible ? (
                    <span className="ml-0.5 inline-block h-5 w-2.5 translate-y-1 rounded-[2px] bg-cyan-300" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/8 bg-[#0d1126]/96 px-6 py-3 font-mono text-[12px] text-[#7381a8]">
            <span className="text-[#9ddc8a]">Ln 13, Col 6</span>
            <span>TypeScript React UTF-8</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
