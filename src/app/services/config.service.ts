import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig, DEFAULT_CONFIG } from '../interfaces/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly STORAGE_KEY = 'app-config';

  // BehaviorSubject con toda la configuración
  private configSubject = new BehaviorSubject<AppConfig>(DEFAULT_CONFIG);
  config$ = this.configSubject.asObservable();

  constructor() {
    // Cargar configuración guardada al instanciar el servicio
    this.loadFromStorage();
  }

  /**
   * Carga la configuración desde localStorage.
   * Si no existe, usa los valores por defecto.
   */
  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const config = JSON.parse(stored) as AppConfig;
        // Merge con valores por defecto para manejar propiedades que falten
        const merged = { ...DEFAULT_CONFIG, ...config };
        this.configSubject.next(merged);
      } else {
        this.configSubject.next(DEFAULT_CONFIG);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      this.configSubject.next(DEFAULT_CONFIG);
    }
  }

  /**
   * Guarda la configuración actual en localStorage.
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.configSubject.getValue()));
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    }
  }

  /**
   * Actualiza un ajuste específico y lo guarda en localStorage.
   * @param key Nombre de la propiedad a actualizar
   * @param value Nuevo valor
   */
  updateSetting<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    const current = this.configSubject.getValue();
    const updated = { ...current, [key]: value };
    this.configSubject.next(updated);
    this.saveToStorage();
  }

  /**
   * Obtiene el valor actual de un ajuste específico.
   */
  getSetting<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.configSubject.getValue()[key];
  }

  /**
   * Obtiene un Observable de un ajuste específico.
   * Útil para bindear en templates con async pipe.
   */
  getSetting$<K extends keyof AppConfig>(key: K): Observable<AppConfig[K]> {
    return new Observable(subscriber => {
      subscriber.next(this.getSetting(key));
      this.config$.subscribe(config => subscriber.next(config[key]));
    });
  }

  /**
   * Obtiene la configuración completa actual.
   */
  getConfig(): AppConfig {
    return this.configSubject.getValue();
  }

  /**
   * Observable de toda la configuración.
   */
  getConfig$(): Observable<AppConfig> {
    return this.config$;
  }

  /**
   * Resetea la configuración a los valores por defecto.
   */
  resetToDefaults(): void {
    this.configSubject.next({ ...DEFAULT_CONFIG });
    this.saveToStorage();
  }

  // Getters específicos para acceso más cómodo

  get randomPlayerOrder(): boolean {
    return this.getSetting('randomPlayerOrder');
  }

  set randomPlayerOrder(value: boolean) {
    this.updateSetting('randomPlayerOrder', value);
  }

  get soundEnabled(): boolean {
    return this.getSetting('soundEnabled') ?? true;
  }

  set soundEnabled(value: boolean) {
    this.updateSetting('soundEnabled', value);
  }

  get musicEnabled(): boolean {
    return this.getSetting('musicEnabled') ?? true;
  }

  set musicEnabled(value: boolean) {
    this.updateSetting('musicEnabled', value);
  }

  get difficulty(): 'easy' | 'medium' | 'hard' {
    return this.getSetting('difficulty') ?? 'medium';
  }

  set difficulty(value: 'easy' | 'medium' | 'hard') {
    this.updateSetting('difficulty', value);
  }

  get maxHealth(): number {
    return this.getSetting('maxHealth') ?? 25;
  }

  set maxHealth(value: number) {
    this.updateSetting('maxHealth', value);
  }
}
