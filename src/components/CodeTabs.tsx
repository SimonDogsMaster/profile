"use client";

import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type Token = {
  text: string;
  color: string;
};

type CodeLine = Token[];

type CodeFile = {
  cadence: {
    base: number;
    lineStart: number;
    lineEnd: number;
    punctuation: number;
    reset: number;
    closing: number;
  };
  footer: string;
  label: string;
  lines: CodeLine[];
  statusMeta?: string;
};

type RenderedLine = {
  renderedTokens: Array<Token & { visibleText: string }>;
};

const files: CodeFile[] = [
  {
    cadence: {
      base: 28,
      lineStart: 170,
      lineEnd: 220,
      punctuation: 70,
      reset: 1250,
      closing: 110,
    },
    label: "App.tsx",
    footer: "TypeScript React UTF-8",
    statusMeta: "Spaces: 2",
    lines: [
      [
        { text: "import", color: "#c792ea" },
        { text: " React", color: "#d6deeb" },
        { text: " from", color: "#c792ea" },
        { text: " ", color: "#d6deeb" },
        { text: '"react"', color: "#a5d6ff" },
      ],
      [
        { text: "import", color: "#c792ea" },
        { text: " { ", color: "#d6deeb" },
        { text: "motion", color: "#ff8c8c" },
        { text: " }", color: "#d6deeb" },
        { text: " from", color: "#c792ea" },
        { text: " ", color: "#d6deeb" },
        { text: '"framer-motion"', color: "#98d68b" },
      ],
      [],
      [
        { text: "export", color: "#c792ea" },
        { text: " default", color: "#c792ea" },
        { text: " function", color: "#c792ea" },
        { text: " App", color: "#5fb0ff" },
        { text: "()", color: "#d6deeb" },
        { text: " {", color: "#d6deeb" },
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
        { text: ")", color: "#d6deeb" },
      ],
      [
        { text: "  return", color: "#c792ea" },
        { text: " (", color: "#d6deeb" },
      ],
      [
        { text: "    <", color: "#d6deeb" },
        { text: "motion.div", color: "#ff7a7a" },
        { text: " animate", color: "#f6c177" },
        { text: "={{ ", color: "#d6deeb" },
        { text: "scale", color: "#ff7a7a" },
        { text: ": ", color: "#d6deeb" },
        { text: "1.1", color: "#f6c177" },
        { text: " }}>", color: "#d6deeb" },
      ],
      [
        { text: "      <", color: "#d6deeb" },
        { text: "h1", color: "#ff7a7a" },
        { text: ">", color: "#d6deeb" },
        { text: "Simon ships calm, high-fidelity UI.", color: "#c9d1e7" },
        { text: " <", color: "#d6deeb" },
        { text: "/h1", color: "#ff7a7a" },
        { text: ">", color: "#d6deeb" },
      ],
      [
        { text: "      <", color: "#d6deeb" },
        { text: "p", color: "#ff7a7a" },
        { text: ">", color: "#d6deeb" },
        { text: "Front-end systems from Bangkok.", color: "#8fa1c7" },
        { text: " <", color: "#d6deeb" },
        { text: "/p", color: "#ff7a7a" },
        { text: ">", color: "#d6deeb" },
      ],
      [
        { text: "      <", color: "#d6deeb" },
        { text: "button", color: "#ff7a7a" },
        { text: "onClick", color: "#f6c177" },
        { text: "={() => ", color: "#d6deeb" },
        { text: "setCount", color: "#5fb0ff" },
        { text: "((c) => c + ", color: "#d6deeb" },
        { text: "1", color: "#f6c177" },
        { text: ")}>", color: "#d6deeb" },
      ],
      [
        { text: "        Clicked: ", color: "#c9d1e7" },
        { text: "{count}", color: "#ff7a7a" },
        { text: " shipped flows", color: "#c9d1e7" },
      ],
      [
        { text: "      <", color: "#d6deeb" },
        { text: "/button", color: "#ff7a7a" },
        { text: ">", color: "#d6deeb" },
      ],
      [
        { text: "    <", color: "#d6deeb" },
        { text: "/motion.div", color: "#ff7a7a" },
        { text: ">", color: "#d6deeb" },
      ],
      [{ text: "  )", color: "#d6deeb" }],
      [{ text: "}", color: "#d6deeb" }],
    ],
  },
  {
    cadence: {
      base: 22,
      lineStart: 135,
      lineEnd: 185,
      punctuation: 62,
      reset: 950,
      closing: 92,
    },
    label: "api/route.ts",
    footer: "Route Handler JSON",
    statusMeta: "Spaces: 2",
    lines: [
      [
        { text: "import", color: "#c792ea" },
        { text: " { ", color: "#d6deeb" },
        { text: "NextResponse", color: "#5fb0ff" },
        { text: " }", color: "#d6deeb" },
        { text: " from", color: "#c792ea" },
        { text: " ", color: "#d6deeb" },
        { text: '"next/server"', color: "#98d68b" },
      ],
      [],
      [
        { text: "export", color: "#c792ea" },
        { text: " async", color: "#c792ea" },
        { text: " function", color: "#c792ea" },
        { text: " GET", color: "#5fb0ff" },
        { text: "()", color: "#d6deeb" },
        { text: " {", color: "#d6deeb" },
      ],
      [
        { text: "  return", color: "#c792ea" },
        { text: " ", color: "#d6deeb" },
        { text: "NextResponse", color: "#5fb0ff" },
        { text: ".", color: "#d6deeb" },
        { text: "json", color: "#f6c177" },
        { text: "({", color: "#d6deeb" },
      ],
      [
        { text: "    name", color: "#ff7a7a" },
        { text: ": ", color: "#d6deeb" },
        { text: '"Simon"', color: "#98d68b" },
        { text: ",", color: "#d6deeb" },
      ],
      [
        { text: "    status", color: "#ff7a7a" },
        { text: ": ", color: "#d6deeb" },
        { text: '"online"', color: "#98d68b" },
        { text: ",", color: "#d6deeb" },
      ],
      [
        { text: "    uptime", color: "#ff7a7a" },
        { text: ": ", color: "#d6deeb" },
        { text: "99.98", color: "#f6c177" },
        { text: ",", color: "#d6deeb" },
      ],
      [
        { text: "    region", color: "#ff7a7a" },
        { text: ": ", color: "#d6deeb" },
        { text: '"bkk1"', color: "#98d68b" },
        { text: ",", color: "#d6deeb" },
      ],
      [
        { text: "    focus", color: "#ff7a7a" },
        { text: ": ", color: "#d6deeb" },
        { text: '"frontend + motion"', color: "#98d68b" },
      ],
      [{ text: "  });", color: "#d6deeb" }],
      [{ text: "}", color: "#d6deeb" }],
      [],
      [],
      [],
    ],
  },
  {
    cadence: {
      base: 36,
      lineStart: 210,
      lineEnd: 260,
      punctuation: 86,
      reset: 1450,
      closing: 130,
    },
    label: "schema.ts",
    footer: "Schema Definition TS",
    statusMeta: "Spaces: 2",
    lines: [
      [
        { text: "import", color: "#c792ea" },
        { text: " { ", color: "#d6deeb" },
        { text: "z", color: "#5fb0ff" },
        { text: " }", color: "#d6deeb" },
        { text: " from", color: "#c792ea" },
        { text: " ", color: "#d6deeb" },
        { text: '"zod"', color: "#98d68b" },
      ],
      [],
      [
        { text: "export", color: "#c792ea" },
        { text: " const", color: "#c792ea" },
        { text: " projectSchema", color: "#5fb0ff" },
        { text: " = ", color: "#d6deeb" },
        { text: "z", color: "#5fb0ff" },
        { text: ".", color: "#d6deeb" },
        { text: "object", color: "#f6c177" },
        { text: "({", color: "#d6deeb" },
      ],
      [
        { text: "  title", color: "#ff7a7a" },
        { text: ": ", color: "#d6deeb" },
        { text: "z", color: "#5fb0ff" },
        { text: ".", color: "#d6deeb" },
        { text: "string", color: "#f6c177" },
        { text: "()", color: "#d6deeb" },
        { text: ".", color: "#d6deeb" },
        { text: "min", color: "#f6c177" },
        { text: "(", color: "#d6deeb" },
        { text: "2", color: "#f6c177" },
        { text: "),", color: "#d6deeb" },
      ],
      [
        { text: "  slug", color: "#ff7a7a" },
        { text: ": ", color: "#d6deeb" },
        { text: "z", color: "#5fb0ff" },
        { text: ".", color: "#d6deeb" },
        { text: "string", color: "#f6c177" },
        { text: "()", color: "#d6deeb" },
        { text: ".", color: "#d6deeb" },
        { text: "regex", color: "#f6c177" },
        { text: "(", color: "#d6deeb" },
        { text: "/^[a-z-]+$/", color: "#98d68b" },
        { text: ")", color: "#d6deeb" },
      ],
      [
        { text: "  featured", color: "#ff7a7a" },
        { text: ": ", color: "#d6deeb" },
        { text: "z", color: "#5fb0ff" },
        { text: ".", color: "#d6deeb" },
        { text: "boolean", color: "#f6c177" },
        { text: "()", color: "#d6deeb" },
        { text: ".", color: "#d6deeb" },
        { text: "default", color: "#f6c177" },
        { text: "(", color: "#d6deeb" },
        { text: "false", color: "#f6c177" },
        { text: ")", color: "#d6deeb" },
      ],
      [
        { text: "  theme", color: "#ff7a7a" },
        { text: ": ", color: "#d6deeb" },
        { text: "z", color: "#5fb0ff" },
        { text: ".", color: "#d6deeb" },
        { text: "enum", color: "#f6c177" },
        { text: "([", color: "#d6deeb" },
        { text: '"dark"', color: "#98d68b" },
        { text: ", ", color: "#d6deeb" },
        { text: '"light"', color: "#98d68b" },
        { text: "])", color: "#d6deeb" },
      ],
      [{ text: "});", color: "#d6deeb" }],
      [],
      [],
      [],
    ],
  },
];

