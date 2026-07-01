import { EventBus } from "./EventBus";
import { CargaExtrema } from "./CargaExtrema";

// ===== TIPADO =====
// Resultado puede ser exitoso o fallido, sin lanzar excepciones
type Resultado<T> =
  | { ok: true; valor: T }
  | { ok: false; error: string };

// ===== POO: Interfaz de Factura (Paso 3 - Reglas de Negocio) =====
// Define la forma exacta que debe tener una transacción de pago
interface Factura {
  id: string;
  monto: number;
  tipo: "RETIRO" | "DEPOSITO";
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO";
  fecha: Date;
}

// ===== POO + FUNCIONAL =====
export class ProcesadorPago {

  // ===== PASO 3: REGLAS DE NEGOCIO =====
  // Crea una factura con estado PENDIENTE y valida las reglas básicas
  static crearFactura(monto: number, tipo: "RETIRO" | "DEPOSITO"): Resultado<Factura> {
    // Regla 1: monto debe ser positivo
    if (monto <= 0) {
      return { ok: false, error: "El monto debe ser mayor a cero" };
    }

    // Regla 2: monto debe ser múltiplo de 10
    if (monto % 10 !== 0) {
      return { ok: false, error: "El monto debe ser múltiplo de 10" };
    }

    // Regla 3: monto máximo por operación
    if (monto > 5000) {
      return { ok: false, error: "Monto máximo por operación es $5000" };
    }

    const factura: Factura = {
      id: `FAC-${Date.now()}`,
      monto,
      tipo,
      estado: "PENDIENTE",
      fecha: new Date(),
    };

    console.log(`[Reglas de Negocio] Factura creada: ${factura.id} - Estado: ${factura.estado}`);
    return { ok: true, valor: factura };
  }

  // ===== PASO 4: CÁLCULO Y FALLA (Funcional + ROP) =====
  // Procesa la factura: si todo va bien la aprueba, si algo falla
  // devuelve un error sin lanzar excepciones (sin try/catch)
  static procesarFactura(
    factura: Factura,
    saldoActual: number
  ): Resultado<Factura> {

    // Verificar carga extrema (Paso 1)
    if (!CargaExtrema.iniciarOperacion()) {
      return { ok: false, error: "Sistema bajo carga extrema, intente más tarde" };
    }

    // Función pura: calcula si el pago es válido sin efectos secundarios
    const esValido = (f: Factura, saldo: number): boolean =>
      f.tipo === "DEPOSITO" || saldo >= f.monto;

    // Si no es válido, finaliza la operación y devuelve error
    if (!esValido(factura, saldoActual)) {
      CargaExtrema.finalizarOperacion();
      return { ok: false, error: "Fondos insuficientes para procesar la factura" };
    }

    // Aprobar la factura
    const facturaAprobada: Factura = { ...factura, estado: "APROBADO" };
    console.log(`[Cálculo] Factura aprobada: ${facturaAprobada.id}`);

    // ===== PASO 5: EMITIR EVENTO =====
    // Notifica al sistema que el pago fue completado
    // El cajero no sabe quién escucha, solo avisa
    EventBus.emit("PagoCompletado", {
      id: facturaAprobada.id,
      monto: facturaAprobada.monto,
      tipo: facturaAprobada.tipo,
      fecha: facturaAprobada.fecha,
    });

    CargaExtrema.finalizarOperacion();
    return { ok: true, valor: facturaAprobada };
  }
}