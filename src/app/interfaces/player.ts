import { BehaviorSubject } from "rxjs";
import { Skill } from "./skill";

export interface Player {
    id: number;
    name: string;
    color: string,
    fighterGif: string | number,
    skill?: Skill,
    hp$: BehaviorSubject<number>;
    objects?: any[], // ! Objec type
    isAlive?: boolean,
    weakPoints?: number[],
    healPoints?: number[],
    maxHealth?: number,
}
