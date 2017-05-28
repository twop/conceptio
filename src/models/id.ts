export type Id = number;

let incrementalId: Id = 1;
export const newId = (): Id => incrementalId++;
