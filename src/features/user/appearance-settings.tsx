import { Eye, Monitor, Moon, Sun, Type, Volume2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitch } from "@/components/language-switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function AppearanceSettings() {
  // Use real theme hook from next-themes
  const { theme, setTheme } = useTheme();

  // Use real translation hook
  const { i18n } = useTranslation();

  // Local settings for display preferences (these could be stored in localStorage or user preferences)
  const [displaySettings, setDisplaySettings] = useState({
    fontSize: "medium",
    compactMode: false,
    reducedMotion: false,
    highContrast: false,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSetting = (key: string, defaultValue: string | boolean) => {
      try {
        const stored = localStorage.getItem(`display-${key}`);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch {
        return defaultValue;
      }
    };

    setDisplaySettings({
      fontSize: loadSetting("fontSize", "medium"),
      compactMode: loadSetting("compactMode", false),
      reducedMotion: loadSetting("reducedMotion", false),
      highContrast: loadSetting("highContrast", false),
    });
  }, []);

  const handleDisplaySettingChange = (key: string, value: string | boolean) => {
    setDisplaySettings((prev) => ({ ...prev, [key]: value }));
    // Persist to localStorage
    localStorage.setItem(`display-${key}`, JSON.stringify(value));
    console.log(`Display setting ${key} changed to ${value}`);
  };

  const themes = [
    {
      value: "light",
      label: "Light",
      icon: Sun,
      description: "Light mode theme",
    },
    {
      value: "dark",
      label: "Dark",
      icon: Moon,
      description: "Dark mode theme",
    },
    {
      value: "system",
      label: "System",
      icon: Monitor,
      description: "Use system preference",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Select the theme for the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme || "system"}
            onValueChange={setTheme}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {themes.map((themeOption) => (
              <div key={themeOption.value} className="space-y-2">
                <Label
                  htmlFor={themeOption.value}
                  className="flex flex-col items-center justify-center rounded-md border border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <RadioGroupItem value={themeOption.value} id={themeOption.value} className="sr-only" />
                  <themeOption.icon className="mb-2 h-6 w-6" />
                  <span className="font-medium">{themeOption.label}</span>
                  <span className="text-xs text-muted-foreground text-center">{themeOption.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Display</CardTitle>
          <CardDescription>Customize how content is displayed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Type className="h-4 w-4" />
              Font Size
            </Label>
            <Select
              value={displaySettings.fontSize}
              onValueChange={(value) => handleDisplaySettingChange("fontSize", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">Reduce spacing and padding for a more compact interface</p>
            </div>
            <Switch
              checked={displaySettings.compactMode}
              onCheckedChange={(checked) => handleDisplaySettingChange("compactMode", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
            </div>
            <Switch
              checked={displaySettings.reducedMotion}
              onCheckedChange={(checked) => handleDisplaySettingChange("reducedMotion", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                High Contrast Mode
              </Label>
              <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
            </div>
            <Switch
              checked={displaySettings.highContrast}
              onCheckedChange={(checked) => handleDisplaySettingChange("highContrast", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>Select your preferred language.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Interface Language</Label>
            <div className="flex items-center gap-2">
              <LanguageSwitch />
              <span className="text-muted-foreground text-sm">Current: {i18n.language?.toUpperCase()}</span>
            </div>
            <p className="text-xs text-muted-foreground">Select the language for the user interface.</p>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>Configure accessibility options.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Screen Reader Support
              </Label>
              <p className="text-sm text-muted-foreground">
                Enhanced support for screen readers and assistive technologies
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Keyboard Navigation</Label>
              <p className="text-sm text-muted-foreground">Enable enhanced keyboard navigation shortcuts</p>
            </div>
            <Switch defaultChecked />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Focus Indicators</Label>
              <p className="text-sm text-muted-foreground">Show enhanced focus indicators for better navigation</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Preview how your settings will look.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Sample Interface Element</span>
              <Button size="sm">Action</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This is how text will appear with your current settings. The font size is set to{" "}
              {displaySettings.fontSize} and{" "}
              {displaySettings.highContrast ? "high contrast mode is enabled" : "normal contrast is used"}.
            </p>
            <div className="flex gap-2">
              <Button variant="default" size="sm">
                Primary
              </Button>
              <Button variant="outline" size="sm">
                Secondary
              </Button>
              <Button variant="ghost" size="sm">
                Ghost
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
