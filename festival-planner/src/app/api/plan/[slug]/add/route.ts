// src/app/api/plan/[slug]/add/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

// Define the shape you expect from the client
const AddSetSchema = z.object({
    setId: z.string().min(1),
    artist: z.string().min(1),
    stage: z.string().min(1),
    start: z.string().min(1), // ISO or HH:mm – your choice
    end: z.string().min(1),
});

type AddSetInput = z.infer<typeof AddSetSchema>;

function errorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    try {
        return JSON.stringify(err);
    } catch {
        return String(err);
    }
}

export async function POST(
    req: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const json = (await req.json()) as unknown;
        const body = AddSetSchema.parse(json); // runtime validation

        const { slug } = params;
        const input: AddSetInput = body;

        // TODO: persist to DB using the authenticated user
        // await db.plan.upsert({ ... })

        return NextResponse.json({ ok: true, slug, set: input }, { status: 200 });
    } catch (err: unknown) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to add set", detail: errorMessage(err) },
            { status: 500 }
        );
    }
}
