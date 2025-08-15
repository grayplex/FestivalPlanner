"use client";

import { useMemo } from "react";

export type UISet = {
    id: string;
    name: string;
    date: string;       // ISO string (e.g., "2025-08-29T00:00:00.000Z")
    startTime: string;  // ISO string
    endTime: string;    // ISO string
    stage: string;
};

export type UIFestival = {
    id: string;
    name: string;
    slug: string;
    startDate: string;  // ISO string
    endDate: string;    // ISO string
};

export default function Planner({
    festival,
    sets,
    stages,
}: {
    festival: UIFestival;
    sets: UISet[];
    stages: string[];
}) {
    // You can port your Festival.html UI here. For now, a stub so TypeScript is happy.
    const dayCounts = useMemo(() => {
        const byDay: Record<string, number> = {};
        for (const s of sets) {
            const d = new Date(s.date).toISOString().slice(0, 10);
            byDay[d] = (byDay[d] ?? 0) + 1;
        }
        return byDay;
    }, [sets]);

    return (
        <div className="p-6 space-y-3">
            <h2 className="text-2xl font-semibold">
                {festival.name} — {stages.length} stages • {sets.length} sets
            </h2>
            <div className="text-sm opacity-70">
                {Object.entries(dayCounts).map(([d, n]) => (
                    <div key={d}>
                        {d}: {n} sets
                    </div>
                ))}
            </div>

            {/* TODO: replace this with your ported grid from Festival.html */}
            <div className="rounded-xl border p-4">
                <p>Planner UI goes here.</p>
            </div>
        </div>
    );
}
