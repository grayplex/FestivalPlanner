import { prisma } from "@/lib/prisma";
import Planner, { UISet, UIFestival } from "./Planner";

type StageRow = { name: string };
type SetRow = {
  id: string;
  artist: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  stage: { name: string };
};

export default async function FestivalPage({
  params,
}: {
  params: { slug: string };
}) {
  const festival = await prisma.festival.findUnique({
    where: { slug: params.slug },
    include: {
      stages: true,
      sets: { include: { stage: true } },
    },
  });

  if (!festival) {
    return <div className="p-6">Not found</div>;
  }

  const uiFestival: UIFestival = {
    id: festival.id,
    name: festival.name,
    slug: festival.slug,
    startDate: festival.startDate.toISOString(),
    endDate: festival.endDate.toISOString(),
  };

  const sets: UISet[] = (festival.sets as unknown as SetRow[]).map((s) => ({
    id: s.id,
    name: s.artist,
    date: new Date(s.date).toISOString(),
    startTime: new Date(s.startTime).toISOString(),
    endTime: new Date(s.endTime).toISOString(),
    stage: s.stage.name,
  }));

  const stageNames: string[] = (festival.stages as unknown as StageRow[]).map(
    (s) => s.name
  );

  return <Planner festival={uiFestival} sets={sets} stages={stageNames} />;
}
