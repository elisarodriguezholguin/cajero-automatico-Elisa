// ===== CARGA EXTREMA =====
// Controla que no se procesen demasiadas operaciones al mismo tiempo.
// Si llegan más peticiones de las que son permitidas, las rechaza con un mensaje
// de error en vez de colapsar el sistema.
// Es como una fila de banco: solo entran X personas a la vez,
// las demás esperan o son rechazadas si la fila está llena.

export class CargaExtrema {
  private static operacionesActivas: number = 0;
  private static readonly MAX_OPERACIONES: number = 5;

  // Verifica si hay capacidad para procesar una operación nueva
  static puedeOperar(): boolean {
    return this.operacionesActivas < this.MAX_OPERACIONES;
  }

  // Registra que una operación comenzó
  static iniciarOperacion(): boolean {
    if (!this.puedeOperar()) {
      console.log(
        `Sistema bajo carga extrema: máximo ${this.MAX_OPERACIONES} operaciones simultáneas.`
      );
      return false;
    }
    this.operacionesActivas++;
    console.log(`[CargaExtrema] Operación iniciada. Activas: ${this.operacionesActivas}`);
    return true;
  }

  // Registra que una operación terminó
  static finalizarOperacion(): void {
    if (this.operacionesActivas > 0) {
      this.operacionesActivas--;
    }
    console.log(`[CargaExtrema] Operación finalizada. Activas: ${this.operacionesActivas}`);
  }

  // Muestra el estado actual del sistema
  static estado(): string {
    return `Operaciones activas: ${this.operacionesActivas}/${this.MAX_OPERACIONES}`;
  }
}