import { StackIcon } from "./types";
import { SkillGlyph } from "./SkillGlyph";

export function MobileToken({ item }: { item: StackIcon }) {
  return (
    <div className="theme-chip theme-border relative overflow-hidden rounded-[22px] border border-cyan-100/12 bg-[linear-gradient(165deg,rgba(13,20,40,0.92),rgba(7,12,28,0.92))] p-4 shadow-[inset_0_1px_0_rgba(226,242,255,0.05)] md:hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 14% 18%, ${item.glow}, transparent 32%), linear-gradient(180deg, rgba(148,163,184,0.06), transparent 42%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-[8px] rounded-2xl border border-white/8" />
      <div className="relative flex items-center gap-4">
        <SkillGlyph
          name={item.name}
          short={item.short}
          accent={item.accent}
          glow={item.glow}
          iconPath={item.iconPath}
        />
        <div>
          <p className="theme-text text-base font-medium">{item.name}</p>
          <p className="theme-muted mt-1 text-xs uppercase tracking-[0.22em]">
            {item.category}
          </p>
        </div>
      </div>
    </div>
  );
}
