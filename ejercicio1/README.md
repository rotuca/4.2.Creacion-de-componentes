# Ejercicio 1 - Componente Barra de Progreso

Este proyecto demuestra la creación de componentes reutilizables con **comunicación bidireccional** entre componente padre e hijo usando `@Input`, `@Output` y `EventEmitter`.

## Manual de Creación Paso a Paso

### Paso 1: Crear el proyecto Angular
```powershell
ng new ejercicio1
```

**Opciones durante la creación:**
- ¿Routing? → **No**
- ¿Stylesheet? → **SCSS**

**📚 Explicación técnica:**
- Este proyecto se enfoca en la **arquitectura de componentes** sin necesidad de routing o librerías externas
- SCSS permite estilos modulares y reutilizables

---

### Paso 2: Generar el componente BarraProgreso
```powershell
cd ejercicio1
ng generate component components/barraProgreso
```

**📚 Explicación técnica:**
- **`ng generate component`**: Crea automáticamente 4 archivos:
  - `.ts` - Lógica del componente (clase TypeScript)
  - `.html` - Template (vista)
  - `.scss` - Estilos encapsulados
  - `.spec.ts` - Tests unitarios
- **Estructura `components/`**: Organización recomendada para separar componentes reutilizables de la lógica de la aplicación
- **Componentes standalone**: Angular 14+ genera componentes sin necesidad de NgModule

---

### Paso 3: Generar el componente Boton
```powershell
ng generate component components/boton
```

**📚 Explicación técnica:**
- Se crea un componente de botón reutilizable que será usado dentro de `BarraProgreso`
- Demuestra **composición de componentes** (un componente que usa otro)

---

### Paso 4: Instalar UUID para IDs únicos
```powershell
npm install uuid
npm install --save-dev @types/uuid
```

**📚 Explicación técnica:**
- **uuid**: Librería para generar identificadores únicos universales (v4 usa números aleatorios)
- **@types/uuid**: Definiciones de TypeScript para tener autocompletado y type checking
- **Uso**: Cada instancia de `<barraProgreso>` necesita un ID único para el elemento `<progress>` y su `<label>` asociado (accesibilidad)
- **Problema sin UUID**: Si tienes múltiples barras de progreso, todas tendrían `id="file"`, violando el estándar HTML (IDs deben ser únicos en el documento)

---

### Paso 5: Implementar el componente Boton

Edita `src/app/components/boton/boton.ts`:

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'boton',
  imports: [CommonModule],
  templateUrl: './boton.html',
  styleUrl: './boton.scss'
})
export class Boton {
  @Input() funcion: 'normal' | 'alternativa' | 'peligrosa' = 'normal';
  @Input() href: string = "";
  @Output() onClick = new EventEmitter<void>();

  handleOnClick(): void {
    this.onClick.emit();
  }
}
```

**📚 Explicación técnica:**
- **`@Input() funcion`**: Propiedad de entrada que acepta solo 3 valores específicos (union type)
  - TypeScript validará en compile-time que solo se pasen estos valores
  - Sirve para aplicar diferentes estilos CSS según el tipo de botón
- **`@Output() onClick`**: Evento de salida que permite al componente padre escuchar clicks
  - `EventEmitter<void>` indica que el evento no envía datos, solo notifica
- **`handleOnClick()`**: Método interno que emite el evento hacia el padre
- **Patrón de diseño**: Componente "tonto" (presentational) - solo muestra UI y comunica eventos, sin lógica de negocio

Edita `src/app/components/boton/boton.html`:

```html
<button [class]="'boton boton--' + funcion()" (click)="handleOnClick()">
  <ng-content></ng-content>
</button>
```

**📚 Explicación técnica:**
- **`[class]`**: Property binding que genera clases dinámicas (ej: `boton boton--peligrosa`)
- **BEM naming**: Sigue la metodología Block Element Modifier
  - `boton` = Block (componente base)
  - `boton--peligrosa` = Modifier (variante del componente)
- **`<ng-content>`**: Proyección de contenido (content projection)
  - Permite insertar HTML desde el padre: `<boton>Texto aquí</boton>`
  - Equivalente a `{children}` en React o `<slot>` en Vue

---

### Paso 6: Implementar el componente BarraProgreso

Edita `src/app/components/barraProgreso/barraProgreso.ts`:

```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Boton } from '../boton/boton';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'barraProgreso',
  imports: [CommonModule, Boton],
  templateUrl: './barraProgreso.html',
  styleUrl: './barraProgreso.scss'
})
export class BarraProgreso {
  @Input() title: string = 'archivo procesado';
  @Input() porcentajeRealizado: number = 0;
  @Output() onIncrement = new EventEmitter<void>();
  @Output() onDecrement = new EventEmitter<void>();
  uniqueId: string;

  constructor() {
    this.uniqueId = uuidv4();
  }

  incrementar(): void {
    this.onIncrement.emit();
  }

