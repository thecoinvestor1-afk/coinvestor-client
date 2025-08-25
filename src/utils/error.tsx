"use client";

import React, { useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react";

type ErrorLayoutProps = {
    background?: string;
    endTime?: Date | string;
    image?: string | { src: string };
    heading: string;
    subHeading: string;
    paragraph: string;
    errorType: "403" | "404" | "500" | "503";
};

const ErrorLayoutContent: React.FC<ErrorLayoutProps> = (props) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLDivElement | null>(null);
    const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

    const ActionCards = [
        {
            title: "Dashboard",
            description:
                "Return to your portfolio overview and track your earnings.",
            href: "/dashboard",
        },
        {
            title: "Support Center",
            description:
                "Need help? Our team is ready to guide you with any issue.",
            href: "/support",
        },
        {
            title: "System Status",
            description:
                "Real-time uptime monitoring – we keep your investments safe.",
            href: "/status",
        },
    ];

    useEffect(() => {
        if (typeof window !== "undefined" && window.gsap) {
            gsap.from(titleRef.current, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power2.out",
            });

            if (cardsRef.current.length > 0) {
                gsap.from(cardsRef.current, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out",
                    delay: 0.5,
                });
            }
        }
    }, []);

    const cardsToRender = ActionCards;

    return (
        <main
            ref={containerRef}
            className="w-full mt-5 lg:mt-10 py-0 lg:py-30 text-center mx-auto flex items-start justify-start bg-background bg-contain bg-center bg-no-repeat"
            style={{
                backgroundImage: props.image
                    ? `url(${typeof props.image === "object" && "src" in props.image
                        ? props.image.src
                        : props.image
                    })`
                    : "none",
            }}
        >
            <div
                ref={titleRef}
                className="text-center relative top-[-10px] md:top-[-16px] lg:top-[-20px] container flex flex-col justify-start space-y-4 max-w-8xl mx-auto"
            >
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    {props.errorType}
                </h1>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    {props.heading}
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white">
                    {props.subHeading}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white opacity-80 leading-relaxed">
                    {props.paragraph}
                </p>

                {cardsToRender.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
                        {cardsToRender.map((card, index) => (
                            <div
                                key={index}
                                ref={(el) => {
                                    cardsRef.current[index] = el;
                                }}
                                className="bg-primary bg-opacity-80 backdrop-blur-sm rounded-lg p-4 sm:p-6 space-y-4 border border-gray-700 hover:bg-gray-700 transition-all duration-300 group cursor-pointer"
                            >
                                <Link href={card.href || "#"} className="block">
                                    <div className="flex flex-col h-full justify-between min-h-[150px]">
                                        <div className="flex-1">
                                            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-start text-white">
                                                {card.title}
                                            </h3>
                                            <p className="text-sm sm:text-base tracking-wide text-start w-[80%] leading-6 text-gray-300">
                                                {card.description}
                                            </p>
                                        </div>
                                        <div className="mt-4 w-10 h-10 flex items-center justify-center rounded-full bg-black ml-auto">
                                            <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-1 transition-all duration-300" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

const ErrorLayout = ({
    background,
    endTime,
    image,
    heading,
    subHeading,
    paragraph,
    errorType,
}: ErrorLayoutProps) => {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-black flex items-center justify-center text-white">
                    <div className="text-lg">Loading...</div>
                </div>
            }
        >
            <ErrorLayoutContent
                background={background}
                image={image}
                endTime={endTime}
                heading={heading}
                subHeading={subHeading}
                paragraph={paragraph}
                errorType={errorType}
            />
        </Suspense>
    );
};

export default ErrorLayout;
