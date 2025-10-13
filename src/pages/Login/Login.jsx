import { useState } from "react";
import { Form, useActionData } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

/* ========= Clean + minimal responsive SVG hero =========
   - Outer <svg>: preserveAspectRatio="none" to always fill the column
   - Inner <svg>: preserveAspectRatio="xMinYMid slice" => cover + anchor LEFT
   - Chat bubbles are drawn FIRST (background); Agent drawn LAST (foreground)
*/
function HeroSVGClean(props) {
  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <linearGradient id="bg-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="55%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Full-bleed gradient background */}
      <rect x="0" y="0" width="100" height="100" fill="url(#bg-fill)" />

      {/* Proportional scene */}
      <svg
        x="0"
        y="0"
        width="100%"
        height="100%"
        viewBox="0 0 1200 1100"
        preserveAspectRatio="xMinYMid slice"
      >
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            {/* lighter, subtler grid */}
            <path d="M48 0H0V48" fill="none" stroke="white" strokeOpacity="0.10" strokeWidth="1" />
          </pattern>
          <radialGradient id="glow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="white" stopOpacity="0.22" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            {/* softer shadow */}
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0B1026" floodOpacity="0.28" />
          </filter>
        </defs>

        {/* Texture & glows */}
        <rect width="1200" height="1100" fill="url(#grid)" />
        <circle cx="970" cy="240" r="340" fill="url(#glow)" />
        <circle cx="290" cy="920" r="380" fill="url(#glow)" />

        {/* --- TITLE: smaller, clean, minimal --- */}
        <g transform="translate(140,160)">
          <text
            x="0"
            y="0"
            fontFamily="Inter, ui-sans-serif, system-ui"
            fontSize="52"
            fontWeight="700"
            letterSpacing="0.2px"
            fill="white"
          >
            Ticket support system
          </text>
          <text
            x="0"
            y="38"
            fontFamily="Inter, ui-sans-serif, system-ui"
            fontSize="18"
            fill="white"
            opacity="0.8"
          >
            Convert requests into tickets and resolve issues faster
          </text>
        </g>

        {/* --- BACKGROUND CHAT BUBBLES (drawn first) --- */}
        <g filter="url(#shadow)">
          <g transform="translate(170,360)" opacity="0.96">
            <rect width="340" height="118" rx="18" fill="white" />
            <circle cx="58" cy="60" r="14" fill="#2563EB" opacity="0.2" />
            <rect x="96" y="42" width="188" height="16" rx="8" fill="#1F2937" opacity="0.55" />
            <rect x="96" y="68" width="148" height="12" rx="6" fill="#1F2937" opacity="0.35" />
          </g>

          <g transform="translate(520,660)" opacity="0.96">
            <rect width="360" height="124" rx="18" fill="white" />
            <rect x="36" y="48" width="232" height="16" rx="8" fill="#1F2937" opacity="0.50" />
            <rect x="36" y="74" width="198" height="12" rx="6" fill="#1F2937" opacity="0.32" />
            <circle cx="318" cy="70" r="16" fill="#22C55E" opacity="0.95" />
            <path d="M310 70l6 8 12-14" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          <g transform="translate(220,920)" opacity="0.96">
            <rect width="340" height="118" rx="18" fill="white" />
            <rect x="28" y="44" width="222" height="14" rx="7" fill="#1F2937" opacity="0.50" />
            <rect x="28" y="66" width="182" height="12" rx="6" fill="#1F2937" opacity="0.32" />
            <circle cx="302" cy="72" r="16" fill="#F59E0B" opacity="0.9" />
          </g>
        </g>

        {/* --- AGENT (drawn last => on TOP) --- */}
        <g transform="translate(400,770)" filter="url(#shadow)">
          {/* desk rail */}
          <rect x="-260" y="26" width="860" height="16" rx="8" fill="#0F172A" opacity="0.14" />
          {/* body */}
          <path d="M0 70c0-94 74-150 176-150s176 56 176 150" fill="#111827" />
          <path d="M12 70c12-74 72-114 164-114s152 40 164 114" fill="#1F2937" />
          {/* laptop behind head, slightly offset */}
          <rect x="230" y="-14" width="168" height="104" rx="12" fill="#EEF2FF" />
          {/* head */}
          <circle cx="176" cy="-50" r="56" fill="#F3F4F6" />
          <path d="M140 -50c0-28 23-52 52-52s52 24 52 52" fill="#111827" />
          {/* headset */}
          <circle cx="130" cy="-44" r="16" fill="#0EA5E9" />
          <circle cx="222" cy="-44" r="16" fill="#0EA5E9" />
          <path d="M130 -44c12-14 24-22 44-22s32 8 44 22" stroke="#0EA5E9" strokeWidth="6" fill="none" />
          <rect x="236" y="-44" width="12" height="26" rx="6" fill="#0EA5E9" />
          <path d="M160 -6l18 22 18-22" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </svg>
  );
}

/* ====================== Page ====================== */
export default function Login({ onToggleForm, onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const actionData = useActionData();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validateForm = () => {
    const next = {};
    if (!formData.email) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      next.email = "Please enter a valid email address";
    if (!formData.password) next.password = "Password is required";
    else if (formData.password.length < 6)
      next.password = "Password must be at least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-2 bg-white antialiased">
      {/* LEFT: dynamic, minimal hero */}
      <div className="relative hidden lg:block overflow-hidden">
        <HeroSVGClean className="absolute inset-0 h-full w-full" />
      </div>

      {/* RIGHT: auth card */}
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Sign in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Form method="post" className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    autoComplete="email"
                    required
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Server error */}
              {actionData?.error && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> {actionData.error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading} aria-busy={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <p className="text-sm text-gray-600 text-center">
                Don&apos;t have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  className="px-0 font-normal"
                  onClick={onToggleForm}
                  disabled={isLoading}
                >
                  Create one here
                </Button>
              </p>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