  decrementar(): void {
    this.onDecrement.emit();
  }
}
```

**📚 Explicación técnica:**
- **Inputs múltiples**: 
  - `title`: Texto descriptivo de la barra
  - `porcentajeRealizado`: Valor numérico (0-100)
- **Outputs múltiples**: Delega la lógica de incremento/decremento al padre
  - **Principio de Responsabilidad Única**: El componente no modifica `porcentajeRealizado` directamente
  - El padre mantiene el "estado" (state), el hijo solo lo muestra
- **`constructor()`**: Se ejecuta cuando Angular instancia el componente
  - `uniqueId` se genera una vez y permanece constante durante el ciclo de vida
- **Patrón "Controlled Component"**: Similar a React, el componente no tiene estado interno, es controlado por el padre

Edita `src/app/components/barraProgreso/barraProgreso.html`:

```html
<label class="progreso" [attr.for]="uniqueId">{{title}}</label>
<progress class="progreso" [attr.id]="uniqueId" max="100" [value]="porcentajeRealizado">
  {{porcentajeRealizado}}%
</progress>

<div class="botones">
  <boton (onClick)="decrementar()">Decrementar 10</boton>
  <boton (onClick)="incrementar()">Incrementar 10</boton>
</div>
```

**📚 Explicación técnica:**
- **`[attr.for]` y `[attr.id]`**: Attribute binding para atributos HTML estándar
  - `[attr.X]` se usa cuando el atributo no es una propiedad DOM
  - `for` conecta el label con el progress (accesibilidad ARIA)
- **`<progress>`**: Elemento HTML5 nativo para barras de progreso
  - `max="100"`: Valor máximo
  - `[value]`: Property binding dinámico
  - Contenido entre tags: Fallback para navegadores antiguos
- **Event binding `(onClick)`**: Escucha eventos del componente `Boton`
  - Cuando el hijo emite `onClick`, el padre ejecuta su método `incrementar()`

---

### Paso 7: Implementar el componente App (padre)

Edita `src/app/app.ts`:

```typescript
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraProgreso } from './components/barraProgreso/barraProgreso';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BarraProgreso],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ejercicio1');
  porcentaje: number = 50;
  
  incrementar(): void {
    if (this.porcentaje < 100) {
      this.porcentaje += 10;
    }
  }

  decrementar(): void {
    if (this.porcentaje > 0) {
      this.porcentaje -= 10;
    }
  }
}
```

**📚 Explicación técnica:**
- **`porcentaje: number`**: Estado mutable del componente padre
  - No usa signal porque se modifica directamente con métodos
- **Validación de límites**: 
  - `if (this.porcentaje < 100)` previene overflow
  - Lógica de negocio centralizada en el padre
- **Flujo de datos**:
  1. Usuario hace click en botón hijo
  2. Botón emite `onClick` → BarraProgreso emite `onIncrement`
  3. App ejecuta `incrementar()` → actualiza `porcentaje`
  4. Angular detecta cambio → re-renderiza BarraProgreso con nuevo valor

Edita `src/app/app.html`:

```html
<barraProgreso 
  [title]="'File progress:'" 
  [porcentajeRealizado]="porcentaje" 
  (onIncrement)="incrementar()" 
  (onDecrement)="decrementar()">
</barraProgreso>
```

**📚 Explicación técnica:**
- **Property binding `[title]`**: Pasa datos del padre al hijo (one-way down)
- **Event binding `(onIncrement)`**: Escucha eventos del hijo (one-way up)
- **Two-way binding simulado**: Combinando `[]` y `()` se logra comunicación bidireccional
  - No es `[(ngModel)]` verdadero, pero logra el mismo efecto
- **Sintaxis**: 
  - `[]` = Input (padre → hijo)
  - `()` = Output (hijo → padre)

---

### Paso 8: Ejecutar el servidor de desarrollo

```powershell
ng serve
```

Abre http://localhost:4200

**📚 Explicación técnica:**
- Angular detectará cambios en `porcentaje` y actualizará la barra automáticamente
- La barra `<progress>` se animará visualmente al cambiar el `value`
- Cada instancia de `<barraProgreso>` tendrá su propio ID único generado por UUID

---

## Conceptos Clave Demostrados

✅ **@Input**: Comunicación padre → hijo (datos)  
✅ **@Output + EventEmitter**: Comunicación hijo → padre (eventos)  
✅ **Componentes standalone**: Sin NgModules  
✅ **Content Projection**: `<ng-content>`  
✅ **UUID**: Generación de IDs únicos  
✅ **Controlled Components**: Estado manejado por el padre  
✅ **Composición de componentes**: Componente que usa otros componentes  
✅ **BEM naming**: Metodología de nomenclatura CSS

---

## Arquitectura del Flujo de Datos

```
┌─────────────────────────────────────┐
│         App (Padre)                  │
│  porcentaje: number = 50             │
│  incrementar() { porcentaje += 10 }  │
└──────────────┬──────────────────────┘
               │ [porcentajeRealizado]=porcentaje
               │ (onIncrement)=incrementar()
               ↓
┌─────────────────────────────────────┐
│    BarraProgreso (Hijo)              │
│  @Input() porcentajeRealizado        │
│  @Output() onIncrement               │
│  incrementar() { emit() }            │
└──────────────┬──────────────────────┘
               │ (onClick)=incrementar()
               ↓
┌─────────────────────────────────────┐
│       Boton (Nieto)                  │
│  @Output() onClick                   │
│  handleOnClick() { emit() }          │
└─────────────────────────────────────┘
```

---

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
