import Link from "next/link";

type Festival = {
    slug: string;
    name: string;
    city?: string;
    country?: string;
    startDate?: string; // ISO
    endDate?: string;   // ISO
    imageUrl?: string;
};

async function getFestivals(): Promise<Festival[]> {
    // If you already have an API route, point to it; otherwise swap for your data source.
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/festivals`, {
        // In the App Router you usually want to revalidate or cache explicitly.
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        // Fallback to empty list on error — or throw to show Error Boundary.
        return [];
    }

    const data: unknown = await res.json();
    // Minimal runtime guard to keep TS happy even if API changes:
    if (!Array.isArray(data)) return [];
    return data as Festival[];
}

export default async function FestivalsPage() {
    const festivals = await getFestivals();

    return (
        <main className="max-w-5xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Upcoming Festivals</h1>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {festivals.map((festival: Festival) => (
                    <li
                        key={festival.slug}
                        className="rounded-2xl border p-4 hover:shadow-md transition"
                    >
                        <Link href={`/my/${festival.slug}`} className="block space-y-2">
                            {festival.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={festival.imageUrl}
                                    alt={festival.name}
                                    className="w-full h-36 object-cover rounded-xl"
                                />
                            ) : null}

                            <div>
                                <h2 className="text-xl font-semibold">{festival.name}</h2>
                                <p className="text-sm text-muted-foreground">
                                    {[festival.city, festival.country].filter(Boolean).join(", ")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {festival.startDate
                                        ? new Date(festival.startDate).toLocaleDateString()
                                        : ""}
                                    {festival.endDate
                                        ? ` – ${new Date(festival.endDate).toLocaleDateString()}`
                                        : ""}
                                </p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
