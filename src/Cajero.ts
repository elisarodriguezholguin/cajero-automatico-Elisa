import { Stack } from "./Stack";
import { memoize } from "./memoization";

// ===== TIPADO =====
// Tipos explícitos para modelar el dominio del negocio
export type TipoTransaccion = "RETIRO" | "DEPOSITO" | "CONSULTA";

export interface Transaccion {
  tipo: TipoTransaccion;
  monto: number;
  fecha: Date;
}

// Denominaciones disponibles en el cajero
const DENOMINACIONES: number[] = [100, 50, 20, 10];

export class Cajero {
  // ===== ENCAPSULAMIENTO =====
  // Todo el estado interno es privado. Solo se manipula con métodos públicos.
  private saldo: number;
  private historial: Stack<Transaccion>; // <-- uso del Stack genérico

  constructor(saldoInicial: number) {
    this.saldo = saldoInicial;
    this.historial = new Stack<Transaccion>();
  }

  public consultarSaldo(): number {
    return this.saldo;
  }

  // ===== RETIRO usando bucles + Stack para simular dispensado de billetes =====
  public retirar(monto: number): string {
    if (monto > this.saldo) {
      return "Fondos insuficientes";
    }
    if (monto % 10 !== 0) {
      return "El monto debe ser múltiplo de 10";
    }

    const billetesADispensar = this.calcularBilletes(monto); // función memoizada
    const dispensador = new Stack<number>();

    // ===== BUCLE 1 =====
    // Cargamos el stack del dispensador con los billetes calculados
    for (const denominacion of billetesADispensar) {
      dispensador.push(denominacion);
    }

    let detalle = "";

    // ===== BUCLE 2 (while) + uso de Stack como dispensador =====
    // Vamos "entregando" billetes desde la parte superior del stack
    while (!dispensador.isEmpty()) {
      const billete = dispensador.pop();
      detalle += `Entregando billete de $${billete}\n`;
    }

    this.saldo -= monto;
    this.registrarTransaccion("RETIRO", monto);

    return `${detalle}Retiro exitoso. Saldo actual: $${this.saldo}`;
  }

  public depositar(monto: number): string {
    if (monto <= 0) return "Monto inválido";
    this.saldo += monto;
    this.registrarTransaccion("DEPOSITO", monto);
    return `Depósito exitoso. Saldo actual: $${this.saldo}`;
  }

  // ===== SCOPE =====
  // 'this.calcularBilletes' está memoizado UNA SOLA VEZ aquí (scope de instancia).
  // Cada vez que se llama con el mismo monto, devuelve el resultado cacheado
  // en lugar de recalcular con el algoritmo de denominaciones.
  private calcularBilletes = memoize((monto: number): number[] => {
    const resultado: number[] = [];
    let restante = monto; // <-- variable de SCOPE LOCAL a esta función

    // ===== BUCLE 3 =====
    // Algoritmo "greedy": recorre las denominaciones de mayor a menor
    for (const denom of DENOMINACIONES) {
      while (restante >= denom) {
        resultado.push(denom);
        restante -= denom;
      }
    }
    return resultado;
  });

  private registrarTransaccion(tipo: TipoTransaccion, monto: number): void {
    this.historial.push({ tipo, monto, fecha: new Date() });
  }

  // Deshace la última transacción usando pop() del Stack
  public deshacerUltimaOperacion(): string {
    if (this.historial.isEmpty()) return "No hay transacciones para deshacer";

    const ultima = this.historial.pop() as Transaccion;

    if (ultima.tipo === "RETIRO") this.saldo += ultima.monto;
    if (ultima.tipo === "DEPOSITO") this.saldo -= ultima.monto;

    return `Se revirtió: ${ultima.tipo} de $${ultima.monto}. Saldo actual: $${this.saldo}`;
  }

  public verHistorial(): Transaccion[] {
    return this.historial.toArray();
  }
}