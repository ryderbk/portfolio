import React from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { 
  Palette, 
  Settings, 
  Zap, 
  RotateCcw, 
  Sun, 
  Moon, 
  Monitor,
  MousePointer2,
  Type,
  Maximize,
  Box,
  Layers
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PRESETS } from "@/types/site-config";

interface ConfigPanelProps {
  activeTab: "appearance" | "behavior" | "advanced";
  onTabChange: (tab: "appearance" | "behavior" | "advanced") => void;
}

export default function ConfigPanel({ activeTab, onTabChange }: ConfigPanelProps) {
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

  const ControlItem = ({ label, description, children }: { label: string, description?: string, children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
      <div className="pt-1">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted/30 rounded-xl w-fit">
        <button
          onClick={() => onTabChange("appearance")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "appearance" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Palette size={16} /> Appearance
        </button>
        <button
          onClick={() => onTabChange("behavior")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "behavior" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <MousePointer2 size={16} /> Behavior
        </button>
        <button
          onClick={() => onTabChange("advanced")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "advanced" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Settings size={16} /> Advanced
        </button>
      </div>

      {/* Preset & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
        <div className="flex flex-wrap gap-2 items-center min-h-[32px]">
          {activeTab === 'appearance' ? (
            <>
              <span className="text-xs font-bold uppercase tracking-wider text-primary/70 mr-2">Quick Presets:</span>
              {Object.keys(PRESETS).map(name => (
                <button
                  key={name}
                  onClick={() => {
                    applyPreset(name);
                    toast({
                      title: "Preset Applied",
                      description: `Successfully switched to ${name.replace("-", " ")} style.`,
                    });
                  }}
                  className="px-3 py-1.5 bg-background border border-border hover:border-primary rounded-lg text-xs font-bold capitalize transition-all"
                >
                  {name.replace("-", " ")}
                </button>
              ))}
            </>
          ) : (
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mr-2">Settings are auto-saved</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              resetToDefault();
              toast({
                title: "Settings Reset",
                description: "All configuration has been restored to factory defaults.",
              });
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

      {/* Appearance Content */}
      {activeTab === "appearance" && (
        <div className="grid gap-6">
          <ControlGroup title="Theme & Brand" icon={Sun}>
            <ControlItem label="Theme Mode" description="Choose your preferred color scheme">
              <div className="flex gap-2 p-1 bg-muted/50 rounded-lg w-fit">
                {[
                  { id: "light", icon: Sun },
                  { id: "dark", icon: Moon },
                  { id: "system", icon: Monitor }
                ].map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      updateConfig({ themeMode: id as any });
                      toast({
                        title: "Theme Updated",
                        description: `Switched to ${id} mode.`,
                      });
                    }}
                    className={`p-2 rounded-md transition-all ${config.themeMode === id ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </ControlItem>
            <ControlItem label="Accent Color" description="Main brand color used for links and icons">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => updateConfig({ accentColor: e.target.value })}
                  className="w-10 h-10 border-none bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={config.accentColor}
                  onChange={(e) => updateConfig({ accentColor: e.target.value })}
                  className="bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-xs font-mono w-24"
                />
              </div>
            </ControlItem>
          </ControlGroup>

          <ControlGroup title="Typography & Layout" icon={Type}>
             <ControlItem label="Primary Font" description="Main body and heading font family">
                <select 
                  value={config.fontFamily}
                  onChange={(e) => updateConfig({ fontFamily: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Inter, sans-serif">Inter (Modern Sans)</option>
                  <option value="Outfit, sans-serif">Outfit (Geometric Display)</option>
                  <option value="system-ui, sans-serif">System UI</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                </select>
             </ControlItem>
             <ControlItem label="Style Variant" description="The overall design language of the site">
                <div className="grid grid-cols-2 gap-2">
                  {["minimal", "modern", "glass", "premium"].map((variant) => (
                    <button
                      key={variant}
                      onClick={() => updateConfig({ styleVariant: variant as any })}
                      className={`px-3 py-2 rounded-lg text-xs font-bold capitalize border transition-all ${config.styleVariant === variant ? "bg-primary text-white border-primary" : "bg-background border-border hover:border-primary/50"}`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
             </ControlItem>
          </ControlGroup>

          <ControlGroup title="Shape & Surface" icon={Box}>
             <ControlItem label="Corner Radius" description="Roundedness of cards and buttons">
                <div className="flex justify-between gap-1 p-1 bg-muted/50 rounded-lg">
                  {["none", "small", "normal", "rounded", "pill"].map((r) => (
                    <button
                      key={r}
                      onClick={() => updateConfig({ radius: r as any })}
                      className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${config.radius === r ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
             </ControlItem>
             <ControlItem label="Shadow Intensity" description="Depth and elevation of elements">
                <div className="flex justify-between gap-1 p-1 bg-muted/50 rounded-lg">
                  {["none", "soft", "medium", "strong"].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateConfig({ shadow: s as any })}
                      className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${config.shadow === s ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
             </ControlItem>
          </ControlGroup>
        </div>
      )}

      {/* Behavior Content */}
      {activeTab === "behavior" && (
        <div className="grid gap-6">
          <ControlGroup title="Motion & Interactivity" icon={Zap}>
            <ControlItem label="Global Motion Level" description="Controls overall animation intensity">
              <div className="flex justify-between gap-1 p-1 bg-muted/50 rounded-lg">
                {["off", "subtle", "normal", "high"].map((m) => (
                  <button
                    key={m}
                    onClick={() => updateConfig({ motionLevel: m as any })}
                    className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${config.motionLevel === m ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </ControlItem>
            <div className="flex flex-col gap-4">
               <div className="flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-sm font-semibold">Hover Effects</span>
                    <span className="text-xs text-muted-foreground">Interactive scale/glow effects</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className={`text-[10px] font-bold uppercase ${config.hoverEffects ? "text-primary" : "text-muted-foreground"}`}>
                     {config.hoverEffects ? "ON" : "OFF"}
                   </span>
                   <button 
                    onClick={() => {
                      updateConfig({ hoverEffects: !config.hoverEffects });
                      toast({
                        title: `Hover Effects ${!config.hoverEffects ? "Enabled" : "Disabled"}`,
                        description: "Interactive effects have been updated.",
                      });
                    }}
                    className={`w-12 h-6 rounded-full transition-all relative ${config.hoverEffects ? "bg-primary" : "bg-muted"}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.hoverEffects ? "right-1" : "left-1"}`} />
                   </button>
                 </div>
               </div>
               <div className="flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-sm font-semibold">Scroll Animations</span>
                    <span className="text-xs text-muted-foreground">Fade-in/Slide-on scroll</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className={`text-[10px] font-bold uppercase ${config.scrollAnimation ? "text-primary" : "text-muted-foreground"}`}>
                     {config.scrollAnimation ? "ON" : "OFF"}
                   </span>
                   <button 
                    onClick={() => {
                      updateConfig({ scrollAnimation: !config.scrollAnimation });
                      toast({
                        title: `Scroll Animations ${!config.scrollAnimation ? "Enabled" : "Disabled"}`,
                        description: "Scroll effects have been updated.",
                      });
                    }}
                    className={`w-12 h-6 rounded-full transition-all relative ${config.scrollAnimation ? "bg-primary" : "bg-muted"}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.scrollAnimation ? "right-1" : "left-1"}`} />
                   </button>
                 </div>
               </div>
            </div>
          </ControlGroup>

          <ControlGroup title="Background & Special" icon={Layers}>
             <div className="space-y-4 w-full md:col-span-2">
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-sm font-semibold">Background Particles</span>
                      <span className="text-xs text-muted-foreground">Animated background elements</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <span className={`text-[10px] font-bold uppercase ${config.backgroundAnimation ? "text-primary" : "text-muted-foreground"}`}>
                       {config.backgroundAnimation ? "ON" : "OFF"}
                     </span>
                     <button 
                      onClick={() => {
                        updateConfig({ backgroundAnimation: !config.backgroundAnimation });
                        toast({
                          title: `Background Particles ${!config.backgroundAnimation ? "Enabled" : "Disabled"}`,
                          description: "Background visuals have been updated.",
                        });
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative ${config.backgroundAnimation ? "bg-primary" : "bg-muted"}`}
                     >
                       <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.backgroundAnimation ? "right-1" : "left-1"}`} />
                     </button>
                   </div>
                 </div>
                 <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-sm font-semibold">Smooth Scroll</span>
                      <span className="text-xs text-muted-foreground">Custom scroll physics</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <span className={`text-[10px] font-bold uppercase ${config.smoothScroll ? "text-primary" : "text-muted-foreground"}`}>
                       {config.smoothScroll ? "ON" : "OFF"}
                     </span>
                     <button 
                      onClick={() => {
                        updateConfig({ smoothScroll: !config.smoothScroll });
                        toast({
                          title: `Smooth Scroll ${!config.smoothScroll ? "Enabled" : "Disabled"}`,
                          description: "Scroll physics have been updated.",
                        });
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative ${config.smoothScroll ? "bg-primary" : "bg-muted"}`}
                     >
                       <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.smoothScroll ? "right-1" : "left-1"}`} />
                     </button>
                   </div>
                 </div>
                 <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-sm font-semibold">Chatbot Visibility</span>
                      <span className="text-xs text-muted-foreground">Show/hide AI assistant</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <span className={`text-[10px] font-bold uppercase ${config.chatbotVisibility ? "text-primary" : "text-muted-foreground"}`}>
                       {config.chatbotVisibility ? "ON" : "OFF"}
                     </span>
                     <button 
                      onClick={() => {
                        updateConfig({ chatbotVisibility: !config.chatbotVisibility });
                        toast({
                          title: `Chatbot ${!config.chatbotVisibility ? "Visible" : "Hidden"}`,
                          description: "AI assistant visibility has been toggled.",
                        });
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative ${config.chatbotVisibility ? "bg-primary" : "bg-muted"}`}
                     >
                       <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.chatbotVisibility ? "right-1" : "left-1"}`} />
                     </button>
                   </div>
                 </div>
             </div>
          </ControlGroup>
        </div>
      )}

      {/* Advanced Content */}
      {activeTab === "advanced" && (
        <div className="grid gap-6">
          <ControlGroup title="Glassmorphism & Effects" icon={Maximize}>
            <ControlItem label="Glass Effect" description="Transparency and reflections">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase ${config.glassEffect ? "text-primary" : "text-muted-foreground"}`}>
                  {config.glassEffect ? "ON" : "OFF"}
                </span>
                <button 
                  onClick={() => {
                    updateConfig({ glassEffect: !config.glassEffect });
                    toast({
                      title: `Glass Effect ${!config.glassEffect ? "Enabled" : "Disabled"}`,
                      description: "Transparency effects have been updated.",
                    });
                  }}
                  className={`w-12 h-6 rounded-full transition-all relative ${config.glassEffect ? "bg-primary" : "bg-muted"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.glassEffect ? "right-1" : "left-1"}`} />
                </button>
              </div>
            </ControlItem>
            <ControlItem label="Blur Intensity" description={`${config.blurIntensity}px`}>
              <div className="flex items-center gap-4">
                <input 
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={config.blurIntensity}
                  onChange={(e) => updateConfig({ blurIntensity: parseInt(e.target.value) })}
                  className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-xs font-mono w-8 text-right">{config.blurIntensity}</span>
              </div>
            </ControlItem>
            <ControlItem label="Transparency" description={`${Math.round(config.transparencyLevel * 100)}%`}>
              <div className="flex items-center gap-4">
                <input 
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={Math.round(config.transparencyLevel * 100)}
                  onChange={(e) => updateConfig({ transparencyLevel: parseInt(e.target.value) / 100 })}
                  className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-xs font-mono w-8 text-right">{Math.round(config.transparencyLevel * 100)}%</span>
              </div>
            </ControlItem>
            <ControlItem label="Card Style" description="Select surface style">
              <div className="grid grid-cols-2 gap-2 bg-muted/30 p-1 rounded-xl">
                {["flat", "elevated", "outlined", "glass"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      updateConfig({ cardStyle: s as any });
                      toast({
                        title: "Card Style Updated",
                        description: `Surface style set to ${s}.`,
                      });
                    }}
                    className={`px-3 py-2 rounded-lg text-[10px] font-extrabold uppercase transition-all border ${config.cardStyle === s ? "bg-primary text-white border-primary shadow-sm" : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ControlItem>
          </ControlGroup>

          <ControlGroup title="Scaling & Speed" icon={Settings}>
             <ControlItem label="Animation Speed" description={`${config.animationSpeed}x`}>
                <div className="flex items-center gap-4">
                  <input 
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={config.animationSpeed}
                    onChange={(e) => updateConfig({ animationSpeed: parseFloat(e.target.value) })}
                    className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-xs font-mono w-8 text-right">{config.animationSpeed}x</span>
                </div>
             </ControlItem>
             <ControlItem label="Section Spacing" description={`${config.sectionPaddingScale}x`}>
                <div className="flex items-center gap-4">
                  <input 
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={config.sectionPaddingScale}
                    onChange={(e) => updateConfig({ sectionPaddingScale: parseFloat(e.target.value) })}
                    className="flex-1 h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-xs font-mono w-8 text-right">{config.sectionPaddingScale}x</span>
                </div>
             </ControlItem>
             <div className="flex items-center justify-between w-full md:col-span-2 pt-4 border-t border-border">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Contrast Boost</span>
                  <span className="text-xs text-muted-foreground">Increase accessibility and visibility</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase ${config.contrastBoost ? "text-primary" : "text-muted-foreground"}`}>
                    {config.contrastBoost ? "ON" : "OFF"}
                  </span>
                  <button 
                    onClick={() => {
                      updateConfig({ contrastBoost: !config.contrastBoost });
                      toast({
                        title: `Contrast Boost ${!config.contrastBoost ? "Enabled" : "Disabled"}`,
                        description: "Accessibility settings have been updated.",
                      });
                    }}
                    className={`w-12 h-6 rounded-full transition-all relative ${config.contrastBoost ? "bg-primary" : "bg-muted"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.contrastBoost ? "right-1" : "left-1"}`} />
                  </button>
                </div>
             </div>
          </ControlGroup>
        </div>
      )}
    </div>
  );
}
