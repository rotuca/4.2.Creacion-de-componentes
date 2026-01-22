# Proyecto 3 - Componente Botón Básico con @Input

Este proyecto demuestra la creación de un **componente básico reutilizable** utilizando `@Input` clásico y **content projection** (`<ng-content>`).

## Manual de Creación Paso a Paso

### Paso 1: Crear el proyecto Angular
```powershell
ng new proyecto3
```

**Opciones durante la creación:**
- ¿Routing? → **Sí** (Yes)
- ¿Stylesheet? → **SCSS**

**📚 Explicación técnica:**
- Proyecto base que incluye routing (aunque no se usa en este ejemplo)
- Demuestra conceptos fundamentales antes de añadir complejidad

---

### Paso 2: Generar el componente Boton
```powershell
cd proyecto3
ng generate component components/boton
```

**📚 Explicación técnica:**
- Componente simple que envuelve un `<button>` HTML nativo
- Patrón **Component Wrapper**: Añade funcionalidad a elementos HTML estándar
- **Standalone component**: No requiere NgModule (Angular 14+)

---

### Paso 3: Implementar el componente Boton

Edita `src/app/components/boton/boton.ts`:

```typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'boton',
  imports: [CommonModule],
  templateUrl: './boton.html',
  styleUrl: './boton.scss'
})
export class Boton {
  @Input() funcion: 'normal' | 'alternativa' | 'peligrosa' = 'normal';
}
```

**📚 Explicación técnica:**
- **`@Input()`**: Decorador clásico para propiedades de entrada
  - Permite al componente padre pasar datos al hijo
  - Angular detecta cambios automáticamente (change detection)
- **Union type**: `'normal' | 'alternativa' | 'peligrosa'`
  - TypeScript restringe valores válidos
  - Autocompletado en IDE: al escribir `[funcion]="..."` muestra las 3 opciones
  - Error de compilación si pasas valor incorrecto
- **Default value**: `= 'normal'`
  - Si el padre no pasa `[funcion]`, usa 'normal'
  - Permite usar el componente sin configuración: `<boton>Click</boton>`
- **`CommonModule`**: Proporciona directivas comunes
  - `*ngIf`, `*ngFor`, `ngClass`, `ngStyle`, pipes básicos
  - Necesario en componentes standalone

**Diferencia con signal input:**
```typescript
// Approach clásico (@Input) - usado aquí
@Input() funcion: 'normal' | 'alternativa' | 'peligrosa' = 'normal';
// En template: {{funcion}}

// Approach moderno (signal) - alternativa
funcion = input<'normal' | 'alternativa' | 'peligrosa'>('normal');
// En template: {{funcion()}}
```

Edita `src/app/components/boton/boton.html`:

```html
<button [class]="'boton boton--' + funcion">
  <ng-content></ng-content>
</button>
```

**📚 Explicación técnica:**
- **`[class]`**: Property binding para clases CSS dinámicas
  - Genera: `class="boton boton--normal"` o `class="boton boton--peligrosa"`
  - Angular actualiza el DOM cuando `funcion` cambia
- **Concatenación de strings**: `'boton boton--' + funcion`
  - BEM naming: `boton--normal`, `boton--alternativa`, `boton--peligrosa`
- **`<ng-content>`**: Content projection (transclusion)
  - **¿Qué hace?**: Inserta el contenido que el padre pone entre las tags
  - **Ejemplo**: 
    ```html
    <boton>Hola mundo</boton>
    <!-- Se renderiza como: -->
    <button class="boton boton--normal">Hola mundo</button>
    ```
  - **Ventajas**:
    - Flexibilidad: Puedes pasar texto, HTML, otros componentes
    - Composición: `<boton><mat-icon>check</mat-icon> Guardar</boton>`
  - **Alternativa sin ng-content**: Usar `@Input() texto: string`
    ```typescript
    // Sin content projection
    @Input() texto: string = '';
    // Template: <button>{{texto}}</button>
    // Uso: <boton texto="Hola"></boton>
    ```
- **Slot único**: `<ng-content>` sin `select` proyecta TODO el contenido
  - Para múltiples slots: `<ng-content select=".header">`

Edita `src/app/components/boton/boton.scss`:

```scss
.boton {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &--normal {
    background-color: #2196F3;
    color: white;
    
    &:hover {
      background-color: #1976D2;
      box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
    }
  }
  
  &--alternativa {
    background-color: #FF9800;
    color: white;
    
    &:hover {
      background-color: #F57C00;
      box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
    }
  }
  
  &--peligrosa {
    background-color: #F44336;
    color: white;
    
    &:hover {
      background-color: #D32F2F;
      box-shadow: 0 4px 8px rgba(244, 67, 54, 0.3);
    }
  }
}
```

**📚 Explicación técnica:**
- **BEM + SCSS nesting**:
  - `&--normal` se compila a `.boton--normal`
  - `&:hover` dentro de `&--normal` se compila a `.boton--normal:hover`
- **Estilos base** (`.boton`):
  - `padding, border-radius, font-size`: Consistencia visual
  - `cursor: pointer`: Indica interactividad
  - `transition: all 0.3s ease`: Animaciones suaves
