import { Exercise } from "./exercise";

export interface WorkoutHistoryEntry {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    cycles: HistoryCycle[]
}

export interface HistoryCycle {
    sets: HistorySet[];
}

export interface HistorySet {
    exercise: Exercise;
    reps: number;
    weight: number;
}