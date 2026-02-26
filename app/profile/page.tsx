"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  Building,
  Lock,
  Bell,
  LogOut,
  Save,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";
import { FormField } from "@/components/FormField";
import { StatCard, PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [saved, setSaved] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    department: user?.department ?? "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [notifs, setNotifs] = useState({
    email: true,
    sms: user?.role === "DRIVER",
  });

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div>
      <PageHeader
        title="Profile & Settings"
        subtitle="Manage your account and preferences"
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Account Type"
          value={user?.role?.replace("_", " ") ?? "—"}
          icon={Shield}
          variant="default"
          sub="access level"
        />
        <StatCard
          label="Department"
          value={user?.department ?? "N/A"}
          icon={Building}
          variant="success"
        />
        <StatCard
          label="Last Login"
          value="Today"
          icon={Clock}
          variant="accent"
          sub="Feb 21, 2026"
        />
        <StatCard
          label="Account Status"
          value="Active"
          icon={CheckCircle}
          variant="success"
          sub="in good standing"
        />
      </div>

      {saved && (
        <Alert className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-800">
          <CheckCircle className="size-4 text-emerald-600" />
          <AlertDescription className="font-semibold">
            Changes saved successfully
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Preferences</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
        </TabsList>

        {/* ── Profile ── */}
        <TabsContent value="profile">
          <div className="grid gap-5 md:grid-cols-3">
            {/* Avatar card */}
            <Card className="shadow-sm">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Avatar className="h-20 w-20 text-2xl">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-base font-bold text-foreground">
                  {user?.name}
                </h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  Upload Avatar
                </Button>
              </CardContent>
            </Card>

            {/* Profile form */}
            <Card className="shadow-sm md:col-span-2">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-sm font-bold">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <FormField
                  label="Full Name"
                  value={profileData.name}
                  onChange={(v) => setProfileData({ ...profileData, name: v })}
                  icon={User}
                />
                <FormField
                  label="Email Address"
                  value={profileData.email}
                  onChange={(v) => setProfileData({ ...profileData, email: v })}
                  icon={Mail}
                  type="email"
                  readOnly
                />
                <FormField
                  label="Phone Number"
                  value={profileData.phone}
                  onChange={(v) => setProfileData({ ...profileData, phone: v })}
                  icon={Phone}
                />
                <FormField
                  label="Department"
                  value={profileData.department}
                  onChange={(v) =>
                    setProfileData({ ...profileData, department: v })
                  }
                  icon={Building}
                />
                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <Button onClick={save}>
                    <Save className="size-4" /> Save Changes
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Role:{" "}
                    <span className="font-semibold capitalize">
                      {user?.role?.replace("_", " ")}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Security ── */}
        <TabsContent value="security">
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-sm font-bold">
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <FormField
                  label="Current Password"
                  value={passwords.current}
                  onChange={(v) => setPasswords({ ...passwords, current: v })}
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                />
                <FormField
                  label="New Password"
                  value={passwords.new}
                  onChange={(v) => setPasswords({ ...passwords, new: v })}
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                />
                <FormField
                  label="Confirm Password"
                  value={passwords.confirm}
                  onChange={(v) => setPasswords({ ...passwords, confirm: v })}
                  type="password"
                  icon={Lock}
                  placeholder="••••••••"
                />
                <Button onClick={save} className="w-full">
                  Update Password
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-sm font-bold">
                  Login History
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border p-0">
                {[
                  {
                    device: "Chrome on MacOS",
                    location: "Casablanca, MA",
                    date: "2026-02-21 14:30",
                    current: true,
                  },
                  {
                    device: "Safari on iPhone",
                    location: "Casablanca, MA",
                    date: "2026-02-21 09:15",
                  },
                  {
                    device: "Chrome on Windows",
                    location: "Rabat, MA",
                    date: "2026-02-19 16:45",
                  },
                ].map((l, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {l.device}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {l.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-muted-foreground">
                        {l.date}
                      </p>
                      {l.current && (
                        <p className="text-[11px] font-bold text-emerald-600">
                          ● Current
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Notifications ── */}
        <TabsContent value="notifications">
          <Card className="max-w-lg shadow-sm">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-sm font-bold">
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              {[
                {
                  key: "email",
                  label: "Email Notifications",
                  desc: "Receive updates about trips and activities",
                  disabled: false,
                },
                {
                  key: "sms",
                  label: "SMS Notifications",
                  desc: "Receive SMS alerts for urgent matters (drivers only)",
                  disabled: user?.role !== "DRIVER",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className={item.disabled ? "opacity-50" : ""}>
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifs[item.key as keyof typeof notifs]}
                    onCheckedChange={(v) =>
                      setNotifs({ ...notifs, [item.key]: v })
                    }
                    disabled={item.disabled}
                  />
                </div>
              ))}
              <Button onClick={save} className="w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Organization ── */}
        <TabsContent value="organization">
          <Card className="max-w-lg shadow-sm">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-sm font-bold">
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <FormField
                label="Company Name"
                value="TransitHub Inc."
                onChange={() => {}}
                readOnly
              />
              <FormField
                label="Industry"
                value="Transportation & Logistics"
                onChange={() => {}}
                readOnly
              />
              <FormField
                label="Support"
                value="support@transithub.com"
                onChange={() => {}}
                readOnly
              />
              <FormField
                label="Country"
                value="Morocco"
                onChange={() => {}}
                readOnly
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Logout */}
      <div className="mt-6 flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <div>
          <p className="font-bold text-foreground">Sign Out</p>
          <p className="text-sm text-muted-foreground">
            Sign out from your current session
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <LogOut className="size-4" /> Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be signed out of your TransitHub session.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
