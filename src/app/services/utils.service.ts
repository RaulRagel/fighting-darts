import { Injectable } from '@angular/core';
import { IconConfig } from '../interfaces/icon-config';
import { Skill } from '../interfaces/skill';
import { Player } from '../interfaces/player';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  fightersUrl = 'assets/images/fighters/';
  fighterIconsUrl = 'assets/images/fighter-icons/';
  iconsUrl = 'assets/images/icons/';

  get totalFighters() {
    return 17;
  }
  get maxHealth() {
    return this.configService.maxHealth;
  }
  get bullName() {
    return 'Diana';
  }
  get outName() {
    return 'Out';
  }
  get defaultName() {
    return 'Player';
  }

  constructor(private configService: ConfigService) { }

  getIconUrl(icon: string, config?: IconConfig): string {
    if (!icon) return '';
    let color = null, subcarpet = null;
    if(config) {
      color = config.color || null;
      subcarpet = config.subcarpet || null;
    }
    return this.iconsUrl + (subcarpet ? `${subcarpet}/` : '') + icon + (color ? `-${color}` : '') + '.png';
  }

  /**
  /* Recibimos un color y devolvemos el background en gradiente
  */
  parseBackgroundColor(color?: string) {
    return `linear-gradient(120deg, #000000 0%, ${color || '#646464'} 100%)`;
  }

  /**
  /* Recibimos un número o string y devolvemos la URL del gif
  */
  parseFighterGif(number?: number | string) {
    if(!number) number = Math.floor(Math.random() * this.totalFighters) + 1;
    return this.fightersUrl + number + '.gif';
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
        name: 'Ninguna',
        label: 'none'
      },
      {
        name: 'Última palabra',
        label: 'lastWord',
        description: 'Cuando recibes un golpe letal por primera vez en esta partida, lo ignoras y recuperas el 25% de vida.'
      },
      {
        name: 'Vampiro',
        label: 'vampire',
        description: 'Si has hecho daño durante la ronda, te curas 2 de vida al final de esta.'
      },
      {
        name: 'Golpe crítico',
        label: 'criticalHit',
        description: 'Tienes un 20% de probabilidades de hacer el doble de daño. Solo puede pasar una vez durante la ronda.'
      },
      // {
      //   name: 'Busca tesoros',
      //   label: 'treasureHunt',
      //   description: 'Durante tu turno, los objetos tienen un 66% de aparecer en la diana. Pueden aparecer hasta 3.'
      // },
      {
        name: 'Ninja',
        label: 'ninja',
        description: 'Tienes un 20% de probabilidades de esquivar el daño.'
      },
      {
        name: 'Sacerdote',
        label: 'priest',
        description: 'Tienes un 50% de probabilidades de curarte el doble. Pueden aparecer pociones como objeto extra en la diana.'
      },
      {
        name: 'Víbora',
        label: 'viper',
        description: 'Al final de cada ronda, tus rivales tienen un 50% de recibir 2 de daño.'
      },
      {
        name: 'Sniper',
        label: 'sniper',
        description: 'Si aciertas al centro de la diana, uno de tus rivales tiene un 20% de probabilidades de morir instantáneamente.'
      },
      {
        name: 'Mago',
        label: 'mage',
        description: 'Tienes un 15% de probabilidades de ignorar el daño recibido. Si lo ignoras, tienes un 40% de probabilidades de devolverlo.'
      }
    ]
  }

  getSkillByName(name: string): Skill | undefined {
    return this.getSkills().find(x => {
      x.name.toLowerCase() === name.toLowerCase()
    });
  }

  getBoardDefaults() {
    return {
      areas: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
      colors: {
        hit:'#fd3939ff', heal: '#2fd851ff', // #20ad3d
        // object: '#1467b4ff',
        hit2: '#740000ff', heal2: '#045504ff',
        // object2: '#003366'
      }
    }
  }

  /**
   * Devuelve true con la probabilidad indicada (porcentaje 0-100).
   * 20 -> true ~20% de las veces; 50 -> true ~50% de las veces.
   */
  chance(percentage: number): boolean {
    if (!Number.isFinite(percentage)) return false;
    const p = Math.max(0, Math.min(100, percentage));
    if (p === 0) return false;
    if (p === 100) return true;
    return Math.random() * 100 < p;
  }

  shufflePlayers(players: Player[]): Player[] {
    const shuffled = [...players];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

}
