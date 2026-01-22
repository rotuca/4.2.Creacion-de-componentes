# Proyecto 3B - Comunicación con @Output y Pipes

Este proyecto demuestra **comunicación hijo → padre** usando `@Output` + `EventEmitter`, y el uso de **pipes** de Angular para transformar datos en el template.

## Manual de Creación Paso a Paso

### Paso 1: Crear el proyecto Angular
```powershell
ng new proyecto3b
```

**Opciones durante la creación:**
- ¿Routing? → **Sí** (Yes)
- ¿Stylesheet? → **SCSS**

**📚 Explicación técnica:**
- Proyecto que combina múltiples conceptos: eventos, pipes, y Material Design
- Demuestra flujo de datos bidireccional (padre ↔ hijo)

---

### Paso 2: Generar el componente Boton
```powershell
cd proyecto3b
ng generate component components/boton
```

**📚 Explicación técnica:**
- Componente reutilizable que emite eventos hacia el padre
- Patrón **Event Emitter**: Comunicación basada en eventos (como eventos DOM nativos)

---

### Paso 3: Implementar el componente Boton con @Output

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
- **`@Output() onClick`**: Decorador que define un evento de salida
  - Permite al componente padre "escuchar" eventos del hijo
  - Nombre convención: `onXxx` (onSubmit, onChange, onDelete)
- **`EventEmitter<void>`**: Clase genérica para emitir eventos
  - `<void>`: No envía datos con el evento (solo notifica)
  - Alternativas con datos:
    ```typescript
    @Output() onDelete = new EventEmitter<number>(); // Emite un ID
    onDelete.emit(42); // Padre recibe el número
    ```
- **`handleOnClick()`**: Método interno que emite el evento
  - Se ejecuta cuando el usuario hace click en el botón
  - Llama a `this.onClick.emit()` que propaga el evento al padre
- **Flujo de eventos**:
  1. Usuario hace click → `(click)="handleOnClick()"` en template
  2. Componente hijo ejecuta `handleOnClick()`
  3. Se llama a `onClick.emit()`
  4. Padre que escucha con `(onClick)="..."` ejecuta su método

**Patrón de diseño:**
```typescript
// Componente hijo: Define y emite evento
@Output() onClick = new EventEmitter<void>();
handleOnClick(): void { this.onClick.emit(); }

// Template hijo: Escucha evento nativo
<button (click)="handleOnClick()">...</button>

// Template padre: Escucha evento custom
<boton (onClick)="alerta()">...</boton>

// Componente padre: Maneja el evento
alerta(): void { alert('Hola mundo'); }
```

Edita `src/app/components/boton/boton.html`:

```html
<button [class]="'boton boton--' + funcion" (click)="handleOnClick()">
  <ng-content></ng-content>
</button>
```

**📚 Explicación técnica:**
- **`(click)="handleOnClick()"`**: Event binding de evento DOM nativo
  - Angular escucha clicks en el `<button>` HTML
  - Ejecuta el método `handleOnClick()` del componente
- **Diferencia click vs onClick**:
  - `(click)`: Evento DOM estándar (cualquier elemento HTML)
  - `(onClick)`: Evento custom del componente Angular
- **Propagación de eventos**:
  ```
  Usuario click
      ↓
  <button> emite (click)
      ↓
  handleOnClick() se ejecuta
      ↓
  onClick.emit() emite evento custom
      ↓
  Padre escucha con (onClick)
      ↓
  Método del padre se ejecuta
  ```

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
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
    }
  }
  
  &--peligrosa {
    background-color: #F44336;
    color: white;
    
    &:hover {
      background-color: #D32F2F;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
    }
  }
}
```

**📚 Explicación técnica:**
- **`transform: translateY(-2px)`**: Efecto de "levitar" en hover
  - Mueve el botón 2px hacia arriba
  - Combinado con box-shadow crea sensación de elevación
- **`transition: all 0.3s ease`**: Anima todos los cambios suavemente
  - 0.3s: Duración estándar para microinteracciones
  - `ease`: Curva de aceleración natural

---

### Paso 4: Implementar el componente App con Pipes

Edita `src/app/app.ts`:

```typescript
import { Component, Input, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Boton } from './components/boton/boton';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Boton, CurrencyPipe, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('proyecto3b');

  alerta(): void {
    alert('Hola mundo');
  }

  @Input() precio: number = 55;
  @Input() fechaCompra: Date = new Date();
}
```

**📚 Explicación técnica:**
- **`CurrencyPipe` y `DatePipe`**: Pipes de transformación de `@angular/common`
  - **Pipes**: Transforman datos en el template sin modificar el valor original
  - En componentes standalone, deben importarse explícitamente
- **`alerta()`**: Método que se ejecuta cuando el hijo emite `onClick`
  - Demuestra comunicación hijo → padre
- **`@Input() precio`**: 
  - Técnicamente incorrecto en componente raíz (no tiene padre)
  - Debería ser propiedad normal: `precio: number = 55`
  - **@Input se usa solo en componentes hijos**
- **`new Date()`**: Crea fecha actual en el momento de instanciación
  - Se ejecuta solo una vez cuando se crea el componente

**Pipes disponibles en @angular/common:**
- **CurrencyPipe**: Formatea números como moneda
- **DatePipe**: Formatea fechas
- **DecimalPipe**: Formatea números decimales
- **PercentPipe**: Formatea porcentajes
- **UpperCasePipe, LowerCasePipe**: Cambia mayúsculas/minúsculas
- **JsonPipe**: Serializa objetos a JSON (útil para debug)

Edita `src/app/app.html`:

```html
<h1>Hola mundo</h1>

<boton (onClick)="alerta()">Hola mundo</boton>

