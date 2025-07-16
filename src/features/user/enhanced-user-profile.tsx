import { BadgeCheck, Calendar, Camera, Github, Link as LinkIcon, MapPin, Twitter } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth/auth-client";

export function EnhancedUserProfile() {
  const { data: session } = authClient.useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    bio: "",
    location: "",
    website: "",
    github: "",
    twitter: "",
  });

  const handleSave = () => {
    // TODO: Implement profile update with Better-auth
    console.log("Saving profile:", profile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setProfile({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      bio: "",
      location: "",
      website: "",
      github: "",
      twitter: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-start gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
            <AvatarFallback className="text-lg">
              {session?.user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-semibold">{session?.user?.name}</h3>
            {session?.user?.emailVerified && (
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <BadgeCheck className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{session?.user?.email}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {profile.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Member since {session?.user?.createdAt ? new Date(session.user.createdAt).getFullYear() : new Date().getFullYear()}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm">
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Profile Fields */}
      <div className="grid gap-6">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us a little bit about yourself"
              className="min-h-[100px]"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub Username</Label>
              <div className="relative">
                <Github className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="github"
                  className="pl-10"
                  value={profile.github}
                  onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter Handle</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="twitter"
                  className="pl-10"
                  value={profile.twitter}
                  onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Profile Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active memberships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Social Links */}
      {!isEditing && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Links</Label>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" asChild>
              <a href={profile.website} target="_blank" rel="noopener noreferrer">
                <LinkIcon className="mr-2 h-4 w-4" />
                Website
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a
                href={`https://twitter.com/${profile.twitter.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
