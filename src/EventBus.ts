// ===== DESACOPLAMIENTO POR EVENTOS =====
// El EventBus es como un "mensajero central": cuando algo importante pasa
// (ej: un retiro exitoso), se emite un evento. Cualquier otra parte del
// sistema puede "escuchar" ese evento sin estar directamente conectada
// al cajero. Así el cajero no necesita saber quién más está interesado
// en lo que hace — simplemente avisa y quien quiera escucha.

type Listener = (data: any) => void;

export class EventBus {
  //Un escuchador
  private static eventos: Map<string, Listener[]> = new Map();

  // Registrar un "escuchador" para un evento
  static on(evento: string, listener: Listener): void {
    if (!this.eventos.has(evento)) {
  // Registra funciones que quieran escuchar un evento y si no existe lo crea.
      this.eventos.set(evento, []);
    }
    ///Lo agreega 
    this.eventos.get(evento)!.push(listener);
  }

  // Emitir un evento con datos
  //dispara el evento para todos los que estan escuchando.
  static emit(evento: string, data: any): void {
   // captura listeners 
    const listeners = this.eventos.get(evento) ?? [];
    // Ejecuta cada evento listener
    listeners.forEach(listener => listener(data));
  }
}