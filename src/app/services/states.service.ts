import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { State } from '../interfaces/state';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  // routes = {
  //   menu: 'menu',
  //   game: 'game',
  //   players: 'players'
  // }

  private states: State[] = [
    {
      id: 'players',
      name: 'Añadir jugadores',
      icon: 'assets/images/icons/players.png'
    },
    {
      id: 'question',
      name: 'Instrucciones',
      icon: 'assets/images/icons/question.png'
    },
    {
      id: 'settings',
      name: 'Ajustes',
      icon: 'assets/images/icons/settings.png'
    },
    // {
    //   name: 'Créditos',
    //   icon: 'assets/images/icons/credits.png'
    // },
    // {
    //   name: 'Contacto',
    //   icon: 'assets/images/icons/mail.png'
    // }
  ]

  private currentRouteSubject = new BehaviorSubject<string>('/');
  currentRoute$ = this.currentRouteSubject.asObservable();

  private appStateSubject = new BehaviorSubject<State | {}>({});
  appState$ = this.appStateSubject.asObservable();

  constructor(private router: Router, private route: ActivatedRoute) {}

  init() {
    console.log('Current path:', this.router.url);

    this.currentRouteSubject.next(this.router.url);

    this.router.events
      .subscribe((event: any) => {
        // console.log('EVENT', event); // eventos de router
        if (event instanceof NavigationEnd) {
          if (this.router.url === '/menu') this.setAppState({});
          this.currentRouteSubject.next(event.urlAfterRedirects);
        }
      });
  }

  getStateById(id: string): State {
    return this.states.find(state => state.id === id) || {};
  }

  getStates(): State[] {
    return this.states;
  }

  setAppState(state: State) {
    console.log('state changed', state);
    this.appStateSubject.next(state);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  goBack() {
    if (this.router.url !== '/menu') {
      this.setAppState({});
      this.navigateTo('../');  // o window.history.back();
    }
  }
}

/*

<a [routerLink]="['/game']">Ir a Game</a>
<a [routerLink]="['/game']" [queryParams]="{level: 3}">Game nivel 3</a>

<a [routerLink]="['/menu']" routerLinkActive="active">Menú</a>

//* Con query params
this.router.navigate(['/menu'], { queryParams: { foo: 'bar' } });

//* Reemplazar la URL en el historial (sin crear una entrada nueva)
this.router.navigate(['/menu'], { replaceUrl: true });


if (someCondition) {
  this.router.navigate(['/menu']);
}

private location: Location

goBack() {
  this.location.back();
}
*/