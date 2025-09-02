import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { InfoDartboardService } from 'src/app/services/info-dartboard.service';
import { enablePinchZoom } from 'src/app/plugins/pinch-zoom';
import { enableMobileHover } from 'src/app/plugins/mobile-hover';
import { GameService } from 'src/app/services/game.service';
import { BoardZone } from 'src/app/interfaces/board-zone';

@Component({
  selector: 'app-dartboard',
  templateUrl: './dartboard.component.html',
  styleUrls: ['./dartboard.component.scss'],
})
export class DartBoardComponent implements OnInit {

  @ViewChild('boardContainer', { static: true }) boardContainerRef!: ElementRef<HTMLElement>;
  @ViewChild('outerBackground', { static: true }) outerBackgroundRef!: ElementRef<HTMLElement>;
  @ViewChild('innerBackground', { static: true }) innerBackgroundRef!: ElementRef<HTMLElement>;
  @ViewChild('dartboardSvg', { static: true }) dartboardSvgRef!: ElementRef<SVGSVGElement>;

  @Input() readonly: boolean = false;

  dartboardSections!: HTMLElement[];
  boardContainer!: HTMLElement;
  outerBackground!: HTMLElement;
  innerBackground!: HTMLElement;

  boardZones: BoardZone[] = [];

  constructor(private infoService: InfoDartboardService, private gameService: GameService) {}

  ngOnInit(): void { // usar static: true en el ViewChild, elemento siempre presente

    this.boardContainer = this.boardContainerRef.nativeElement;
    this.outerBackground = this.outerBackgroundRef.nativeElement;
    this.innerBackground = this.innerBackgroundRef.nativeElement;

    const svg = this.dartboardSvgRef.nativeElement; // svg representa la diana

    this.infoService.init();

    // Busca solo dentro de este SVG
    this.dartboardSections = Array.from(
      svg.querySelectorAll('#areas g path, #areas g circle')
    );

    // console.log('init boardSections', this.dartboardSections);

    this.gameService.boardZones$
      .subscribe(zones => {
        // console.log('boardZones$', zones);
        // Primero quitamos todos los gradientes SOLO en este SVG
        this.dartboardSections.forEach(p => {
          const id = p.getAttribute('id');
          if (id) this.removeGradient(id.replace(/^[sdt]/, ''), svg); // id viene con s/t/d delante
        });
        // Luego pintamos los que haya SOLO en este SVG
        zones.forEach(zone => {
          // console.log('paint zone', zone);
          this.paintZone(zone, svg);
        });
      });

    // Si es readonly, dejamos de leer en este punto
    if (this.readonly) {
      return;
    }

    // Interacción con la diana

    this.outerBackground.addEventListener('click', (e) => { // fondo negro (puntúa -1)
      e.preventDefault();
      e.stopPropagation();
      // console.log('outerBackground clicked', e.currentTarget);
      this.boardClickHandler('out');
    });

    this.innerBackground.addEventListener('click', (e) => { // fondo gris (no pasa nada)
      e.preventDefault();
      e.stopPropagation();
      // console.log('innerBackground clicked', e.currentTarget);
    });

    this.dartboardSections.forEach(p =>
      p.addEventListener('click', (event) => { // zonas puntuables
        event.preventDefault();
        event.stopPropagation();
        const target = event.target as HTMLElement;
        const id = target.getAttribute('id');
        if(id) this.boardClickHandler(id);
      })
    );

    // HOVER PARA MOVIL
    enableMobileHover(this.dartboardSections);
    enablePinchZoom(
      this.outerBackground, // Elemento a escalar
      this.boardContainer, // Área de referencia (puede ser el mismo si no hay padre)
      false // logs
    );
  }

  boardClickHandler(id: string) {
    this.infoService.addDart(id);
  }

  // Función para pintar una zona del dartboard con gradientes dinámicos
  paintZone(zone: BoardZone, svg: SVGSVGElement): void {
    let area = zone.area;
    let color1 = zone.color1;
    let color2 = zone.color2 ? zone.color2 : color1; // Si no hay color2, usar color1

    // Primero borramos el anterior por si ya estaba pintado
    this.removeGradient(area, svg);
    // Crear el ID dinámico para el gradiente
    const gradId = `${area}-color`;
    const id = `s${area}`; // Lo que colorearemos es la zona 'single' del numero que toque

    // Obtener el elemento path con el ID dado SOLO en este SVG
    const pathElement = svg.querySelector(`#${id}`) as HTMLElement;
    if (!pathElement) {
      console.warn(`El path con id ${id} no existe`);
      return;
    }

    // Crear la estructura de definición de gradiente (definido en <defs>)
    this.createGradientDef(gradId, color1, color2, svg);

    // Aplicar el gradiente al path
    pathElement.setAttribute('fill', `url(#${gradId})`);
  }

  // Función para crear un gradiente dinámico en el DOM
  createGradientDef(gradId: string, color1: string, color2: string, svg: SVGSVGElement): void {
    const svgNamespace = 'http://www.w3.org/2000/svg';
    const defsElement = svg.querySelector('defs');

    // Crear el gradiente lineal
    const gradient = document.createElementNS(svgNamespace, 'linearGradient');
    gradient.setAttribute('id', gradId);
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');

    // Crear los stops para los colores del gradiente
    const stop1 = document.createElementNS(svgNamespace, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', `stop-color:${color1};stop-opacity:1`);

    const stop2 = document.createElementNS(svgNamespace, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', `stop-color:${color2};stop-opacity:1`);

    // Agregar los stops al gradiente
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);

    // Agregar el gradiente a <defs>
    if (defsElement) defsElement.appendChild(gradient);
  }

  // Función para eliminar el gradiente y el fill
  removeGradient(area: string, svg: SVGSVGElement): void {
    const gradId = `${area}-color`;
    const id = `s${area}`;
    const whiteAreas = ['1', '4', '5', '6', '9', '11', '15', '16', '17', '19'];

    // Eliminar el gradiente de <defs> SOLO en este SVG
    const gradient = svg.getElementById(gradId);
    if (gradient) {
      gradient.remove();
    }

    // Eliminar el fill del path (restaurar al valor por defecto) SOLO en este SVG
    const pathElement = svg.querySelector(`#${id}`) as HTMLElement;
    if (pathElement) { // Restaurar al fill original
      if (whiteAreas.includes(area)) pathElement.setAttribute('fill', '#f7e9cd');
      else pathElement.setAttribute('fill', '');
    }
  }
}

// Id áreas:
// <s/d/t><num> (Ej: single 20 -> s20, triple 19 -> t19, doble 6 -> d6)
// Centro: bull, outer