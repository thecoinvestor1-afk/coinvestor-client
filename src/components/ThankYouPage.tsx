"use client";

// --core
import React, { useEffect, useRef } from "react";

// --libs
import { useSession } from "@/lib/auth-client";

// --components
import { Button } from "@components/ui/button";

const ThankYouPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.opacity = "0";
      titleRef.current.style.transform = "translateY(50px)";

      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.style.transition = "all 1s ease-out";
          titleRef.current.style.opacity = "1";
          titleRef.current.style.transform = "translateY(0)";
        }
      }, 100);
    }
  }, []);

  return (
    <main
      ref={containerRef}
      className="flex bg-background text-white justify-center items-center h-[calc(100vh-80px)]"
      role="main"
      aria-label="Thank You Confirmation Page"
    >
      <section
        className="container h-[80%] pt-16 flex  justify-center bg-contain bg-center bg-no-repeat bg-[url('/static/brand/logo-icon-blue.svg')]"
        aria-label="Background logo section"
      >
        <div className="relative z-10">
          <header
            ref={titleRef}
            className="text-center space-y-8 max-w-8xl mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold ">
              Thank You, {name}!
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium">
              Take a deep breath & relax
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-70 leading-relaxed max-w-4xl mx-auto">
              We&apos;ve sent an email to <strong>{email}</strong> with
              everything you need to know about your purchase.
            </p>
            <Button
              variant="default"
              className="rounded-full text-md font-semibold px-8 py-6 text-white"
              aria-label="Access your dashboard"
            >
              Access your dashboard
            </Button>
          </header>
        </div>
      </section>
    </main>
  );
};

export default ThankYouPage;
