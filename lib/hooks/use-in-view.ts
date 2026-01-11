
"use client";

import React, { useEffect, useState } from "react";

export function useInView<T extends HTMLElement>(
    ref: React.RefObject<T | null>
) {
    const [inView, setInView] = useState(true);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            {
                threshold: 0,
                rootMargin: "-80px 0px 0px 0px", // 👈 KEY PART
            }
        );

        observer.observe(ref.current);
        return () => observer.disconnect();
    });

    return inView;
}
