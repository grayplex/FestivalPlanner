// src/app/api/plan/[slug]/remove/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

const RemoveSetSchema = z.object({
    setId: z.string().min(1),
});

type RemoveSetInput = z.infer<typeof RemoveSetSchema>;

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
        const body = RemoveSetSchema.parse(json);

        const { slug } = params;
        const input: RemoveSetInput = body;

        // TODO: remove from DB for the authenticated user
        // await db.plan.remove({ slug, setId: input.setId, userId })

        return NextResponse.json({ ok: true, slug, removed: input.setId }, { status: 200 });
    } catch (err: unknown) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to remove set", detail: errorMessage(err) },
            { status: 500 }
        );
    }
}
