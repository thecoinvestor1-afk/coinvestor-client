// --core
import React, { useEffect, useState } from "react";
import Link from "next/link";

//--components
// import Logo from "@components/Logo";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";

// --icons
import { CaretLeftIcon } from "@phosphor-icons/react";

// --types
import { SignInFormProps } from "@/types/auth";

export default function SignInForm({
  onEmailChange,
  onGoogleSignIn,
  onDirectLogin,
  onSendOtp,
  onVerifyOtp,
  isLoading: externalLoading = false,
  email: externalEmail = "",
  otpSent = false,
  onBackToEmail,
}: SignInFormProps) {
  const [email, setEmail] = useState(externalEmail);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Use external loading state if provided
  const loading = externalLoading || isLoading;

  // Timer effect for OTP resend countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isTimerActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsTimerActive(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, isTimerActive]);

  // Start countdown when OTP is sent
  useEffect(() => {
    if (otpSent && !isTimerActive) {
      setCountdown(60);
      setIsTimerActive(true);
    }
  }, [otpSent]);

  // Format time to display mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    onEmailChange?.(newEmail);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const handleContinue = () => {

    if (onSendOtp) {
      onSendOtp(email);
    } else {
      // Fallback OTP simulation
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        console.log("OTP sent to:", email);
      }, 2000);
    }

  };

  const handleVerifyOtp = () => {
    if (onVerifyOtp) {
      onVerifyOtp(email, otp);
    } else {
      // Fallback OTP verification simulation
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        console.log("OTP verified:", otp);
      }, 2000);
    }
  };

  const handleBackToEmail = () => {
    setOtp("");
    if (onBackToEmail) {
      onBackToEmail();
    }
  };

  const handleResendOtp = () => {
    if (onSendOtp && !isTimerActive) {
      onSendOtp(email);
    }
  };

  const handleGoogleSignIn = () => {
    if (onGoogleSignIn) {
      onGoogleSignIn();
    } else {
      console.log("Google sign in clicked");
    }
  };

  return (
    <div className="min-h-screen container w-full bg-black flex pt-20  justify-center p-4">
      <div className="w-full max-w-md">

        <div className="fixed  top-10 left-10  z-50">
          {/* <Logo variant="largeWhite" href="/" /> */}
        </div>

        {/* <h1 className="text-white text-2xl font-semibold mb-2">Sign In</h1> */}

        <div className="space-y-6 ">
          {otpSent ? (
            <>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBackToEmail}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  <CaretLeftIcon className="w-6 h-6" />
                </button>
                <div>
                  <p className="text-gray-300 text-sm">We sent a code to</p>
                  <p className="text-white font-medium">{email}</p>
                </div>
              </div>

              {/* OTP Input */}
              <div>
                <Label
                  htmlFor="otp"
                  className="block text-gray-300 text-sm mb-2"
                >
                  Enter verification code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                />
              </div>

              {/* Verify Button */}
              <Button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full bg-primary hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Code"
                )}
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-2">
                  Didn&apos;t receive the code?
                </p>
                {isTimerActive ? (
                  <p className="text-gray-400 text-sm">
                    Resend code in {formatTime(countdown)}
                  </p>
                ) : (
                  <Button
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium disabled:text-gray-500"
                  >
                    Resend code
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Email Input */}
              <div>
                <Label
                  htmlFor="email"
                  className="block text-gray-300 text-sm mb-2"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="name@admitvault.com"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button
                onClick={handleContinue}
                disabled={
                  loading
                }
                className="w-full bg-primary hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </>
          )}


          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">OR</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed text-black font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
