import { Component, OnInit } from '@angular/core';

interface Throw {
  // id: string,
  hits: number,
  name: string
  value: number // valor de la tirada (s: x1, d: x2, t: x3)
}

const VALUES: { [key: string]: number } = {
  s: 1,
  d: 2,
  t: 3,
  outer: 1, // 1 a todos
  bull: 3 // 3 a todos
}

@Component({
  selector: 'app-dartboard',
  templateUrl: './dartboard.component.html',
  styleUrls: ['./dartboard.component.scss'],
})
export class DartBoardComponent implements OnInit {

  dartboardSections!: NodeList;
  throws: string[] = [];
  throwInfo: Throw[] = [];
  totalPoints: number[] = [];

  constructor() {
    
  }

  ngOnInit(): void {

    this.dartboardSections = document.querySelectorAll('#dartboard #areas g path, #dartboard #areas g circle');
    console.log('init boardSections', this.dartboardSections);

    this.dartboardSections.forEach(p =>
      p.addEventListener('click', (event) => this.boardClickHandler(event)) // evitamos perder el contexto
    );

    (window as any).paint = this.paintZone.bind(this); // id
    (window as any).remove = this.removeGradient.bind(this); // id
    // this.paintZone('20', 'red', 'blue');
  }

  boardClickHandler(event: any) {
    this.addDart(event.target.getAttribute('id'));
  }

  addDart(id: string) {
    this.throws.push(id);
    console.log('added dart', this.throws);
    this.updateInfo();
  }

  removeDart() {
    this.throws.pop();
    this.updateInfo();
  }

  updateInfo() {
    this.updateThrows();
  }

  updateThrows() {
    let duplicatedThrow;
    let throwInfo: Throw[] = [];

    for(let currentThrow of this.throws) {
      duplicatedThrow = throwInfo.find(d => d.name === this.getThrowName(currentThrow));
      if(duplicatedThrow) {
        duplicatedThrow.hits++;
        duplicatedThrow.value += this.getThrowValue(currentThrow);
      } else {
        throwInfo.push({
          name: this.getThrowName(currentThrow),
          hits: 1,
          value: this.getThrowValue(currentThrow)
        });
      }
    }

    this.throwInfo = throwInfo;

    console.log('throwInfo', this.throwInfo);
  }

  getThrowName(id: string): string {
    if (!id) return '';
    if(['bull', 'outer'].includes(id)) return 'Centro';
    
    return id.slice(1);
  }

  getThrowValue(id: string): number {
    if (!id) return 0;
    if(['bull', 'outer'].includes(id)) return VALUES[id];
    
    return VALUES[id[0]];
  }
  
  // Función para pintar una zona del dartboard con gradientes dinámicos
  paintZone(zone: string, color1: string, color2: string): void {
    // Primero borramos el anterior por si ya estaba pintado
    this.removeGradient(zone);
    // Crear el ID dinámico para el gradiente
    const gradId = `${zone}-color`;
    const id = `s${zone}`; // Lo que colorearemos es la zona 'single' del numero que toque
    
    // Obtener el elemento path con el ID dado
    const pathElement = document.getElementById(id) as HTMLElement;
    if (!pathElement) {
      console.warn(`El path con id ${id} no existe`);
      return;
    }

    // Crear la estructura de definición de gradiente (definido en <defs>)
    this.createGradientDef(gradId, color1, color2);

    // Aplicar el gradiente al path
    pathElement.setAttribute('fill', `url(#${gradId})`);
  }

  // Función para crear un gradiente dinámico en el DOM
  createGradientDef(gradId: string, color1: string, color2: string): void {
    const svgNamespace = 'http://www.w3.org/2000/svg';
    const defsElement = document.querySelector('svg defs');

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
    if(defsElement) defsElement.appendChild(gradient);
  }

  // Función para eliminar el gradiente y el fill
  removeGradient(zone: string): void {
    const gradId = `${zone}-color`;
    const id = `s${zone}`;
    const whiteZones = ['1', '4', '5', '6', '9', '11', '15', '16', '17', '19'];

    // Eliminar el gradiente de <defs>
    const gradient = document.getElementById(gradId);
    if (gradient) {
      gradient.remove();
    }

    // Eliminar el fill del path (restaurar al valor por defecto)
    const pathElement = document.getElementById(id) as HTMLElement;
    if (pathElement) { // Restaurar al fill original
      if(whiteZones.includes(zone)) pathElement.setAttribute('fill', '#f7e9cd');
      else pathElement.setAttribute('fill', '');
    }
  }
}

// Id áreas:
// <s/d/t><num> (Ej: single 20 -> s20, triple 19 -> t19, doble 6 -> d6)
// Centro: bull, outer