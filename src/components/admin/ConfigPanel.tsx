import React from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { 
  RotateCcw, Sun, Moon, Monitor,
  Type, Maximize, Box, Undo2, Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PRESETS, COLOR_PALETTES, FONT_OPTIONS } from "@/types/site-config";

export default function ConfigPanel() {
  const { config, updateConfig, resetToDefault, applyPreset, isSyncing } = useSiteConfig();
  const { toast } = useToast();

  const ControlGroup = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: any }) => (
    <div className="space-y-4 p-6 rounded-2xl border border-border bg-background/50">
      <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
        {Icon && <Icon size={18} className="text-primary" />}
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );

  const ControlItem = ({ label, description, children, fullWidth }: { label: string, description?: string, children: React.ReactNode, fullWidth?: boolean }) => (
    <div className={`space-y-1.5 ${fullWidth ? "md:col-span-2" : ""}`}>
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
      <div className="pt-1">{children}</div>
    </div>
  );

  const Toggle = ({ value, onChange, label, desc }: { value: boolean, onChange: () => void, label: string, desc: string }) => (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs text-muted-foreground">{desc}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-[10px] font-bold uppercase ${value ? "text-primary" : "text-muted-foreground"}`}>
          {value ? "ON" : "OFF"}
        </span>
        <button
          onClick={onChange}
          className={`w-12 h-6 rounded-full transition-all relative ${value ? "bg-primary" : "bg-muted"}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-background transition-all ${value ? "right-1" : "left-1"}`} />
        </button>
      </div>
    </div>
  );

  const selectedPalette = config.selectedPalette || "original";
  const selectedFont = config.selectedFont || "original";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Preset & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
        <div className="flex flex-wrap gap-2 items-center min-h-[32px]">
          <span className="text-xs font-bold uppercase tracking-wider text-primary/70 mr-2">Quick Presets:</span>
          {Object.keys(PRESETS).map(name => (
            <button
              key={name}
              onClick={() => {
                applyPreset(name);
                toast({ title: "Preset Applied", description: `Switched to ${name.replace("-", " ")} style.` });
              }}
              className="px-3 py-1.5 bg-background border border-border hover:border-primary rounded-lg text-xs font-bold capitalize transition-all"
            >
              {name.replace("-", " ")}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              resetToDefault();
              toast({ title: "Settings Reset", description: "All configuration has been restored to factory defaults." });
            }}
            className="px-3 py-1.5 bg-background border border-border hover:bg-red-50 hover:text-red-600 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
          {isSyncing && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-bold text-primary uppercase">Syncing...</span>
            </div>
          )}
        </div>
      </div>

      {/* ─── Configuration Groups ─── */}
      <div className="grid gap-6">
        <ControlGroup title="Theme & Brand" icon={Sun}>
          <ControlItem label="Theme Mode" description="Choose your preferred color scheme">
            <div className="flex gap-2 p-1 bg-muted/50 rounded-lg w-fit">
              {([
                { id: "light", icon: Sun },
                { id: "dark", icon: Moon },
                { id: "system", icon: Monitor }
              ] as const).map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    updateConfig({ themeMode: id });
                    toast({ title: "Theme Updated", description: `Switched to ${id} mode.` });
                  }}
                  className={`p-2 rounded-md transition-all ${config.themeMode === id ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </ControlItem>

          <ControlItem label="Color Palette" description="Select a curated color theme" fullWidth>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COLOR_PALETTES.map((palette) => {
                const isActive = selectedPalette === palette.id;
                const isOriginal = palette.id === "original";
                const preview = palette.nativeMode === "dark" ? palette.dark : palette.light;

                return (
                  <button
                    key={palette.id}
                    onClick={() => {
                      updateConfig({ selectedPalette: palette.id });
                      toast({ title: "Palette Applied", description: `Switched to ${palette.name}.` });
                    }}
                    className={`relative flex flex-col gap-2 p-3 rounded-xl border-2 transition-all text-left group hover:scale-[1.02] active:scale-[0.98] ${
                      isActive
                        ? "border-primary shadow-lg shadow-primary/15 bg-primary/5"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check size={12} className="text-primary-foreground" />
                      </div>
                    )}

                    {isOriginal ? (
                      <div className="flex items-center justify-center h-8 rounded-lg bg-muted/50">
                        <Undo2 size={16} className="text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="flex gap-1 h-8">
                        {[preview.bg, preview.surface, preview.accent, preview.text, preview.muted].map((c, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-md border border-black/10"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}

                    <div>
                      <span className="text-xs font-bold block leading-tight">
                        {isOriginal && <Undo2 size={10} className="inline mr-1 -mt-0.5" />}
                        {palette.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground capitalize">
                        {isOriginal ? "Default" : `${palette.nativeMode} native`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </ControlItem>
        </ControlGroup>

        <ControlGroup title="Typography & Font" icon={Type}>
          <ControlItem label="Font Family" description="Select a premium font for the site" fullWidth>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FONT_OPTIONS.map((font) => {
                const isActive = selectedFont === font.id;
                const isOriginal = font.id === "original";

                return (
                  <button
                    key={font.id}
                    onClick={() => {
                      updateConfig({ selectedFont: font.id });
                      toast({ title: "Font Applied", description: `Switched to ${font.name}.` });
                    }}
                    className={`relative flex flex-col gap-1.5 p-3 rounded-xl border-2 transition-all text-left group hover:scale-[1.02] active:scale-[0.98] ${
                      isActive
                        ? "border-primary shadow-lg shadow-primary/15 bg-primary/5"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check size={12} className="text-primary-foreground" />
                      </div>
                    )}

                    {isOriginal ? (
                      <div className="flex items-center gap-1.5">
                        <Undo2 size={14} className="text-muted-foreground" />
                        <span className="text-xs font-bold">Original</span>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold truncate pr-6">{font.name}</span>
                    )}

                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground">{font.type}</span>
                      <span className="text-[10px] text-muted-foreground/70">{font.useFor}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </ControlItem>
        </ControlGroup>

        <ControlGroup title="Shape & Surface" icon={Box}>
          <ControlItem label="Corner Radius" description="Roundedness of cards and buttons">
            <div className="flex justify-between gap-1 p-1 bg-muted/50 rounded-lg">
              {(["none", "small", "normal", "rounded"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => updateConfig({ radius: r })}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${config.radius === r ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </ControlItem>
          <ControlItem label="Shadow Intensity" description="Depth and elevation of elements">
            <div className="flex justify-between gap-1 p-1 bg-muted/50 rounded-lg">
              {(["none", "soft", "medium", "strong"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateConfig({ shadow: s })}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${config.shadow === s ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </ControlItem>
        </ControlGroup>

        <ControlGroup title="Glassmorphism & Effects" icon={Maximize}>
          <ControlItem label="Glass Effect" description="Transparency and reflections">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase ${config.glassEffect ? "text-primary" : "text-muted-foreground"}`}>
                {config.glassEffect ? "ON" : "OFF"}
              </span>
              <button
                onClick={() => { updateConfig({ glassEffect: !config.glassEffect }); toast({ title: `Glass Effect ${!config.glassEffect ? "Enabled" : "Disabled"}`, description: "Transparency effects have been updated." }); }}
                className={`w-12 h-6 rounded-full transition-all relative ${config.glassEffect ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-background transition-all ${config.glassEffect ? "right-1" : "left-1"}`} />
              </button>
            </div>
          </ControlItem>
          <Toggle value={config.backgroundAnimation} label="Background Particles" desc="Animated background elements"
              onChange={() => { updateConfig({ backgroundAnimation: !config.backgroundAnimation }); toast({ title: `Background Particles ${!config.backgroundAnimation ? "Enabled" : "Disabled"}`, description: "Background visuals have been updated." }); }} />
          <ControlItem label="Card Style" description="Select surface style">
            <div className="grid grid-cols-2 gap-2 bg-muted/30 p-1 rounded-xl">
              {(["flat", "elevated", "outlined", "glass"] as const).map((s) => (
                <button key={s}
                  onClick={() => { updateConfig({ cardStyle: s }); toast({ title: "Card Style Updated", description: `Surface style set to ${s}.` }); }}
                  className={`px-3 py-2 rounded-lg text-[10px] font-extrabold uppercase transition-all border ${config.cardStyle === s ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </ControlItem>
        </ControlGroup>
      </div>
    </div>
  );
}
