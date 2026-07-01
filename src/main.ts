import * as readline from "readline";
import { Cajero } from "./Cajero";

const cajero = new Cajero(1000);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ===== ESTRUCTURA DE DATOS: objeto que mapea opción → acción =====
const opciones: Record<string, () => void> = {
  "1": () => {
    console.log(`Saldo actual: $${cajero.consultarSaldo()}`);
    mostrarMenu();
  },
  "2": () => {
    rl.question("Monto a depositar: ", (input) => {
      console.log(cajero.depositar(Number(input)));
      mostrarMenu();
    });
  },
  "3": () => {
    rl.question("Monto a retirar: ", (input) => {
      console.log(cajero.retirar(Number(input)));
      mostrarMenu();
    });
  },
  "4": () => {
    console.log(cajero.deshacerUltimaOperacion());
    mostrarMenu();
  },
  "5": () => {
    const historial = cajero.verHistorial();
    if (historial.length === 0) {
      console.log("No hay transacciones registradas.");
    } else {
      // ===== LOOP: forEach en vez de for clásico =====
      historial.forEach((t, index) => {
        console.log(`${index + 1}. ${t.tipo} - $${t.monto} - ${t.fecha.toLocaleString()}`);
      });
    }
    mostrarMenu();
  },
  "6": () => {
    console.log("Gracias por usar el cajero. ¡Hasta luego!");
    rl.close();
  },
};

function mostrarMenu(): void {
  console.log("\n========= CAJERO AUTOMÁTICO =========");
  console.log("1. Consultar saldo");
  console.log("2. Depositar");
  console.log("3. Retirar");
  console.log("4. Deshacer última operación");
  console.log("5. Ver historial de transacciones");
  console.log("6. Salir");
  console.log("======================================");

  rl.question("Elige una opción: ", (opcion) => {
    // ===== LOOP =====

    // simplemente buscamos la clave en el objeto y ejecutamos la función
    const accion = opciones[opcion.trim()];
    if (accion) {
      accion();
    } else {
      console.log("Opción inválida, intenta de nuevo.");
      mostrarMenu();
    }
  });
}

mostrarMenu();