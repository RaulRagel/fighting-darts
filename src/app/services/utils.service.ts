import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  iconsUrl = 'assets/images/icons/';
  fightersUrl = 'assets/images/fighters/';
  // ! todo agregar los personajes y colores para pasarlos al componente que los use

  constructor() { }

  getIconUrl(icon: string, color: string): string {
    if (!icon) return '';
    return this.iconsUrl + icon + (color ? `-${color}` : '') + '.png';
  }

  getFighterGif(character: string | number): string {
    if (!character) return '';
    return this.fightersUrl + character + '.gif';
  }
}
