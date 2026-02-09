export interface ThrowInfo {
  label: string; // el id del throw, por ejemplo "s20", "d5", "t10", "outer15", "bull"
  // id: string,
  area: string
  // hits: number,
  value: number // valor de la tirada (s: x1, d: x2, t: x3)
}