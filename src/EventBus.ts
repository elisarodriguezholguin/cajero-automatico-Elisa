// ===== DESACOPLAMIENTO POR EVENTOS =====
// El EventBus es como un "mensajero central": cuando algo importante pasa
// (ej: un retiro exitoso), se emite un evento. Cualquier otra parte del
// sistema puede "escuchar" ese evento sin estar directamente conectada
// al cajero. Así el cajero no necesita saber quién más está interesado
// en lo que hace — simplemente avisa y quien quiera escucha.

type Listener = (data: any) => void;

export class EventBus {
  private static eventos: Map<string, Listener[]> = new Map();

  // Registrar un "escuchador" para un evento
  static on(evento: string, listener: Listener): void {
    if (!this.eventos.has(evento)) {
      this.eventos.set(evento, []);
    }
    this.eventos.get(evento)!.push(listener);
  }

  // Emitir un evento con datos
  static emit(evento: string, data: any): void {
    const listeners = this.eventos.get(evento) ?? [];
    listeners.forEach(listener => listener(data));
  }
}