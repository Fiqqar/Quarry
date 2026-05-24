export const PRIORITIES = ["p5", "p4", "p3", "p2", "p1"] as const;

export type Priority = (typeof PRIORITIES)[number];

