import { BehaviorSubject } from "rxjs";
import { Skill } from "./skill";

export interface Player {
    id: number;
    name: string;
    color: string,
    background: string,
    fighterGif: string | number,
    isAlive: boolean,
    currentTurn?: boolean,
    skill?: Skill,
    hp$: BehaviorSubject<number>;
    weakPoints?: number[],
    healPoints?: number[],
    // objects?: any[],
    maxHealth?: number,
}
