import { BehaviorSubject } from "rxjs";
import { Skill } from "./skill";

export interface Player {
    id: number;
    name: string;
    color: string;
    background: string;
    fighterGif: string | number;
    isAlive: boolean;
    currentTurn?: boolean;
    skill?: Skill;
    hp$: BehaviorSubject<number>;
    weakAreas?: number[];
    healAreas?: number[];
    // objects?: any[],
    maxHealth?: number;
    skillValues?: SkillValues; // ! to do: hacerlo obligatorio
}

export interface SkillValues {
    didDamage?: boolean;
    didCritical?: boolean;
}