import { Exercise } from "./exercise";

export interface Workout {
    id: string;
    name: string;
    cycle: WorkoutCycle[];
}

export interface WorkoutCycle {
    set: WorkoutSet;
    iterations: number;
    reps: number[];
    weight: number[];
}

export interface WorkoutSet {
    exercise: Exercise;
}