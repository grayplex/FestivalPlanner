import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
    try {
        const festivals = await prisma.festival.findMany({
            select: {
                slug: true,
                name: true,
                city: true,
                country: true,
                startDate: true,
                endDate: true,
                imageUrl: true,
            },
            orderBy: {
                startDate: 'asc',
            },
        });

        // Convert dates to ISO strings for serialization
        return festivals.map(festival => ({
            ...festival,
            city: festival.city ?? undefined,
            country: festival.country ?? undefined,
            imageUrl: festival.imageUrl ?? undefined,
            startDate: festival.startDate?.toISOString(),
            endDate: festival.endDate?.toISOString(),
        }));
    } catch (error) {
        console.error('Error fetching festivals:', error);
        return [];
    }
}

export default async function FestivalsPage() {
    const festivals = await getFestivals();

    return (
        <main className="max-w-5xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Upcoming Festivals</h1>

            {festivals.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600 mb-4">No festivals found</p>
                    <p className="text-gray-500">
                        Check your database connection or add some festivals to get started.
                    </p>
                </div>
            ) : (
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {festivals.map((festival: Festival) => (
                        <li
                            key={festival.slug}
                            className="rounded-2xl border p-4 hover:shadow-md transition"
                        >
                            <Link href={`/festivals/${festival.slug}`} className="block space-y-2">
                                {festival.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={festival.imageUrl}
                                        alt={festival.name}
                                        className="w-full h-36 object-cover rounded-xl"
                                    />
                                ) : (
                                    <div className="w-full h-36 bg-gray-200 rounded-xl flex items-center justify-center">
                                        <span className="text-gray-500">No Image</span>
                                    </div>
                                )}

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
            )}
        </main>
    );
}