const EDITOR_ROWS = Math.max(...files.map((file) => file.lines.length));

function useTypingCode(file: CodeFile, forceTypingInReducedMotion: boolean) {
  const reduceMotion = useReducedMotion();
  const reduceTypingMotion = reduceMotion && !forceTypingInReducedMotion;
  const linesSource = file.lines;
  const totalCharacters = useMemo(
    () =>
      linesSource.flatMap((line) => line.map((token) => token.text)).join("")
        .length,
    [linesSource],
  );
  const [visibleCharacters, setVisibleCharacters] = useState(
    reduceTypingMotion ? totalCharacters : 0,
  );
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    setVisibleCharacters(reduceTypingMotion ? totalCharacters : 0);
    setCursorVisible(true);
  }, [linesSource, reduceTypingMotion, totalCharacters]);

  useEffect(() => {
    if (reduceTypingMotion) {
      return;
    }

    const cursorInterval = window.setInterval(() => {
      setCursorVisible((value) => !value);
    }, 560);

    const lineLengths = linesSource.map((line) =>
      line.reduce((sum, token) => sum + token.text.length, 0),
    );
    let runningTotal = 0;
    let currentLineIndex = 0;

    for (let index = 0; index < lineLengths.length; index += 1) {
      runningTotal += lineLengths[index];
      if (visibleCharacters < runningTotal) {
        currentLineIndex = index;
        break;
      }
      currentLineIndex = index;
    }

    const previousLinesTotal =
      currentLineIndex === 0
        ? 0
        : lineLengths
            .slice(0, currentLineIndex)
            .reduce((sum, length) => sum + length, 0);
    const columnWithinLine = Math.max(
      0,
      visibleCharacters - previousLinesTotal,
    );
    const currentLineChars =
      linesSource[currentLineIndex]?.flatMap((token) => token.text.split("")) ??
      [];
    const nextChar =
      currentLineChars[
        Math.min(columnWithinLine, Math.max(currentLineChars.length - 1, 0))
      ];

    let delay = file.cadence.base;

    if (visibleCharacters >= totalCharacters) {
      return () => {
        window.clearInterval(cursorInterval);
      };
    } else if (columnWithinLine === 0) {
      delay = file.cadence.lineStart;
    } else if (columnWithinLine >= currentLineChars.length) {
      delay = file.cadence.lineEnd;
    } else if (nextChar && [")", "}", "]"].includes(nextChar)) {
      delay = file.cadence.closing;
    } else if (nextChar && [",", ":"].includes(nextChar)) {
      delay = file.cadence.punctuation;
    }

    const typingTimeout = window.setTimeout(() => {
      setVisibleCharacters((value) => Math.min(value + 1, totalCharacters));
    }, delay);

    return () => {
      window.clearTimeout(typingTimeout);
      window.clearInterval(cursorInterval);
    };
  }, [
    file.cadence.base,
    file.cadence.closing,
    file.cadence.lineEnd,
    file.cadence.lineStart,
    file.cadence.punctuation,
    file.cadence.reset,
    linesSource,
    reduceTypingMotion,
    totalCharacters,
    visibleCharacters,
  ]);

  const computed = useMemo(() => {
    let remaining = visibleCharacters;

    const lineLengths = linesSource.map((line) =>
      line.reduce((sum, token) => sum + token.text.length, 0),
    );

    let activeLine = 0;
    let cursorColumn = 1;
    let consumedBeforeLine = 0;

    for (let index = 0; index < lineLengths.length; index += 1) {
      const lineLength = lineLengths[index];
      const consumedIncludingLine = consumedBeforeLine + lineLength;

      if (visibleCharacters <= consumedIncludingLine) {
        activeLine = index;
        cursorColumn = Math.max(1, visibleCharacters - consumedBeforeLine + 1);
        break;
      }

      consumedBeforeLine = consumedIncludingLine;
      activeLine = index;
      cursorColumn = lineLength + 1;
    }

    if (visibleCharacters >= totalCharacters) {
      activeLine = Math.max(lineLengths.length - 1, 0);
      cursorColumn = (lineLengths[activeLine] ?? 0) + 1;
    }

    const lines: RenderedLine[] = linesSource.map((line) => {
      const renderedTokens = line.map((token) => {
        const visibleText = token.text.slice(0, Math.max(0, remaining));
        remaining -= visibleText.length;

        return { ...token, visibleText };
      });

      return { renderedTokens };
    });

    while (lines.length < EDITOR_ROWS) {
      lines.push({ renderedTokens: [] });
    }

    return { activeLine, cursorColumn, lines };
  }, [linesSource, totalCharacters, visibleCharacters]);

  return {
    activeLine: computed.activeLine,
    cursorColumn: computed.cursorColumn,
    cursorVisible,
    isComplete: visibleCharacters >= totalCharacters,
    lines: computed.lines,
  };
}

