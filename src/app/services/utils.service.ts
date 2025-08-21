import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  iconsUrl = 'assets/images/icons/';

  constructor() { }

  getIconUrl(icon: string, color: string): string {
    if (!icon) return '';
    return this.iconsUrl + icon + (color ? `-${color}` : '') + '.png';
  }
}
