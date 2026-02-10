/**
 * Interfaz que define todos los ajustes configurables del juego.
 * Fácil de extender: solo agrega una nueva propiedad aquí y su getter en ConfigService.
 */
export interface AppConfig {
  // Gameplay
  randomPlayerOrder: boolean;

  // Audio/Visual (preparado para futuro)
  soundEnabled?: boolean;
  musicEnabled?: boolean;

  // Difficulty/Balance (preparado para futuro)
  difficulty?: 'easy' | 'medium' | 'hard';
  maxHealth?: number;
}

/**
 * Valores por defecto para la configuración.
 * Se usan si no hay nada guardado en localStorage.
 */
export const DEFAULT_CONFIG: AppConfig = {
  randomPlayerOrder: true,
  soundEnabled: true,
  musicEnabled: true,
  difficulty: 'medium',
};