- **Estados hover**:
  - Color más oscuro: Feedback visual de interacción
  - `box-shadow`: Elevación (Material Design)
  - `rgba()` con opacidad: Sombra sutil
- **Color semántico**:
  - **Normal** (azul): Acciones primarias, neutras
  - **Alternativa** (naranja): Acciones secundarias, advertencias
  - **Peligrosa** (rojo): Acciones destructivas (eliminar, cancelar)
- **Accesibilidad**:
  - Contraste blanco sobre color cumple WCAG AA
  - Hover states claros para usuarios de teclado
  - Botón nativo `<button>` es accesible por defecto (focus, keyboard navigation)

---

### Paso 4: Implementar el componente App

Edita `src/app/app.ts`:

```typescript
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Boton } from './components/boton/boton';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Boton],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('proyecto3');
}
```

**📚 Explicación técnica:**
- **`imports: [Boton]`**: Importa el componente standalone
  - No requiere `declarations` en NgModule
  - Tree-shaking automático: Solo se incluye si se usa
- **Signal**: `title` usa la nueva API reactiva
  - Aunque no se modifica, demuestra la sintaxis moderna

Edita `src/app/app.html`:

```html
<h1>Hola mundo</h1>

<boton>Hola mundo</boton>

<boton [funcion]="'peligrosa'">Hola mundo</boton>

<router-outlet />
```

**📚 Explicación técnica:**
- **Primer botón**: Sin parámetros, usa default `funcion='normal'`
  ```html
  <boton>Hola mundo</boton>
  <!-- Renderiza: <button class="boton boton--normal">Hola mundo</button> -->
  ```
- **Segundo botón**: Pasa `[funcion]="'peligrosa'"`
  ```html
  <boton [funcion]="'peligrosa'">Hola mundo</boton>
  <!-- Renderiza: <button class="boton boton--peligrosa">Hola mundo</button> -->
  ```
- **Property binding syntax**:
  - `[funcion]="'peligrosa'"`: Binding de expresión JavaScript
  - Sin corchetes `funcion="peligrosa"`: String literal (también funciona)
  - **Diferencia**: 
    ```html
    [funcion]="variable"    <!-- Evalúa variable TypeScript -->
    funcion="literal"       <!-- String fijo -->
    ```
- **Content projection en acción**:
  - "Hola mundo" se inserta donde está `<ng-content>`
  - Podrías pasar HTML complejo:
    ```html
    <boton [funcion]="'alternativa'">
      <mat-icon>save</mat-icon>
      <span>Guardar cambios</span>
    </boton>
    ```

---

### Paso 5: Ejecutar el servidor de desarrollo

```powershell
ng serve
```

Abre http://localhost:4200

**📚 Explicación técnica:**
- Verás 2 botones:
  1. Azul (normal) con texto "Hola mundo"
  2. Rojo (peligrosa) con texto "Hola mundo"
- Prueba el hover para ver transiciones
- Chrome DevTools:
  - Inspecciona: `<button class="boton boton--peligrosa">`
  - Ver estilos aplicados y hover states

---

## Conceptos Clave Demostrados

✅ **@Input decorator**: Propiedades de entrada clásicas  
✅ **Union types**: TypeScript para valores restringidos  
✅ **Content projection**: `<ng-content>` para composición  
✅ **BEM methodology**: Nomenclatura Block Element Modifier  
✅ **SCSS nesting**: Preprocesador para estilos organizados  
✅ **Componentes standalone**: Sin NgModules  
✅ **Default values**: Inputs opcionales con valores por defecto  

---

## Flujo de Datos: Content Projection

```
Padre (App)                      Hijo (Boton)
┌─────────────────────┐         ┌──────────────────────────┐
│ <boton>             │         │ <button>                 │
│   Hola mundo    ────┼────────>│   <ng-content></ng...>   │
│ </boton>            │         │ </button>                │
└─────────────────────┘         └──────────────────────────┘
                                 Renderiza: Hola mundo
```

---

## Comparación: @Input vs ng-content

```typescript
// Approach 1: @Input para texto
@Input() texto: string = '';
// Template: <button>{{texto}}</button>
// Uso: <boton texto="Hola"></boton>

// Approach 2: ng-content (más flexible)
// Template: <button><ng-content></ng-content></button>
// Uso: <boton>Hola <strong>mundo</strong></boton>
```

**Ventajas de ng-content:**
- ✅ Acepta HTML complejo
- ✅ Composición de componentes
- ✅ Más natural en sintaxis HTML

**Ventajas de @Input:**
- ✅ Type-safe (TypeScript valida el tipo)
- ✅ Más fácil de testear
- ✅ Mejor para datos estructurados

---

## Cuándo usar cada enfoque

| Caso de uso                     | Recomendación       |
|----------------------------------|---------------------|
| Texto simple                     | `@Input texto`      |
| HTML con formato                 | `<ng-content>`      |
| Iconos + texto                   | `<ng-content>`      |
| Datos estructurados              | `@Input config`     |
| Componentes anidados             | `<ng-content>`      |
| Valores validados (union types)  | `@Input funcion`    |

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
