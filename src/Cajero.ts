import { memoize } from "./memoization";
import { ProcesadorPago } from "./ProcesadorPago";
import { EventBus } from "./EventBus";

// ===== TIPADO =====
export type TipoTransaccion = "RETIRO" | "DEPOSITO" | "CONSULTA";

export interface Transaccion {
  tipo: TipoTransaccion;
  monto: number;
  fecha: Date;
}

const DENOMINACIONES: number[] = [100, 50, 20, 10];

export class Cajero {
  // ===== ENCAPSULAMIENTO =====
  private saldo: number;
  private historial: Transaccion[] = [];

  constructor(saldoInicial: number) {
    this.saldo = saldoInicial;

    // ===== EVENTO: escucha cuando un pago se completa =====
    // El cajero se "suscribe" al evento "PagoCompletado"
    // para registrar automáticamente en el historial
    EventBus.on("PagoCompletado", (data) => {
      console.log(`[Evento] PagoCompletado recibido → ${data.tipo} de $${data.monto}`);
    });
  }

  public consultarSaldo(): number {
    return this.saldo;
  }

  public retirar(monto: number): string {
    // ===== PASO 3: Reglas de Negocio =====
    const facturaResult = ProcesadorPago.crearFactura(monto, "RETIRO");
    if (!facturaResult.ok) return facturaResult.error;

    // ===== PASO 4: Cálculo y Falla =====
    const procesoResult = ProcesadorPago.procesarFactura(
      facturaResult.valor,
      this.saldo
    );
    if (!procesoResult.ok) return procesoResult.error;

    // ===== MEMOIZACIÓN: calcular billetes =====
    const billetesADispensar = this.calcularBilletes(monto) as number[];
    const detalle = billetesADispensar
      .map((billete: number) => `Entregando billete de $${billete}`)
      .join("\n");

    this.saldo -= monto;
    this.registrarTransaccion("RETIRO", monto);

    return `${detalle}\nRetiro exitoso. Saldo actual: $${this.saldo}`;
  }

  public depositar(monto: number): string {
    // ===== PASO 3: Reglas de Negocio =====
    const facturaResult = ProcesadorPago.crearFactura(monto, "DEPOSITO");
    if (!facturaResult.ok) return facturaResult.error;

    // ===== PASO 4: Cálculo y Falla =====
    const procesoResult = ProcesadorPago.procesarFactura(
      facturaResult.valor,
      this.saldo
    );
    if (!procesoResult.ok) return procesoResult.error;

    this.saldo += monto;
    this.registrarTransaccion("DEPOSITO", monto);
    return `Depósito exitoso. Saldo actual: $${this.saldo}`;
  }

  // ===== SCOPE + MEMOIZACIÓN =====
  private calcularBilletes = memoize((monto: number): number[] => {
    let restante = monto;
    return DENOMINACIONES.flatMap(denom => {
      const cantidad = Math.floor(restante / denom);
      restante %= denom;
      return Array(cantidad).fill(denom);
    });
  });

  private registrarTransaccion(tipo: TipoTransaccion, monto: number): void {
    this.historial.push({ tipo, monto, fecha: new Date() });
  }

  public deshacerUltimaOperacion(): string {
    if (this.historial.length === 0) return "No hay transacciones para deshacer";
    const ultima = this.historial.pop() as Transaccion;
    if (ultima.tipo === "RETIRO") this.saldo += ultima.monto;
    if (ultima.tipo === "DEPOSITO") this.saldo -= ultima.monto;
    return `Se revirtió: ${ultima.tipo} de $${ultima.monto}. Saldo actual: $${this.saldo}`;
  }

  public verHistorial(): Transaccion[] {
    return [...this.historial];
  }
} 