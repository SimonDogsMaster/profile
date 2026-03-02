import * as THREE from "three";

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

export class TypingTexture {
  texture: THREE.CanvasTexture;
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private elapsed = 0;
  private totalCharacters = codeLines.flatMap((line) => line.map((token) => token.text)).join("").length;
  private visibleCharacters = 0;
  private blinkElapsed = 0;
  private cursorVisible = true;
  private activeLine = 0;

  constructor(width = 1024, height = 640) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;

    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("2D canvas context is not available.");
    }

    this.context = context;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.needsUpdate = true;

    this.draw();
  }

  update(delta: number) {
    this.elapsed += delta;
    this.blinkElapsed += delta;

    if (this.visibleCharacters < this.totalCharacters) {
      this.visibleCharacters = Math.min(this.totalCharacters, Math.floor(this.elapsed * 22));
    } else if (this.elapsed > 8.4) {
      this.elapsed = 0;
      this.visibleCharacters = 0;
    }

    if (this.blinkElapsed > 0.55) {
      this.cursorVisible = !this.cursorVisible;
      this.blinkElapsed = 0;
    }

    this.draw();
  }

  dispose() {
    this.texture.dispose();
  }

  private draw() {
    const ctx = this.context;
    ctx.clearRect(0, 0, this.width, this.height);

    ctx.fillStyle = "#09101f";
    ctx.fillRect(0, 0, this.width, this.height);

    const lineHeight = 44;
    const gutterWidth = 68;
    const startX = 98;
    const startY = 84;
    const maxWidth = this.width - startX - 36;

    let remaining = this.visibleCharacters;
    let cursorX = startX;
    let cursorY = startY;

    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    ctx.fillRect(0, 0, gutterWidth + 36, this.height);

    ctx.font = "500 16px Geist Mono, monospace";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#58627f";

    codeLines.forEach((_, lineIndex) => {
      const y = startY + lineIndex * lineHeight;
      ctx.fillText(String(lineIndex + 1), 34, y);
    });

    ctx.font = "500 24px Geist Mono, monospace";
    ctx.textBaseline = "middle";

    for (let lineIndex = 0; lineIndex < codeLines.length; lineIndex += 1) {
      const line = codeLines[lineIndex];
      let x = startX;
      const y = startY + lineIndex * lineHeight;
      let lineHasCursor = false;

      if (lineIndex === this.activeLine) {
        ctx.fillStyle = "rgba(125, 211, 252, 0.07)";
        ctx.fillRect(gutterWidth + 12, y - 18, maxWidth + 28, 34);
      }

      for (const token of line) {
        const visibleText = token.text.slice(0, Math.max(0, remaining));
        const tokenWidth = ctx.measureText(visibleText).width;

        if (visibleText.length > 0) {
          ctx.fillStyle = token.color;
          ctx.fillText(visibleText, x, y);
          x += tokenWidth;
          remaining -= visibleText.length;
        }

        if (visibleText.length < token.text.length) {
          lineHasCursor = true;
          cursorX = x;
          cursorY = y;
          this.activeLine = lineIndex;
          break;
        }
      }

      if (lineHasCursor) {
        break;
      }

      if (line.length === 0) {
        cursorX = startX;
        cursorY = y;
      } else {
        cursorX = x;
        cursorY = y;
      }
    }

    if (this.cursorVisible) {
      ctx.fillStyle = "#7dd3fc";
      ctx.fillRect(cursorX + 2, cursorY - 16, 14, 28);
    }

    this.texture.needsUpdate = true;
  }
}
