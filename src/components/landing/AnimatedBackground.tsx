import { motion, useReducedMotion } from "framer-motion";

const FLOATING_PINS = [
    { x: "12%", y: "20%", delay: 0, size: 10 },
    { x: "85%", y: "15%", delay: 1.2, size: 8 },
    { x: "70%", y: "70%", delay: 0.6, size: 12 },
    { x: "25%", y: "75%", delay: 1.8, size: 9 },
    { x: "50%", y: "40%", delay: 0.3, size: 7 },
];

export default function AnimatedBackground() {
    const reduceMotion = useReducedMotion();

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Gradient blobs */}
            <motion.div
                className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#4a7c59]/[0.04] blur-3xl"
                animate={reduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#d4a96a]/[0.05] blur-3xl"
                animate={reduceMotion ? {} : { scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#4a7c59]/[0.03] blur-3xl"
                animate={reduceMotion ? {} : { scale: [1, 1.2, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />

            {/* Floating pulsing map pins */}
            {FLOATING_PINS.map((pin, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{ left: pin.x, top: pin.y }}
                    animate={
                        reduceMotion
                            ? { opacity: 0.2 }
                            : {
                                y: [0, -8, 0],
                                opacity: [0.15, 0.35, 0.15],
                            }
                    }
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: pin.delay,
                    }}
                >
                    <svg
                        width={pin.size * 2}
                        height={pin.size * 2.5}
                        viewBox="0 0 24 30"
                        fill="none"
                    >
                        <path
                            d="M12 0C5.373 0 0 5.373 0 12c0 9 12 18 12 18s12-9 12-18C24 5.373 18.627 0 12 0z"
                            fill="#4a7c59"
                            fillOpacity="0.3"
                        />
                        <circle cx="12" cy="11" r="4" fill="#4a7c59" fillOpacity="0.5" />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}
