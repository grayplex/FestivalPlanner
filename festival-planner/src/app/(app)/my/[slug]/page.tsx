import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Props = { params: { slug: string } };

export default async function MyPlanPage({ params }: Props) {
    const session = await getServerSession();
    if (!session?.user?.email) redirect("/api/auth/signin?callbackUrl=/");

    const festival = await prisma.festival.findUnique({
        where: { slug: params.slug },
    });
    if (!festival) notFound();

    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
        select: { id: true, name: true },
    });
    if (!user) redirect("/api/auth/signin?callbackUrl=/");

    // Find or create a plan for this user+festival to make the page robust
    let plan = await prisma.plan.findFirst({
        where: { userId: user.id, festivalId: festival.id },
        include: {
            items: {
                include: {
                    set: { include: { stage: true } },
                },
            },
        },
    });

    if (!plan) {
        plan = await prisma.plan.create({
            data: { userId: user.id, festivalId: festival.id, name: "My Plan" },
            include: {
                items: { include: { set: { include: { stage: true } } } },
            },
        });
    }

    const items = [...plan.items].sort(
        (a, b) =>
            new Date(a.set.startTime).getTime() - new Date(b.set.startTime).getTime()
    );

    return (
        <main className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-baseline justify-between gap-4">
                <h1 className="text-3xl font-bold">
                    {festival.name}: {plan.name ?? "My Plan"}
                </h1>
                <Link
                    className="underline"
                    href={`/api/ical/${plan.id}`}
                    title="Export iCal"
                >
                    Export .ics
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="rounded-xl border p-6">
                    <p className="mb-2">
                        You haven’t added any sets yet for this festival.
                    </p>
                    <Link className="underline" href={`/festivals/${festival.slug}`}>
                        Browse the schedule
                    </Link>
                </div>
            ) : (
                <ul className="space-y-3">
                    {items.map((pi) => {
                        const s = pi.set;
                        const start = new Date(s.startTime);
                        const end = new Date(s.endTime);
                        return (
                            <li
                                key={pi.id}
                                className="border rounded-xl p-4 flex items-center justify-between"
                            >
                                <div>
                                    <div className="font-semibold">{s.artist}</div>
                                    <div className="text-sm opacity-80">
                                        {s.stage.name} •{" "}
                                        {start.toLocaleDateString()} {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                                        {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                </div>

                                <form
                                    action={`/api/plan/${festival.slug}/remove`}
                                    method="POST"
                                >
                                    <input type="hidden" name="setId" value={s.id} />
                                    <button
                                        className="text-sm underline"
                                        type="submit"
                                        aria-label={`Remove ${s.artist}`}
                                    >
                                        Remove
                                    </button>
                                </form>
                            </li>
                        );
                    })}
                </ul>
            )}
        </main>
    );
}
