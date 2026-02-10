import { BehaviorSubject } from "rxjs";
import { Skill } from "./skill";

export interface Tag {
  title: string;
  color: string;
}

export interface Player {
    id: number;
    name: string;
    color: string;
    background: string;
    fighterGif: string | number;
    isAlive: boolean;
  /**
   * Índice de creación para mantener orden original en la UI de edición.
   */
  createdIndex?: number;
    currentTurn?: boolean;
    tag?: Tag;
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