"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface CountUpProps {
    to: number;
    from?: number;
    direction?: "up" | "down";
    delay?: number;
    duration?: number;
    className?: string;
    startWhen?: boolean;
    separator?: string;
    decimals?: number;
    decimal?: string;
    prefix?: string;
    suffix?: string;
    onStart?: () => void;
    onEnd?: () => void;
}

export default function CountUp({
    to,
    from = 0,
    direction = "up",
    delay = 0,
    duration = 2, // seconds
    className,
    startWhen = true,
    separator = ".",
    decimals = 0,
    decimal = ",",
    prefix = "",
    suffix = "",
    onStart,
    onEnd,
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === "down" ? to : from);

    // Default spring-based animation
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });

    const isInView = useInView(ref, { once: true, margin: "0px" });

    useEffect(() => {
        if (isInView && startWhen) {
            if (typeof onStart === "function") onStart();

            const timeoutId = setTimeout(() => {
                motionValue.set(direction === "down" ? from : to);
            }, delay * 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                const options = {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                };

                const formattedNumber = Intl.NumberFormat("pt-BR", options).format(
                    Number(latest.toFixed(decimals))
                );

                let content = formattedNumber;
                if (separator !== ".") {
                    content = content.replace(/\./g, separator);
                }
                if (decimal !== ",") {
                    content = content.replace(/,/g, decimal);
                }

                ref.current.textContent = `${prefix}${content}${suffix}`;
            }

            if (latest === (direction === "down" ? from : to)) {
                if (typeof onEnd === "function") onEnd();
            }
        });
    }, [springValue, decimals, decimal, separator, prefix, suffix, direction, from, to, onEnd]);

    return <span className={className} ref={ref} />;
}
