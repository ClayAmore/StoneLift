export interface Exercise {
  name: string
  force: string | null
  level: string
  mechanic: string | null
  equipment: string | null
  primaryMuscles: string[]
  secondaryMuscles: string[]
  instructions: string[]
  category: string
  images: string[]
  id: string
}

export enum MuscleGroup {
    abductors = "abductors",
    abdominals = "abdominals",
    adductors = "adductors",
    biceps = "biceps",
    calves = "calves",
    chest = "chest",
    forearms = "forearms",
    glutes = "glutes",
    hamstrings = "hamstrings",
    lats = "lats",
    lowerBack = "lower back",
    middleBack = "middle back",
    neck = "neck",
    quadriceps = "quadriceps",
    shoulders = "shoulders",
    traps = "traps",
    triceps = "triceps",
}