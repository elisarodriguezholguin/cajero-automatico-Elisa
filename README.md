# Cajero Automático en TypeScript

Implementación de un cajero automático aplicando los conceptos de estructuras
de datos, fundamentos de programación y arquitectura multiparadigma.

## ¿Cómo ejecutar el proyecto?

```bash
npm install
npx tsc --noEmit        # Verifica que el código compile sin errores
npm start               # Ejecuta el menú interactivo
```

## Estructura del proyecto
src/
├── Cajero.ts           # Lógica principal del cajero (POO + Encapsulamiento + Enum)
├── memoization.ts      # Closure + Memoización con operador rest (...args)
├── ProcesadorPago.ts   # Reglas de Negocio (POO) + Cálculo y Falla (ROP)
├── EventBus.ts         # Desacoplamiento por Eventos (Reactivo)
├── CargaExtrema.ts     # Control de carga extrema (AOP)
└── main.ts             # Menú interactivo por consola (objeto de funciones)
## Conceptos aplicados y dónde encontrarlos

| Concepto | Archivo | Descripción |
|---|---|---|
| **Enum** | `Cajero.ts` | `TipoTransaccion` reemplaza el tipo unión literal. Agrupa valores relacionados bajo un mismo nombre, evitando errores de tipeo en strings. |
| **Encapsulamiento** | `Cajero.ts` | Los atributos `saldo` e `historial` son `private`. Solo se accede a ellos mediante métodos públicos, protegiendo el estado interno. |
| **Tipado** | `Cajero.ts`, `ProcesadorPago.ts` | Interfaz `Transaccion`, tipo `Resultado<T>` e interfaz `Factura`. Todos los parámetros y retornos están explícitamente tipados. |
| **Closure** | `memoization.ts` | La variable `cache` queda atrapada dentro de la función devuelta por `memoize()`, manteniendo su estado entre llamadas aunque `memoize()` ya terminó de ejecutarse. |
| **Scope** | `Cajero.ts` | La variable `restante` dentro de `calcularBilletes` es local a esa función (scope local). La propiedad `calcularBilletes` vive en el scope de instancia, memoizada una sola vez por cajero. |
| **Memoización** | `memoization.ts` + `Cajero.ts` | `calcularBilletes` está envuelta con `memoize()`: si se retira el mismo monto dos veces, la segunda vez se usa el resultado en caché en lugar de recalcular. |
| **Operador rest (...args)** | `memoization.ts` | Permite que `memoize` reciba cualquier cantidad de argumentos sin importar cuántos sean, haciéndola genérica y reutilizable. |
| **Bucles** | `Cajero.ts` | `flatMap` + `Math.floor` reemplazan el doble bucle `for`/`while` del algoritmo greedy. `map` + `join` para armar el detalle de billetes entregados. |

## Arquitectura Multiparadigma — Caso de Uso Real: Procesamiento de Pago

| Paso | Paradigma | Archivo | Descripción |
|---|---|---|---|

| **Paso 1** | AOP (Aspectos) | `CargaExtrema.ts` | Intercepta cada operación antes y después de procesarla. Controla que no haya más de 5 operaciones simultáneas. |
------------------------------------------------------------------------------
**PASO 2**
Este paso se cubrio con CargaExtrema, que actúa como interceptor transversal (AOP): intercepta antes y después de cada operación sin que el cajero lo sepa directamente, lo que hace CargaExtrema en el cajero:
El cajero solo se preocupa por retirar o depositar, sin saber que hay algo vigilándolo
--------------------------------------------------------------------------------
| **Paso 3** | POO (Objetos) | `ProcesadorPago.ts` | Instancia una `Factura` con estado `PENDIENTE` y aplica reglas de negocio: monto positivo, múltiplo de 10, máximo $5000. |
--------------------------------------------------------------------------------
| **Paso 4** | Funcional + ROP | `ProcesadorPago.ts` | Función pura `esValido` calcula sin efectos secundarios. Tipo `Resultado<T>` devuelve éxito o error sin lanzar excepciones. |
--------------------------------------------------------------------------------
| **Paso 5** | Reactivo (Eventos) | `EventBus.ts` | Emite el evento `PagoCompletado` al terminar. Cualquier parte del sistema puede escucharlo sin estar directamente conectada al cajero. |

## Flujo completo de un retiro
Usuario elige "Retirar $400"
↓
[Reglas de Negocio] → valida monto, crea Factura PENDIENTE
↓
[CargaExtrema]      → verifica capacidad (Activas: 1)
↓
[Cálculo]           → aprueba Factura, cambia estado a APROBADO
↓
[Evento]            → emite "PagoCompletado", notifica al sistema
↓
[CargaExtrema]      → libera la operación (Activas: 0)
↓
Cajero entrega billetes y muestra saldo actualizado
## Funcionalidades del menú

1. Consultar saldo
2. Depositar dinero (pasa por flujo completo de procesamiento de pago)
3. Retirar dinero (pasa por flujo completo de procesamiento de pago)
4. Deshacer la última operación (usa `pop()` del arreglo de historial)
5. Ver historial completo de transacciones
6. Salir

## Tecnologías usadas

- TypeScript
- Node.js
- ts-node
- readline (menú interactivo por consola)

## Autor

Elisa Rodriguez