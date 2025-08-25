import { Injectable } from '@angular/core';
import { IconConfig } from '../interfaces/icon-config';
import { Skill } from '../interfaces/skill';

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

  getSkills(): Skill[] {
    return [
      {
        name: 'Última palabra',
        description: 'Cuando recibes un golpe letal por primera vez en esta partida, lo ignoras y recuperas el 25% de vida.'
      },
      {
        name: 'Vampiro',
        description: 'Si has hecho daño durante la ronda, te curas 2 de vida al final de esta.'
      },
      {
        name: 'Golpe crítico',
        description: 'Tienes un 20% de probabilidades de hacer el doble de daño. Solo puede pasar una vez durante la ronda.'
      },
      {
        name: 'Busca tesoros',
        description: 'Durante tu turno, los objetos tienen un 66% de aparecer en la diana. Pueden aparecer hasta 3.'
      },
      {
        name: 'Sacerdote',
        description: 'Tienes un 50% de probabilidades de curarte el doble. Pueden aparecer pociones como objeto extra en la diana.'
      },
      {
        name: 'Víbora',
        description: 'Al final de cada ronda, tus rivales tienen un 70% de recibir 1 de daño.'
      },
      {
        name: 'Sniper',
        description: 'Si aciertas al centro de la diana, uno de tus rivales tiene un 20% de probabilidades de morir instantáneamente.'
      },
      {
        name: 'Mago',
        description: 'Tienes un 15% de probabilidades de ignorar el daño recibido. Si lo ignoras, tienes un 40% de probabilidades de devolverlo.'
      }
    ]
  }

  getSkillByName(name: string): Skill | undefined {
    return this.getSkills().find(x => x.name.toLowerCase() === name.toLowerCase());
  }

}
