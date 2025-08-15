"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
} from "@dnd-kit/core";
import {
  useDraggable,
} from "@dnd-kit/core";

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

function formatTime(isoString: string) {
  return new Date(isoString).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

interface ArtistCardProps {
  set: UISet;
  isInMySchedule?: boolean;
  isDragging?: boolean;
}

function ArtistCard({ set, isInMySchedule = false, isDragging = false }: ArtistCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({ 
    id: set.id,
    data: { set }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        p-3 rounded-lg cursor-grab active:cursor-grabbing transition-colors
        ${isInMySchedule 
          ? 'bg-green-100 border-2 border-green-300 text-green-800' 
          : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
        }
        ${isDragging ? 'opacity-50 rotate-2' : ''}
      `}
    >
      <div className="font-semibold text-sm">{set.name}</div>
      <div className="text-xs opacity-70">
        {formatTime(set.startTime)} - {formatTime(set.endTime)}
      </div>
    </div>
  );
}

interface StageColumnProps {
  stageName: string;
  sets: UISet[];
  myScheduleSetIds: Set<string>;
}

function StageColumn({ stageName, sets, myScheduleSetIds }: StageColumnProps) {
  const sortedSets = useMemo(() => 
    sets.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [sets]
  );

  const { setNodeRef } = useDroppable({
    id: `stage-${stageName}`,
  });

  return (
    <div ref={setNodeRef} className="flex flex-col min-h-[500px]">
      <div className="sticky top-0 bg-gray-800 text-white p-3 rounded-t-lg font-semibold text-center">
        {stageName}
      </div>
      <div className="flex-1 bg-gray-50 p-3 space-y-2 rounded-b-lg border-2 border-gray-200">
        {sortedSets.map((set) => (
          <ArtistCard 
            key={set.id} 
            set={set} 
            isInMySchedule={myScheduleSetIds.has(set.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface MyScheduleColumnProps {
  myScheduleSets: UISet[];
}

function MyScheduleColumn({ myScheduleSets }: MyScheduleColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'my-schedule',
  });

  const sortedSets = useMemo(() => 
    myScheduleSets.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [myScheduleSets]
  );

  // Group by day
  const setsByDay = useMemo(() => {
    const groups: Record<string, UISet[]> = {};
    sortedSets.forEach(set => {
      const day = formatDate(set.date);
      if (!groups[day]) groups[day] = [];
      groups[day].push(set);
    });
    return groups;
  }, [sortedSets]);

  return (
    <div className="flex flex-col min-h-[500px] w-80">
      <div className="sticky top-0 bg-blue-600 text-white p-3 rounded-t-lg font-semibold text-center">
        My Schedule ({myScheduleSets.length})
      </div>
      <div 
        ref={setNodeRef}
        className={`
          flex-1 p-3 rounded-b-lg border-2 min-h-32 transition-colors
          ${isOver 
            ? 'bg-blue-100 border-blue-400 border-dashed' 
            : 'bg-blue-50 border-blue-300'
          }
        `}
      >
        {Object.keys(setsByDay).length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-lg mb-2">🎵</div>
            <p>Drag artists here to build your schedule!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(setsByDay).map(([day, sets]) => (
              <div key={day}>
                <h4 className="font-semibold text-blue-800 mb-2 border-b border-blue-200 pb-1">
                  {day}
                </h4>
                <div className="space-y-2">
                  {sets.map((set) => (
                    <ArtistCard key={set.id} set={set} isInMySchedule={true} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Planner({
    festival,
    sets,
    stages,
}: {
    festival: UIFestival;
    sets: UISet[];
    stages: string[];
}) {
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [myScheduleSetIds, setMyScheduleSetIds] = useState<Set<string>>(new Set());
    const [activeId, setActiveId] = useState<string | null>(null);

    // Get unique days from the festival
    const festivalDays = useMemo(() => {
        const days = new Set<string>();
        sets.forEach(set => {
            days.add(formatDate(set.date));
        });
        return Array.from(days).sort();
    }, [sets]);

    // Set default selected day
    useMemo(() => {
        if (!selectedDay && festivalDays.length > 0) {
            setSelectedDay(festivalDays[0]);
        }
    }, [festivalDays, selectedDay]);

    // Filter sets by selected day
    const setsForDay = useMemo(() => {
        if (!selectedDay) return sets;
        return sets.filter(set => formatDate(set.date) === selectedDay);
    }, [sets, selectedDay]);

    // Group sets by stage for the selected day
    const setsByStage = useMemo(() => {
        const groups: Record<string, UISet[]> = {};
        stages.forEach(stage => {
            groups[stage] = setsForDay.filter(set => set.stage === stage);
        });
        return groups;
    }, [setsForDay, stages]);

    // Get sets in my schedule
    const myScheduleSets = useMemo(() => 
        sets.filter(set => myScheduleSetIds.has(set.id)),
        [sets, myScheduleSetIds]
    );

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeSetId = active.id as string;
        
        // Check if we're dropping on "My Schedule" area
        if (over.id === 'my-schedule') {
            // Add to my schedule
            setMyScheduleSetIds(prev => new Set([...prev, activeSetId]));
        } else if (over.id && over.id.toString().startsWith('stage-')) {
            // Remove from my schedule (dropped back to stage)
            setMyScheduleSetIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(activeSetId);
                return newSet;
            });
        }
    }

    const activeSet = activeId ? sets.find(set => set.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-screen">
                {/* Fixed My Schedule Column on the Left */}
                <div className="flex-shrink-0 p-6 bg-gray-100 border-r-2 border-gray-300">
                    <MyScheduleColumn myScheduleSets={myScheduleSets} />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold">
                            {festival.name}
                        </h2>
                        <div className="text-sm text-gray-600">
                            {stages.length} stages • {sets.length} artists
                        </div>
                    </div>

                    {/* Day Selector */}
                    <div className="flex gap-2 justify-center flex-wrap mb-6">
                        {festivalDays.map(day => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={`
                                    px-4 py-2 rounded-full font-medium transition-all
                                    ${selectedDay === day 
                                        ? 'bg-blue-600 text-white shadow-lg' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }
                                `}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    {/* Stage Columns Grid */}
                    <div className="flex gap-4 overflow-x-auto pb-4 h-full">
                        {stages.map(stage => (
                            <div key={stage} className="flex-shrink-0 w-64">
                                <StageColumn 
                                    stageName={stage}
                                    sets={setsByStage[stage] || []}
                                    myScheduleSetIds={myScheduleSetIds}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold">{myScheduleSets.length}</div>
                            <div className="text-sm opacity-90">Artists in My Schedule</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold">{new Set(myScheduleSets.map(s => s.stage)).size}</div>
                            <div className="text-sm opacity-90">Stages Covered</div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold">{new Set(myScheduleSets.map(s => formatDate(s.date))).size}</div>
                            <div className="text-sm opacity-90">Days Planned</div>
                        </div>
                    </div>
                </div>
            </div>

            <DragOverlay>
                {activeSet ? (
                    <ArtistCard set={activeSet} isDragging={true} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}