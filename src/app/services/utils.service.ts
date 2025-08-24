import { Injectable } from '@angular/core';
import { IconConfig } from '../interfaces/icon-config';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  fightersUrl = 'assets/images/fighters/';
  fighterIconsUrl = 'assets/images/fighter-icons/';
  // ! todo agregar los personajes y colores para pasarlos al componente que los use

  get totalFighters() {
    return 17;
  }

  constructor() { }

  getIconUrl(icon: string, config?: IconConfig): string {
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

  getFighterIcons() {
    let iconsLength = this.totalFighters;
    let urls = [];
    for (let i = 1; i < (iconsLength + 1); i++) {
      urls.push({
        url: this.getFighterIconUrl(i),
        id: i
      });
    }
    // Random icon
    urls.push({
      url: this.getFighterIconUrl('0'),
      id: 0
    });
    return urls;
  }

  getFighterIconUrl(img: string | number) {
    return this.fighterIconsUrl + img + '.png';
  }

  getFighterColors() {
    return ['#15c3e9', '#089e27', '#d39f12', '#8d5fc0', '#646464'];
  }

  getSkills() {
    // ! todo
  }

}
