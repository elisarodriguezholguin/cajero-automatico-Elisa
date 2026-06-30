// ===== GENÉRICO + ENCAPSULAMIENTO =====
// La clase es genérica <T>: puede almacenar billetes, transacciones, lo que sea.
// El arreglo interno es 'private': nadie fuera de la clase puede tocarlo
// directamente (encapsulamiento). Solo se accede mediante los métodos públicos.

export class Stack<T> {
  private items: T[] = []; // <-- ENCAPSULAMIENTO: estado oculto

  public push(item: T): void {
    this.items.push(item);
  }

  public pop(): T | undefined {
    return this.items.pop();
  }

  public peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public size(): number {
    return this.items.length;
  }

  // Devuelve una copia, NO la referencia real (protege el encapsulamiento)
  public toArray(): T[] {
    return [...this.items];
  }
}