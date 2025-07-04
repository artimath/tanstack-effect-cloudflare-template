import { Bell, Mail, MessageSquare, Smartphone, Volume2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailFrequency: "realtime",
    emailNotifications: {
      securityAlerts: true,
      productUpdates: false,
      marketingEmails: false,
      communityUpdates: true,
    },
    pushNotifications: {
      directMessages: true,
      comments: true,
      mentions: true,
      likes: false,
    },
    desktopNotifications: {
      enabled: true,
      sound: true,
      showPreviews: false,
    },
  });

  const handleEmailNotificationChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [key]: value,
      },
    }));
  };

  const handlePushNotificationChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      pushNotifications: {
        ...prev.pushNotifications,
        [key]: value,
      },
    }));
  };

  const handleDesktopNotificationChange = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      desktopNotifications: {
        ...prev.desktopNotifications,
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>Choose what updates you want to receive via email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Email Frequency</Label>
            <Select
              value={settings.emailFrequency}
              onValueChange={(value) => setSettings({ ...settings, emailFrequency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly digest</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {settings.emailFrequency === "realtime" && "Receive emails immediately when events occur"}
              {settings.emailFrequency === "daily" && "Receive a daily summary of activity"}
              {settings.emailFrequency === "weekly" && "Receive a weekly summary of activity"}
              {settings.emailFrequency === "never" && "No email notifications will be sent"}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified about login attempts and security changes</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Required
                </Badge>
                <Switch
                  checked={settings.emailNotifications.securityAlerts}
                  onCheckedChange={(checked) => handleEmailNotificationChange("securityAlerts", checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Product Updates</Label>
                <p className="text-sm text-muted-foreground">News about product features and enhancements</p>
              </div>
              <Switch
                checked={settings.emailNotifications.productUpdates}
                onCheckedChange={(checked) => handleEmailNotificationChange("productUpdates", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Tips, tutorials, and promotional content</p>
              </div>
              <Switch
                checked={settings.emailNotifications.marketingEmails}
                onCheckedChange={(checked) => handleEmailNotificationChange("marketingEmails", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Community Updates</Label>
                <p className="text-sm text-muted-foreground">Updates from the community and user-generated content</p>
              </div>
              <Switch
                checked={settings.emailNotifications.communityUpdates}
                onCheckedChange={(checked) => handleEmailNotificationChange("communityUpdates", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>Manage your mobile and browser push notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Direct Messages</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone sends you a message</p>
            </div>
            <Switch
              checked={settings.pushNotifications.directMessages}
              onCheckedChange={(checked) => handlePushNotificationChange("directMessages", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Comments</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone comments on your posts</p>
            </div>
            <Switch
              checked={settings.pushNotifications.comments}
              onCheckedChange={(checked) => handlePushNotificationChange("comments", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Mentions</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone mentions you</p>
            </div>
            <Switch
              checked={settings.pushNotifications.mentions}
              onCheckedChange={(checked) => handlePushNotificationChange("mentions", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Likes & Reactions</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone likes or reacts to your content</p>
            </div>
            <Switch
              checked={settings.pushNotifications.likes}
              onCheckedChange={(checked) => handlePushNotificationChange("likes", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Desktop Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Desktop Notifications
          </CardTitle>
          <CardDescription>Configure desktop notification preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable Desktop Notifications</Label>
              <p className="text-sm text-muted-foreground">Allow notifications to appear on your desktop</p>
            </div>
            <Switch
              checked={settings.desktopNotifications.enabled}
              onCheckedChange={(checked) => handleDesktopNotificationChange("enabled", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Notification Sounds
              </Label>
              <p className="text-sm text-muted-foreground">Play a sound when receiving notifications</p>
            </div>
            <Switch
              checked={settings.desktopNotifications.sound}
              onCheckedChange={(checked) => handleDesktopNotificationChange("sound", checked)}
              disabled={!settings.desktopNotifications.enabled}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Show Message Previews</Label>
              <p className="text-sm text-muted-foreground">Show content preview in notification popups</p>
            </div>
            <Switch
              checked={settings.desktopNotifications.showPreviews}
              onCheckedChange={(checked) => handleDesktopNotificationChange("showPreviews", checked)}
              disabled={!settings.desktopNotifications.enabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Summary</CardTitle>
          <CardDescription>Overview of your current notification settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Email</span>
              </div>
              <Badge variant={settings.emailFrequency === "never" ? "secondary" : "default"}>
                {settings.emailFrequency === "realtime" && "Real-time"}
                {settings.emailFrequency === "daily" && "Daily"}
                {settings.emailFrequency === "weekly" && "Weekly"}
                {settings.emailFrequency === "never" && "Disabled"}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Push</span>
              </div>
              <Badge variant={Object.values(settings.pushNotifications).some(Boolean) ? "default" : "secondary"}>
                {Object.values(settings.pushNotifications).filter(Boolean).length} active
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Desktop</span>
              </div>
              <Badge variant={settings.desktopNotifications.enabled ? "default" : "secondary"}>
                {settings.desktopNotifications.enabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
