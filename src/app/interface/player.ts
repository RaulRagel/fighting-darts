
export interface Player {
    // id: number;
    name: string;
    fighterGif: string,
    skill?: any, // ! Skill type
    objects?: any[], // ! Objec type
    color?: string,
    isAlive?: boolean,
    weakPoints?: number[],
    healPoints?: number[],
    health?: number,
    maxHealth?: number,
}
