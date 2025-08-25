import { Skill } from "./skill";

export interface Player {
    id?: number;
    name: string;
    fighterGif?: string | number,
    skill?: Skill,
    objects?: any[], // ! Objec type
    color?: string,
    isAlive?: boolean,
    weakPoints?: number[],
    healPoints?: number[],
    health?: number,
    maxHealth?: number,
}
