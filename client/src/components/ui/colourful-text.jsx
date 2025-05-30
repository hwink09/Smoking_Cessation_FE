"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function ColourfulText({ text }) {
    const colors = [
        "#6a5af9",
        "#736dfc",
        "#7f81fd",
        "#8c95fd",
        "#99a9fd",
        "#a6bdfd",
        "#b3d0fc",
        "#c1e3fa",
        "#cdf0f9",
        "#1ecbe1"
    ];

    const [currentColors, setCurrentColors] = useState(colors);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const shuffled = [...colors].sort(() => Math.random() - 0.5);
            setCurrentColors(shuffled);
            setCount((prev) => prev + 1);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return text.split("").map((char, index) => (
        <motion.span
            key={`${char}-${count}-${index}`}
            initial={{ y: 0 }}
            animate={{
                color: currentColors[index % currentColors.length],
                y: [0, -3, 0],
                scale: [1, 1.01, 1],
                filter: ["blur(0px)", "blur(5px)", "blur(0px)"],
                opacity: [1, 0.8, 1],
            }}
            transition={{
                duration: 0.5,
                delay: index * 0.05,
            }}
            className="inline-block whitespace-pre font-sans tracking-tight"
        >
            {char}
        </motion.span>
    ));
}
