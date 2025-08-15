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

// Calculate position and height based on time
function getTimePosition(startTime: string, endTime: string, dayStart: Date, dayEnd: Date) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const totalDayMinutes = (dayEnd.getTime() - dayStart.getTime()) / (1000 * 60);
  const startMinutes = (start.getTime() - dayStart.getTime()) / (1000 * 60);
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  
  const topPercent = (startMinutes / totalDayMinutes) * 100;
  const heightPercent = (durationMinutes / totalDayMinutes) * 100;
  
  return {
    top: `${Math.max(0, topPercent)}%`,
    height: `${Math.max(2, heightPercent)}%`, // Minimum 2% height for visibility
  };
}

interface ArtistCardProps {
  set: UISet;
  isInMySchedule?: boolean;
  isDragging?: boolean;
  timePosition?: { top: string; height: string };
  hasConflict?: boolean;
  onRemove?: (setId: string) => void;
  isInStageColumn?: boolean;
}

function ArtistCard({ set, isInMySchedule = false, isDragging = false, timePosition, hasConflict = false, onRemove, isInStageColumn = false }: ArtistCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({ 
    id: isInStageColumn ? set.id : `schedule-${set.id}`,
    data: { set },
    disabled: !isInStageColumn // Only stage cards are draggable
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    ...(isInStageColumn ? timePosition : {}),
  } : (isInStageColumn ? timePosition : {});

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      onRemove(set.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        p-2 rounded-lg transition-colors
        text-xs overflow-hidden group
        ${isInMySchedule 
          ? hasConflict
            ? 'bg-orange-100 border-2 border-orange-400 text-orange-800'
            : 'bg-green-100 border-2 border-green-300 text-green-800'
          : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'
        }
        ${isDragging ? 'opacity-50 rotate-2' : ''}
        ${isInStageColumn ? 'cursor-grab active:cursor-grabbing absolute left-1 right-1' : 'relative cursor-default'}
      `}
      {...(isInStageColumn ? { ...attributes, ...listeners } : {})}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{set.name}</div>
          <div className="opacity-70 text-xs">
            {formatTime(set.startTime)} - {formatTime(set.endTime)}
          </div>
          {hasConflict && (
            <div className="text-xs text-orange-600 font-medium mt-1">
              ⚠️ Time Conflict
            </div>
          )}
        </div>
        
        {!isInStageColumn && onRemove && (
          <button
            onClick={handleRemoveClick}
            className="ml-2 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 w-6 h-6"
            title="Remove from schedule"
            style={{ minHeight: 'calc(100% - 8px)', margin: '4px 0' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

interface TimelineProps {
  dayStart: Date;
  dayEnd: Date;
}

function Timeline({ dayStart, dayEnd }: TimelineProps) {
  const timeSlots = useMemo(() => {
    const slots = [];
    const current = new Date(dayStart);
    
    while (current <= dayEnd) {
      slots.push(new Date(current));
      current.setHours(current.getHours() + 1);
    }
    
    return slots;
  }, [dayStart, dayEnd]);

  const totalMinutes = (dayEnd.getTime() - dayStart.getTime()) / (1000 * 60);

  return (
    <div className="relative w-16 flex-shrink-0 bg-gray-100 border-r-2 border-gray-300">
      <div className="sticky top-0 bg-gray-800 text-white p-3 text-center font-semibold text-sm z-20">
        Time
      </div>
      <div className="relative h-full min-h-[600px] bg-gray-100">
        {timeSlots.map((time) => {
          const minutesFromStart = (time.getTime() - dayStart.getTime()) / (1000 * 60);
          const topPercent = (minutesFromStart / totalMinutes) * 100;
          
          return (
            <div
              key={time.toISOString()}
              className="absolute left-0 right-0 border-t border-gray-300 flex items-center justify-center z-10"
              style={{ top: `${topPercent}%` }}
            >
              <div className="bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                {formatTime(time.toISOString())}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface StageColumnProps {
  stageName: string;
  sets: UISet[];
  myScheduleSetIds: Set<string>;
  conflictingSetIds: Set<string>;
  dayStart: Date;
  dayEnd: Date;
}

function StageColumn({ stageName, sets, myScheduleSetIds, conflictingSetIds, dayStart, dayEnd }: StageColumnProps) {
  const { setNodeRef } = useDroppable({
    id: `stage-${stageName}`,
  });

  return (
    <div ref={setNodeRef} className="flex flex-col min-h-[600px] w-48">
      <div className="sticky top-0 bg-gray-800 text-white p-3 rounded-t-lg font-semibold text-center text-sm z-20">
        {stageName}
      </div>
      <div className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-b-lg relative">
        {sets.map((set) => {
          const timePosition = getTimePosition(set.startTime, set.endTime, dayStart, dayEnd);
          const isInSchedule = myScheduleSetIds.has(set.id);
          return (
            <ArtistCard 
              key={set.id} 
              set={set} 
              isInMySchedule={isInSchedule}
              hasConflict={conflictingSetIds.has(set.id)}
              timePosition={timePosition}
              isInStageColumn={true}
            />
          );
        })}
      </div>
    </div>
  );
}

interface MyScheduleColumnProps {
  myScheduleSets: UISet[];
  conflictingSetIds: Set<string>;
  onRemoveFromSchedule: (setId: string) => void;
}

function MyScheduleColumn({ myScheduleSets, conflictingSetIds, onRemoveFromSchedule }: MyScheduleColumnProps) {
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

  const conflictCount = conflictingSetIds.size;

  return (
    <div className="flex flex-col min-h-[600px] w-80">
      <div className="sticky top-0 bg-blue-600 text-white p-3 rounded-t-lg font-semibold text-center">
        My Schedule ({myScheduleSets.length})
        {conflictCount > 0 && (
          <div className="text-xs mt-1 text-orange-200">
            ⚠️ {conflictCount} conflict{conflictCount !== 1 ? 's' : ''}
          </div>
        )}
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
                  {sets
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .map((set) => (
                    <ArtistCard 
                      key={set.id}
                      set={set} 
                      isInMySchedule={true}
                      hasConflict={conflictingSetIds.has(set.id)}
                      onRemove={onRemoveFromSchedule}
                      isInStageColumn={false}
                    />
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

    // Calculate day start and end times
    const { dayStart, dayEnd } = useMemo(() => {
        if (setsForDay.length === 0) {
            return { 
              dayStart: new Date(), 
              dayEnd: new Date() 
            };
        }

        const times = setsForDay.map(set => new Date(set.startTime).getTime());
        const endTimes = setsForDay.map(set => new Date(set.endTime).getTime());
        
        const earliest = new Date(Math.min(...times));
        const latest = new Date(Math.max(...endTimes));
        
        // Round to nearest hour and add some padding
        const dayStart = new Date(earliest);
        dayStart.setHours(earliest.getHours(), 0, 0, 0);
        
        const dayEnd = new Date(latest);
        dayEnd.setHours(latest.getHours() + 1, 0, 0, 0);
        
        return { dayStart, dayEnd };
    }, [setsForDay]);

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

    // Detect conflicts - sets that overlap in time
    const conflictingSetIds = useMemo(() => {
        const conflicts = new Set<string>();
        const scheduledSets = myScheduleSets;
        
        for (let i = 0; i < scheduledSets.length; i++) {
            for (let j = i + 1; j < scheduledSets.length; j++) {
                const set1 = scheduledSets[i];
                const set2 = scheduledSets[j];
                
                // Check if sets overlap in time
                const start1 = new Date(set1.startTime);
                const end1 = new Date(set1.endTime);
                const start2 = new Date(set2.startTime);
                const end2 = new Date(set2.endTime);
                
                // Check for overlap: set1 starts before set2 ends AND set2 starts before set1 ends
                if (start1 < end2 && start2 < end1) {
                    conflicts.add(set1.id);
                    conflicts.add(set2.id);
                }
            }
        }
        
        return conflicts;
    }, [myScheduleSets]);

    const handleRemoveFromSchedule = (setId: string) => {
        setMyScheduleSetIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(setId);
            return newSet;
        });
    };

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
                    <MyScheduleColumn 
                        myScheduleSets={myScheduleSets} 
                        conflictingSetIds={conflictingSetIds}
                        onRemoveFromSchedule={handleRemoveFromSchedule}
                    />
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

                    {/* Timeline and Stage Columns */}
                    <div className="flex gap-0 overflow-x-auto pb-4 h-full border-2 border-gray-300 rounded-lg">
                        {/* Timeline Column */}
                        <Timeline dayStart={dayStart} dayEnd={dayEnd} />
                        
                        {/* Stage Columns */}
                        {stages.map(stage => (
                            <StageColumn 
                                key={stage}
                                stageName={stage}
                                sets={setsByStage[stage] || []}
                                myScheduleSetIds={myScheduleSetIds}
                                conflictingSetIds={conflictingSetIds}
                                dayStart={dayStart}
                                dayEnd={dayEnd}
                            />
                        ))}
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
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
                        <div className={`bg-gradient-to-r p-4 rounded-lg text-center text-white ${
                            conflictingSetIds.size > 0 
                                ? 'from-orange-500 to-red-500' 
                                : 'from-gray-400 to-gray-500'
                        }`}>
                            <div className="text-2xl font-bold">{conflictingSetIds.size}</div>
                            <div className="text-sm opacity-90">Time Conflicts</div>
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