<br><br>

<boton [funcion]="'peligrosa'" (onClick)="alerta()">Hola mundo</boton>

<br><br>

<p>{{precio | currency}}</p>

<p>{{fechaCompra | date:'shortDate'}}</p>

<router-outlet />
```

**📚 Explicación técnica:**
- **Event binding `(onClick)`**: Escucha el evento custom del componente Boton
  ```html
  <boton (onClick)="alerta()">
  <!-- Cuando el hijo emite onClick, ejecuta alerta() del padre -->
  ```
- **Pipe syntax**: `{{valor | pipeName:parametro}}`
  - **`| currency`**: Transforma número a formato moneda
    ```typescript
    55 → "$55.00" (en locale en-US)
    55 → "55,00 €" (en locale es-ES)
    ```
  - Configuración del locale en `app.config.ts`:
    ```typescript
    import { LOCALE_ID } from '@angular/core';
    import localeEs from '@angular/common/locales/es';
    registerLocaleData(localeEs);
    
    providers: [
      { provide: LOCALE_ID, useValue: 'es-ES' }
    ]
    ```
- **`| date:'shortDate'`**: Formatea fecha en formato corto
  - Parámetro `'shortDate'`: Formato predefinido de Angular
  - Ejemplos de formatos:
    ```typescript
    'short'      → 1/22/26, 1:30 PM
    'medium'     → Jan 22, 2026, 1:30:00 PM
    'long'       → January 22, 2026 at 1:30:00 PM GMT+1
    'shortDate'  → 1/22/26
    'mediumDate' → Jan 22, 2026
    'longDate'   → January 22, 2026
    'shortTime'  → 1:30 PM
    ```
  - Formato custom:
    ```html
    {{fechaCompra | date:'dd/MM/yyyy HH:mm'}}
    <!-- Output: 22/01/2026 13:30 -->
    ```

**Pipes puros vs impuros:**
- **Puros (default)**: Solo se ejecutan cuando el valor de entrada cambia
  - Más eficientes (Angular cachea el resultado)
  - `CurrencyPipe`, `DatePipe` son puros
- **Impuros**: Se ejecutan en cada ciclo de detección de cambios
  - Menos eficientes pero detectan cambios internos en objetos/arrays
  - Ejemplo: `AsyncPipe` (subscribe a Observables)

---

### Paso 5: Ejecutar el servidor de desarrollo

```powershell
ng serve
```

Abre http://localhost:4200

**📚 Explicación técnica:**
- Haz click en los botones → Verás `alert('Hola mundo')`
- Observa el precio formateado: `$55.00` (o `55,00 €` según locale)
- Fecha actual en formato corto: `1/22/26`
- Chrome DevTools:
  - Console: Ver cuando se ejecuta `alerta()`
  - Elements: Inspeccionar eventos con `monitorEvents($0, 'click')`

---

## Conceptos Clave Demostrados

✅ **@Output decorator**: Emitir eventos hacia el padre  
✅ **EventEmitter**: Clase para crear eventos custom  
✅ **Event binding**: `(onClick)="metodo()"`  
✅ **Pipes**: Transformación de datos en templates  
✅ **CurrencyPipe**: Formato de moneda  
✅ **DatePipe**: Formato de fechas  
✅ **Comunicación bidireccional**: `@Input` (↓) + `@Output` (↑)  

---

## Arquitectura de Eventos

```
┌────────────────────────────────────────┐
│         App (Padre)                     │
│  alerta() { alert('Hola'); }           │
│                                         │
│  <boton (onClick)="alerta()">          │ ← Escucha evento
└───────────────┬────────────────────────┘
                │ onClick.emit()
                ↑
┌───────────────┴────────────────────────┐
│       Boton (Hijo)                      │
│  @Output() onClick = EventEmitter      │
│  handleOnClick() { onClick.emit(); }   │
│                                         │
│  <button (click)="handleOnClick()">    │ ← Escucha click nativo
└────────────────────────────────────────┘
                ↑
            Usuario click
```

---

## Comparación: Eventos Nativos vs Custom

```html
<!-- Evento nativo (DOM) -->
<button (click)="metodo()">Click</button>
<!-- Angular escucha evento del navegador -->

<!-- Evento custom (Angular) -->
<boton (onClick)="metodo()">Click</boton>
<!-- Angular escucha evento del componente -->
```

**Similitudes:**
- Misma sintaxis de event binding `(evento)="..."`
- Pueden pasar datos: `(evento)="metodo($event)"`

**Diferencias:**
- Nativos: Parte del DOM (click, input, submit)
- Custom: Definidos por el componente con `@Output`

---

## Uso Avanzado de Pipes

```html
<!-- Encadenar pipes -->
{{precio | currency:'EUR':'symbol':'1.2-2' | uppercase}}
<!-- Output: 55,00 € → "55,00 €" (sin cambio porque no hay letras) -->

<!-- Pipe con múltiples parámetros -->
{{fechaCompra | date:'EEEE, d MMMM y':'GMT+1':'es'}}
<!-- Output: miércoles, 22 enero 2026 -->

<!-- Pipe async (para Observables) -->
{{data$ | async}}
<!-- Automáticamente subscribe y unsubscribe -->

<!-- Pipe en ngFor -->
<div *ngFor="let item of items | slice:0:5">
  {{item}}
</div>
<!-- Solo muestra los primeros 5 elementos -->
```

---

## Custom Pipes

Puedes crear tus propios pipes:

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exclaim',
  standalone: true
})
export class ExclaimPipe implements PipeTransform {
  transform(value: string): string {
    return value + '!!!';
  }
}

// Uso: {{texto | exclaim}}
// "Hola" → "Hola!!!"
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
