import * as readline from "readline";
import { Cajero } from "./Cajero";

// ===== Instancia del cajero con saldo inicial =====
const cajero = new Cajero(1000);

// Interfaz de lectura de consola (entrada/salida)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ===== SCOPE =====
// Esta función vive en el scope del módulo (archivo). Se vuelve a llamar
// a sí misma cada vez que termina una opción, formando un bucle de menú.
function mostrarMenu(): void {
  console.log("\n========= CAJERO AUTOMÁTICO =========");
  console.log("1. Consultar saldo");
  console.log("2. Depositar");
  console.log("3. Retirar");
  console.log("4. Deshacer última operación");
  console.log("5. Ver historial de transacciones");
  console.log("6. Salir");
  console.log("======================================");

  rl.question("Elige una opción: ", (opcion: string) => {
    manejarOpcion(opcion.trim());
  });
}

function manejarOpcion(opcion: string): void {
  switch (opcion) {
    case "1":
      console.log(`Saldo actual: $${cajero.consultarSaldo()}`);
      mostrarMenu();
      break;

    case "2":
      rl.question("Monto a depositar: ", (input: string) => {
        const monto = Number(input);
        console.log(cajero.depositar(monto));
        mostrarMenu();
      });
      break;

    case "3":
      rl.question("Monto a retirar: ", (input: string) => {
        const monto = Number(input);
        console.log(cajero.retirar(monto));
        mostrarMenu();
      });
      break;

    case "4":
      console.log(cajero.deshacerUltimaOperacion());
      mostrarMenu();
      break;

    case "5":
      const historial = cajero.verHistorial();
      if (historial.length === 0) {
        console.log("No hay transacciones registradas.");
      } else {
        // ===== BUCLE =====
        historial.forEach((t, index) => {
          console.log(
            `${index + 1}. ${t.tipo} - $${t.monto} - ${t.fecha.toLocaleString()}`
          );
        });
      }
      mostrarMenu();
      break;

    case "6":
      console.log("Gracias por usar el cajero. ¡Hasta luego!");
      rl.close();
      break;

    default:
      console.log("Opción inválida, intenta de nuevo.");
      mostrarMenu();
      break;
  }
}

// Iniciamos el programa mostrando el menú por primera vez
mostrarMenu();