export function CodeTabs() {
  const reduceMotion = useReducedMotion();
  const [forceTypingInReducedMotion, setForceTypingInReducedMotion] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const activeFile = files[activeTab];
  const reduceTypingMotion = reduceMotion && !forceTypingInReducedMotion;
  const { activeLine, cursorColumn, cursorVisible, isComplete, lines } =
    useTypingCode(activeFile, forceTypingInReducedMotion);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const isWindows = /\bWindows\b/i.test(ua);
    const isChrome = /\bChrome\/\d+/i.test(ua);
    const isOtherChromium = /\bEdg\/|\bOPR\/|\bBrave\//i.test(ua);
    setForceTypingInReducedMotion(isWindows && isChrome && !isOtherChromium);
  }, []);

  useEffect(() => {
    if (reduceTypingMotion || !isComplete) {
      return;
    }

    const switchTimeout = window.setTimeout(() => {
      setActiveTab((value) => (value + 1) % files.length);
    }, activeFile.cadence.reset);

    return () => {
      window.clearTimeout(switchTimeout);
    };
  }, [activeFile.cadence.reset, isComplete, reduceTypingMotion]);

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 1, y: 18, scale: 0.985 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
      className="relative z-20 mx-auto w-full max-w-[92vw] sm:max-w-[88vw] xl:max-w-[720px] 2xl:max-w-[780px]"
    >
      <div className="overflow-hidden rounded-[24px] border border-white/8 bg-[#0a0f21]/90 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:rounded-[30px] sm:shadow-[0_32px_110px_rgba(0,0,0,0.32)]">
        <div className="flex items-center gap-2 border-b border-white/8 bg-[#0d1328]/96 px-3 py-3 sm:gap-3 sm:px-6">
          <div className="mr-1 flex items-center gap-2 sm:mr-2">
            <span className="size-3 rounded-full bg-[#ff7f67]" />
            <span className="size-3 rounded-full bg-[#f2d05e]" />
            <span className="size-3 rounded-full bg-[#7bd968]" />
          </div>

          <LayoutGroup id="hero-code-tabs">
            <div className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max items-center gap-1 pr-1 sm:w-auto sm:pr-0">
                {files.map((file, index) => {
                  const active = index === activeTab;

                  return (
                    <button
                      key={file.label}
                      type="button"
                      onClick={() => setActiveTab(index)}
                      className="group relative shrink-0 whitespace-nowrap rounded-t-xl px-3 py-2 text-[13px] font-medium text-[#6f7b9f] transition duration-200 hover:text-[#dbe6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 sm:rounded-t-2xl sm:px-5 sm:py-2.5 sm:text-sm"
                    >
                      {active ? (
                        <motion.span
                          layoutId="active-code-tab"
                          className="absolute inset-0 rounded-t-xl border border-b-0 border-cyan-300/18 bg-[#182042] sm:rounded-t-2xl"
                          transition={{
                            type: "spring",
                            stiffness: 360,
                            damping: 30,
                          }}
                        />
                      ) : null}
                      {!active ? (
                        <span className="absolute inset-x-2 bottom-0 h-px bg-transparent transition duration-200 group-hover:bg-cyan-300/20" />
                      ) : null}
                      <span
                        className={`relative z-10 ${active ? "text-[#dce6ff]" : ""}`}
                      >
                        {file.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </LayoutGroup>
        </div>

        <div className="bg-[linear-gradient(180deg,rgba(6,13,32,0.98),rgba(4,10,24,0.98))]">
          <div className="overflow-x-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFile.label}
                initial={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, y: 10, filter: "blur(4px)" }
                }
                animate={
                  reduceMotion
                    ? undefined
                    : { opacity: 1, y: 0, filter: "blur(0px)" }
                }
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, y: -10, filter: "blur(4px)" }
                }
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="min-w-[480px] sm:min-w-[560px]"
              >
                <div className="grid grid-cols-[44px_1fr] font-mono text-[12px] leading-6 sm:grid-cols-[68px_1fr] sm:text-[14px] sm:leading-8 xl:text-[15px] xl:leading-9">
                  <div className="border-r border-white/5 bg-white/[0.025] px-2 py-4 text-right text-[#55627f] sm:px-4 sm:py-6">
                    {lines.map((_, index) => (
                      <div
                        key={index}
                        className={index === activeLine ? "text-[#88b8ff]" : ""}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>

                  <div className="relative px-3 py-4 sm:px-5 sm:py-6">
                    {lines.map((line, lineIndex) => (
                      <div
                        key={lineIndex}
                        className={
                          lineIndex === activeLine
                            ? "relative whitespace-pre rounded-sm bg-cyan-300/[0.07] shadow-[inset_0_0_0_1px_rgba(125,211,252,0.02)]"
                            : "relative whitespace-pre"
                        }
                      >
                        {line.renderedTokens.length === 0 ? (
                          <span>&nbsp;</span>
                        ) : null}
                        {line.renderedTokens.map((token, tokenIndex) => (
                          <span
                            key={`${lineIndex}-${tokenIndex}`}
                            style={{ color: token.color }}
                          >
                            {token.visibleText}
                          </span>
                        ))}
                        {lineIndex === activeLine && cursorVisible ? (
                          <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-cyan-300 sm:h-5 sm:translate-y-1" />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-2 border-t border-white/8 bg-[#0d1328]/96 px-3 py-3 font-mono text-[10px] text-[#7381a8] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-[12px]">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="text-[#9ddc8a]">{`Ln ${activeLine + 1}, Col ${cursorColumn}`}</span>
              <span>{activeFile.statusMeta ?? "Spaces: 2"}</span>
            </div>
            <span>{activeFile.footer}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
