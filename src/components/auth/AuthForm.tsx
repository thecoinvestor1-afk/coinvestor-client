"use client";
import React, { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { gsap } from "gsap";
import { authClient } from "@/lib/auth-client";
import SignInForm from "@/components/auth/SignInForm";
import RegistrationForm from "@/components/auth/RegistrationForm";
import { AuthFormProps } from "@/types/auth";

export default function AuthForm({
  pathname,
  isDarkMode = false,
}: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  // Timer state for OTP resend
  const [countdown, setCountdown] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // GSAP refs for animations
  const formRef = useRef<HTMLDivElement>(null);
  const emailSectionRef = useRef<HTMLDivElement>(null);
  const otpSectionRef = useRef<HTMLDivElement>(null);
  const infoSectionRef = useRef<HTMLDivElement>(null);

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

  // GSAP animation functions
  const animateToOtp = () => {
    const timeline = gsap.timeline();

    timeline
      .to(emailSectionRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: "power2.inOut",
      })
      .set(emailSectionRef.current, { display: "none" })
      .set(infoSectionRef.current, { display: "block", opacity: 0, y: 10 })
      .set(otpSectionRef.current, { display: "block", opacity: 0, y: 10 })
      .to(infoSectionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.inOut",
      })
      .to(otpSectionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.inOut",
        delay: 0.1,
      });
  };

  const animateBackToEmail = () => {
    const timeline = gsap.timeline();

    timeline
      .to([infoSectionRef.current, otpSectionRef.current], {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: "power2.inOut",
      })
      .set([infoSectionRef.current, otpSectionRef.current], { display: "none" })
      .set(emailSectionRef.current, { display: "block", opacity: 0, y: 10 })
      .to(emailSectionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.inOut",
      });
  };

  // // Format time to display mm:ss
  // const formatTime = (seconds: number) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins.toString().padStart(2, "0")}:${secs
  //     .toString()
  //     .padStart(2, "0")}`;
  // };

  // Google Sign In handler
  const signInWithGoogle = async () => {
    setIsLoading(true);
    setLoadingText("Signing in with Google...");

    try {
      const data = await authClient.signIn.social(
        {
          provider: "google",
        },
        {
          onSuccess: (ctx) => {
            console.log("Google signin successful");
            router.push("/profiles");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (error) {
      console.error("Google signin error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingText("Loading...");
    }
  };

  // const handleSubmit = async (
  //   e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  // ) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setLoadingText("Signing in...");

  //   const firstName = firstNameRef.current?.value || "";
  //   const lastName = lastNameRef.current?.value || "";
  //   const password = passwordRef.current?.value || "";

  //   try {
  //     if (pathname === "sign-up") {
  //       const { data, error } = await authClient.signUp.email(
  //         {
  //           email,
  //           password,
  //           name: `${firstName} ${lastName}`,
  //           callbackURL: "/profiles",
  //         },
  //         {
  //           onRequest: () => {
  //             setIsLoading(true);
  //             setLoadingText("Signing up...");
  //           },
  //           onSuccess: () => {
  //             console.log("Signup successful");
  //           },
  //           onError: (ctx) => {
  //             alert(ctx.error.message);
  //           },
  //         }
  //       );
  //     } else {
  //       // Handle sign in logic here
  //     }
  //   } catch (err) {
  //     console.error("Auth error:", err);
  //     alert("Authentication failed. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //     setLoadingText("Loading...");
  //   }
  // };

  const handleGenerateOtp = async (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    setLoadingText("Sending OTP...");

    try {
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
      if (error) {
        console.error("Error generating OTP:", error);
        toast.error("Failed to generate OTP. Please try again.");
      } else {
        console.log("OTP sent to email:", data);
        toast.success("OTP sent to your email. Please check your inbox.");
        setIsOtpSent(true);
        setCountdown(60);
        setIsTimerActive(true);
        animateToOtp();
      }
    } catch (err) {
      console.error("Error generating OTP:", err);
      toast.error("Failed to generate OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingText("Verifying OTP...");

    try {
      await authClient.signIn.emailOtp(
        {
          email,
          otp: otp,
        },
        {
          onSuccess: (ctx) => {
            console.log("OTP verification successful");
            router.push("/profiles");
          },
        }
      );
    } catch (err) {
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setIsOtpSent(false);
    setCountdown(0);
    setIsTimerActive(false);
    setOtp("");
    animateBackToEmail();
  };

  // Handler for direct email/password login
  const handleDirectLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setLoadingText("Signing in...");

    try {
      await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onSuccess: (ctx) => {
            console.log("Direct login successful");
            toast.success("Successfully signed in!");
            router.push("/profiles");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    } catch (error) {
      console.error("Direct login error:", error);
      toast.error("Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
      setLoadingText("Loading...");
    }
  };

  // Handler for sending OTP
  const handleSendOtp = async (email: string) => {
    setEmail(email);
    const fakeEvent = {
      preventDefault: () => { },
    } as unknown as React.FormEvent<HTMLFormElement>;
    await handleGenerateOtp(fakeEvent);
  };

  // Handler for verifying OTP from SignInForm
  const handleVerifyOtpFromSignIn = async (email: string, otpValue: string) => {
    setEmail(email);
    setOtp(otpValue);
    const fakeEvent = {
      preventDefault: () => { },
    } as unknown as React.FormEvent<HTMLFormElement>;
    await handleVerifyOtp(fakeEvent);
  };

  // Handler for going back to email input
  const handleBackToEmailInput = () => {
    setIsOtpSent(false);
    setCountdown(0);
    setIsTimerActive(false);
    setOtp("");
  };

  // Handler for email changes from SignInForm
  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  return pathname === "sign-in" ? (
    <SignInForm
      isDarkMode={isDarkMode}
      email={email}
      isLoading={isLoading}
      otpSent={isOtpSent}
      onEmailChange={handleEmailChange}
      onGoogleSignIn={signInWithGoogle}
      onDirectLogin={handleDirectLogin}
      onSendOtp={handleSendOtp}
      onVerifyOtp={handleVerifyOtpFromSignIn}
      onBackToEmail={handleBackToEmailInput}
    />
  ) : (
    <RegistrationForm />
  );
}
