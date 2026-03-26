import { useReducedMotion } from "framer-motion";

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
            {/* Static decorative map pins — no JS animation, uses CSS instead */}
            {FLOATING_PINS.map((pin, i) => (
                <div
                    key={i}
                    className="absolute"
                    style={{
                        left: pin.x,
                        top: pin.y,
                        opacity: 0.2,
                        animation: reduceMotion
                            ? 'none'
                            : `floatPin 4s ease-in-out ${pin.delay}s infinite`,
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
                </div>
            ))}
        </div>
    );
}
