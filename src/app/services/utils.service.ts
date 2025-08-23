import { Injectable } from '@angular/core';

export interface IconConfig {
  color?: string,
  subcarpet?: string
}

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  fightersUrl = 'assets/images/fighters/';
  // ! todo agregar los personajes y colores para pasarlos al componente que los use

  constructor() { }

  getIconUrl(icon: string, config: IconConfig): string {
    if (!icon) return '';
    let color = null, subcarpet = null, iconsUrl = 'assets/images/icons/';
    if(config) {
      color = config.color || null;
      subcarpet = config.subcarpet || null;
    }
    return iconsUrl + (subcarpet ? `${subcarpet}/` : '') + icon + (color ? `-${color}` : '') + '.png';
  }

  getFighterGif(character: string | number): string {
    if (!character) return '';
    return this.fightersUrl + character + '.gif';
  }
}
