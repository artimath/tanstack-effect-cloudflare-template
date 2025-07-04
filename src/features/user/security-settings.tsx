import { Clock, Key, Laptop, MapPin, Shield, ShieldCheck, Smartphone, Trash2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { authClient } from "@/lib/auth/auth-client";

export function SecuritySettings() {
  const { data: session } = authClient.useSession();
  const [settings, setSettings] = useState({
    twoFactorEnabled: session?.user?.twoFactorEnabled || false,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
    autoSessionTimeout: false,
  });

  // Mock active sessions data
  const activeSessions = [
    {
      id: "1",
      device: "MacBook Pro",
      browser: "Chrome 120",
      location: "San Francisco, CA",
      ip: "192.168.1.1",
      lastActive: "Current session",
      current: true,
    },
    {
      id: "2",
      device: "iPhone 15",
      browser: "Safari Mobile",
      location: "San Francisco, CA",
      ip: "192.168.1.2",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: "3",
      device: "Windows PC",
      browser: "Edge 119",
      location: "New York, NY",
      ip: "10.0.0.1",
      lastActive: "1 day ago",
      current: false,
    },
  ];

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    // TODO: Implement actual settings update with Better-auth
    console.log(`Setting ${key} changed to ${value}`);
  };

  const handleTerminateSession = (sessionId: string) => {
    console.log(`Terminating session ${sessionId}`);
    // TODO: Implement session termination with Better-auth
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                {settings.twoFactorEnabled
                  ? "Your account is protected with 2FA"
                  : "Secure your account with an additional verification step"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {settings.twoFactorEnabled && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              )}
              <Switch
                checked={settings.twoFactorEnabled}
                onCheckedChange={(checked) => handleSettingChange("twoFactorEnabled", checked)}
              />
            </div>
          </div>

          {settings.twoFactorEnabled && (
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication is currently enabled using your authenticator app.
                <div className="mt-2 space-x-2">
                  <Button variant="outline" size="sm">
                    View Recovery Codes
                  </Button>
                  <Button variant="outline" size="sm">
                    Regenerate Codes
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Security Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Security Preferences</CardTitle>
          <CardDescription>Customize your security and notification preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Login Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone signs into your account</p>
            </div>
            <Switch
              checked={settings.loginNotifications}
              onCheckedChange={(checked) => handleSettingChange("loginNotifications", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Suspicious Activity Alerts</Label>
              <p className="text-sm text-muted-foreground">Get alerts for unusual account activity</p>
            </div>
            <Switch
              checked={settings.suspiciousActivityAlerts}
              onCheckedChange={(checked) => handleSettingChange("suspiciousActivityAlerts", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Auto Session Timeout</Label>
              <p className="text-sm text-muted-foreground">Automatically sign out after 30 minutes of inactivity</p>
            </div>
            <Switch
              checked={settings.autoSessionTimeout}
              onCheckedChange={(checked) => handleSettingChange("autoSessionTimeout", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>Manage devices that are currently signed into your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Laptop className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{session.device}</p>
                    {session.current && (
                      <Badge variant="outline" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{session.browser}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {session.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.lastActive}
                    </div>
                  </div>
                </div>
              </div>
              {!session.current && (
                <Button variant="outline" size="sm" onClick={() => handleTerminateSession(session.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Terminate
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Security Actions</CardTitle>
          <CardDescription>Additional security management options.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button variant="outline" className="justify-start">
              Change Password
            </Button>
            <p className="text-sm text-muted-foreground ml-0">Update your password to keep your account secure</p>
          </div>

          <Separator />

          <div className="flex flex-col space-y-2">
            <Button variant="outline" className="justify-start">
              Sign Out All Devices
            </Button>
            <p className="text-sm text-muted-foreground ml-0">This will sign you out of all devices except this one</p>
          </div>

          <Separator />

          <div className="flex flex-col space-y-2">
            <Button variant="outline" className="justify-start text-destructive">
              Download Account Data
            </Button>
            <p className="text-sm text-muted-foreground ml-0">Download a copy of your account data and activity</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
