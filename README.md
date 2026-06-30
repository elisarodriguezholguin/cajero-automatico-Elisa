# Cajero Automático en TypeScript

Implementación de un cajero automático aplicando los conceptos de estructuras
de datos y fundamentos de programación trabajados en el taller.

## ¿Cómo ejecutar el proyecto?

```bash
npm install
npx tsc --noEmit      # Verifica que el código compile sin errores
npx ts-node src/main.ts   # Ejecuta el menú interactivo
```

## Estructura del proyecto
src/
├── Stack.ts          # Estructura de datos genérica (Pila / LIFO)
├── memoization.ts    # Función de orden superior con closure y caché
├── Cajero.ts         # Lógica de negocio del cajero
└── main.ts           # Menú interactivo por consola
## Conceptos aplicados y dónde encontrarlos

| Concepto | Archivo | Descripción |
|---|---|---|
| **Stack (Pila)** | `Stack.ts` | Estructura LIFO usada para el historial de transacciones (`deshacerUltimaOperacion`) y para simular el dispensado físico de billetes en `retirar()`. |
| **Encapsulamiento** | `Stack.ts`, `Cajero.ts` | Los atributos `items`, `saldo` e `historial` son `private`. Solo se accede a ellos mediante métodos públicos, protegiendo el estado interno. |
| **Tipado** | `Cajero.ts` | Tipo `TipoTransaccion` (unión literal) e interfaz `Transaccion`. Todos los parámetros y retornos están explícitamente tipados. |
| **Genéricos** | `Stack.ts`, `memoization.ts` | `class Stack<T>` permite reutilizar la misma estructura para `number` (billetes) o `Transaccion` (historial). `memoize<A, R>` funciona con cualquier función. |
| **Closure** | `memoization.ts` | La variable `cache` queda "atrapada" dentro de la función devuelta por `memoize()`, manteniendo su estado entre llamadas. |
| **Scope** | `Cajero.ts` | La variable `restante` dentro de `calcularBilletes` es local a esa función. La propiedad `calcularBilletes` vive en el scope de instancia, memoizada una sola vez por cajero. |
| **Memoización** | `memoization.ts` + `Cajero.ts` | `calcularBilletes` está envuelta con `memoize()`: si se retira el mismo monto dos veces, la segunda vez se usa el resultado en caché en lugar de recalcular. |
| **Bucles** | `Cajero.ts` | `for` para cargar el stack de billetes y para recorrer denominaciones; `while` para el algoritmo *greedy* de cálculo de billetes y para el dispensado (`pop()` hasta vaciar el stack). |

## Funcionalidades del menú

1. Consultar saldo
2. Depositar dinero
3. Retirar dinero (con validación de fondos y múltiplos de 10)
4. Deshacer la última operación (usa `pop()` del stack de historial)
5. Ver historial completo de transacciones
6. Salir

## Autor

Elisa Rodriguez 