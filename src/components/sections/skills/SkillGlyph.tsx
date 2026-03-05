import Image from "next/image";

type SkillGlyphProps = {
  short: string;
  accent: string;
  glow: string;
  name: string;
  iconPath?: string;
};

export function SkillGlyph({
  short,
  accent,
  glow,
  name,
  iconPath,
}: SkillGlyphProps) {
  return (
    <div
      className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[20px] border border-cyan-100/16 shadow-[inset_0_1px_0_rgba(236,247,255,0.06),0_10px_24px_rgba(2,8,24,0.3)]"
      style={{
        background: `radial-gradient(circle at 30% 24%, ${glow}, transparent 54%), linear-gradient(180deg, color-mix(in srgb, ${accent} 11%, rgba(255,255,255,0.05)), rgba(255,255,255,0.015))`,
      }}
    >
      <div
        className="absolute inset-[7px] rounded-[14px] opacity-90"
        style={{
          border: `1px solid color-mix(in srgb, ${accent} 44%, transparent)`,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))",
        }}
      />
      <div
        className="absolute left-2.5 top-2 h-2 w-2 rounded-full blur-[2px]"
        style={{ backgroundColor: accent }}
      />
      {iconPath ? (
        <div className="relative flex h-11 w-11 items-center justify-center rounded-[14px] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(234,239,248,0.94))] shadow-[0_10px_24px_rgba(4,8,24,0.24),inset_0_1px_0_rgba(255,255,255,0.95)]">
          <Image
            src={iconPath}
            alt={name}
            width={34}
            height={34}
            className="h-[34px] w-[34px] object-contain"
          />
        </div>
      ) : (
        <span
          className="relative text-lg font-semibold tracking-[0.14em]"
          style={{ color: accent }}
        >
          {short}
        </span>
      )}
    </div>
  );
}
