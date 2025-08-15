// src/app/api/ical/[planId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createEvents, type EventAttributes } from "ics";
import { format } from "date-fns";

// Helper to produce the exact tuple type ICS expects
function toDT5(d: Date): [number, number, number, number, number] {
    return [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()];
}

export async function GET(_: Request, { params }: { params: { planId: string } }) {
    const plan = await prisma.plan.findUnique({
        where: { id: params.planId },
        include: {
            items: {
                include: {
                    set: { include: { stage: true, festival: true } }
                }
            }
        }
    });

    if (!plan) return new NextResponse("Not found", { status: 404 });

    const events: EventAttributes[] = plan.items.map(({ set }) => {
        const start = new Date(set.startTime);
        const end = new Date(set.endTime);

        const startTuple = toDT5(start);
        const endTuple = toDT5(end);

        return {
            title: `${set.artist} @ ${set.stage.name}`,
            start: startTuple,
            end: endTuple,
            description: `${set.festival.name} • ${format(new Date(set.date), "PP")}`,
            location: set.festival.location ?? "",
            status: "CONFIRMED",
            // You can also set uid/url/alarms/etc. here if you like
        };
    });

    // Put productId (and optional calName/timezone) in the options object
    const { error, value } = createEvents(events, {
        productId: "FestivalPlanner",
        // calName: plan.name ?? "Festival Schedule",
        // method: "PUBLISH",
        // timezone: "America/Chicago",
    });

    if (error || !value) return new NextResponse("Failed to generate ICS", { status: 500 });

    return new NextResponse(value, {
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": `attachment; filename="${(plan.name ?? "schedule")
                .replace(/[^a-z0-9-_]/gi, "_")
                .toLowerCase()}.ics"`,
        },
    });
}