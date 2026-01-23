"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface CountdownTimerProps {
    targetDate: Date;
    label?: string;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <motion.div
                key={value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass px-4 py-3 md:px-6 md:py-4 rounded-xl min-w-[60px] md:min-w-[80px]"
            >
                <span className="text-2xl md:text-4xl font-bold gradient-text">
                    {value.toString().padStart(2, "0")}
                </span>
            </motion.div>
            <span className="text-[10px] md:text-xs text-white/50 uppercase tracking-wider mt-2">
                {label}
            </span>
        </div>
    );
}

function Separator() {
    return (
        <div className="flex flex-col justify-center gap-2 px-1">
            <div className="w-1.5 h-1.5 bg-una-gold/60 rounded-full animate-pulse" />
            <div className="w-1.5 h-1.5 bg-una-gold/60 rounded-full animate-pulse" />
        </div>
    );
}

export default function CountdownTimer({ targetDate, label = "Tiempo restante para la graduación" }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        const calculateTimeLeft = (): TimeLeft => {
            const difference = targetDate.getTime() - new Date().getTime();
            
            if (difference <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!mounted) {
        return null;
    }

    const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

    if (isExpired) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                <div className="glass px-8 py-4 rounded-2xl inline-block">
                    <span className="text-2xl md:text-3xl font-bold gradient-text">
                        🎓 ¡Es el gran día! 🎓
                    </span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
        >
            <p className="text-xs md:text-sm text-white/50 uppercase tracking-widest mb-4">
                {label}
            </p>
            <div className="flex items-center justify-center gap-1 md:gap-2">
                <TimeUnit value={timeLeft.days} label="Días" />
                <Separator />
                <TimeUnit value={timeLeft.hours} label="Horas" />
                <Separator />
                <TimeUnit value={timeLeft.minutes} label="Min" />
                <Separator />
                <TimeUnit value={timeLeft.seconds} label="Seg" />
            </div>
        </motion.div>
    );
}
