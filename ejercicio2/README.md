# Ejercicio 2 - Componente Panel con Material Design

Este proyecto demuestra la integración de **Angular Material** con componentes personalizados, utilizando el sistema de **signals** de Angular y el componente `MatCard`.

## Manual de Creación Paso a Paso

### Paso 1: Crear el proyecto Angular
```powershell
ng new ejercicio2
```

**Opciones durante la creación:**
- ¿Routing? → **No**
- ¿Stylesheet? → **SCSS**

**📚 Explicación técnica:**
- SCSS es necesario para Angular Material, que utiliza SASS para su sistema de theming
- Proyecto simple enfocado en Material Design UI components

---

### Paso 2: Instalar Angular Material
```powershell
cd ejercicio2
ng add @angular/material
```

**Opciones durante la instalación:**
- ¿Pre-built theme? → **Indigo/Pink** (o Custom si prefieres)
- ¿Set up typography? → **Yes**
- ¿Include animations? → **Include and enable**

**📚 Explicación técnica:**
- **`ng add`**: Schematic que automáticamente:
  - Instala `@angular/material`, `@angular/cdk`, `@angular/animations`
  - Configura el theme en `src/styles.scss`
  - Añade Roboto y Material Icons en `index.html`
  - Actualiza `app.config.ts` con `provideAnimations()`
- **CDK (Component Dev Kit)**: Librería de comportamientos reutilizables (drag-drop, overlay, a11y)
- **Animations**: Requeridas para transiciones suaves de Material components

---

### Paso 3: Generar el componente MyPanel
```powershell
ng generate component components/my-panel
```

**📚 Explicación técnica:**
- Se crea un componente personalizado que **envuelve** MatCard
- Patrón de diseño: **Wrapper Component** (adapta un componente de librería externa)
- Beneficios:
  - Abstracción: Oculta la complejidad de Material
  - Reutilización: Configuración centralizada
  - Mantenibilidad: Si cambias de librería UI, solo modificas este componente

---

### Paso 4: Implementar el componente MyPanel

Edita `src/app/components/my-panel/my-panel.ts`:

```typescript
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'my-panel',
  imports: [MatCardModule],
  templateUrl: './my-panel.html',
  styleUrl: './my-panel.scss',
})
export class MyPanel {
  titulo = input<string>('Título');
  tipo = input<string>('normal');
}
```

**📚 Explicación técnica:**
- **`input<string>('Título')`**: Nueva API de signals para inputs (Angular 16+)
  - Reemplaza `@Input() titulo: string = 'Título'`
  - **Ventajas**:
    - Type-safe: TypeScript infiere el tipo automáticamente
    - Rendimiento: Detección de cambios más eficiente (no usa Zone.js)
    - Readonly: No se puede modificar desde dentro del componente
  - **Default value**: 'Título' se usa si el padre no pasa valor
- **`MatCardModule`**: Exporta directivas de Material Card
  - `mat-card`: Contenedor principal
  - `mat-card-header`, `mat-card-title`: Subcomponentes
  - Estilos elevation (sombras), padding, bordes redondeados
- **`tipo`**: Parámetro para controlar estilos (normal, alternativa, peligrosa)

Edita `src/app/components/my-panel/my-panel.html`:

```html
<mat-card [class]="'panel panel--' + tipo()">
  <mat-card-header>
    <mat-card-title>{{titulo()}}</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    Contenido del panel
    <br>
    Más contenido
  </mat-card-content>
</mat-card>
```

**📚 Explicación técnica:**
- **`<mat-card>`**: Componente de Material que implementa Material Design 3 card spec
  - Automáticamente aplica:
    - `elevation` (sombra)
    - `border-radius` (esquinas redondeadas)
    - `padding` interno
    - Transiciones hover
- **`[class]`**: Añade clases CSS dinámicas para estilos custom
  - BEM: `panel--normal`, `panel--alternativa`, `panel--peligrosa`
- **`{{titulo()}}`**: Interpolación de signal
  - **Importante**: Signals son funciones, se llaman con `()`
  - `@Input` clásico sería `{{titulo}}` (sin paréntesis)
- **`<mat-card-header>` y `<mat-card-content>`**: Subcomponentes de Material
  - Estructura semántica y estilos predefinidos
  - `header` tiene alineación especial para títulos/avatares

Edita `src/app/components/my-panel/my-panel.scss`:

```scss
.panel {
  margin-bottom: 20px;
  
  &--normal {
    background-color: #e3f2fd;
    border-left: 4px solid #2196F3;
  }
  
  &--alternativa {
    background-color: #fff3e0;
    border-left: 4px solid #FF9800;
  }
  
  &--peligrosa {
    background-color: #ffebee;
    border-left: 4px solid #F44336;
  }
}
```

**📚 Explicación técnica:**
- **BEM + SCSS nesting**: 
  - `&--normal` se compila a `.panel--normal`
  - Mejora legibilidad y mantiene relación block/modifier
- **Sobrescritura de Material styles**:
  - Material aplica estilos base, nosotros añadimos customización
  - `background-color` sobrescribe el fondo blanco default
  - `border-left`: Indicador visual del tipo (accesibilidad)
- **Material Design colors**:
  - Blue (#2196F3): Información/neutral
  - Orange (#FF9800): Advertencia
  - Red (#F44336): Error/peligro
- **View Encapsulation**:
  - Estos estilos solo afectan a este componente
  - Angular añade atributos únicos: `[_ngcontent-ng-c123]`

---

### Paso 5: Implementar el componente App

Edita `src/app/app.ts`:

```typescript
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyPanel } from './components/my-panel/my-panel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MyPanel],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ejercicio2');
}
```

**📚 Explicación técnica:**
- **`protected readonly title`**: Signal de solo lectura
  - `protected`: Accesible en el template pero no fuera de la clase
  - `readonly`: TypeScript previene reasignación (no confundir con inmutabilidad del valor)
- **Standalone components**: No requiere imports en NgModule
  - Tree-shaking automático: Solo MyPanel se incluye en el bundle

Edita `src/app/app.html`:

```html
<my-panel [titulo]="'Título Normal'" [tipo]="'normal'"></my-panel>
<my-panel [titulo]="'Título Alternativa'" [tipo]="'alternativa'"></my-panel>
<my-panel [titulo]="'Título Peligrosa'" [tipo]="'peligrosa'"></my-panel>
```

**📚 Explicación técnica:**
- **Multiple instances**: Demuestra reutilización del componente
- **Property binding `[titulo]`**: 
  - Pasa valores al signal `input`
  - Angular detecta cambios y actualiza el DOM reactivamente
- **Static values**: Los strings son constantes, pero podrían ser variables:
  ```html
  <my-panel [titulo]="variableDinamica" [tipo]="tipoCalculado"></my-panel>
  ```
- **Performance**: 
  - Cada `<my-panel>` es una instancia separada
  - Angular optimiza con OnPush change detection (default en signals)

---

### Paso 6: Ejecutar el servidor de desarrollo

```powershell
ng serve
```

Abre http://localhost:4200

**📚 Explicación técnica:**
- Verás 3 paneles Material Design con diferentes estilos
- Efectos de Material automáticos:
  - Hover: Elevación aumenta (sombra más pronunciada)
  - Transiciones suaves de color
- Chrome DevTools → Inspect:
  - Ver atributos de encapsulación: `_ngcontent-*`
  - Ver variables CSS de Material: `--mat-card-*`

---

## Conceptos Clave Demostrados

✅ **Angular Material**: Integración de componentes UI de Google  
✅ **Signals API**: `input<T>()` para inputs reactivos  
✅ **MatCard**: Componente de tarjeta con Material Design 3  
✅ **Wrapper Components**: Adaptar componentes de librerías externas  
✅ **BEM + SCSS**: Metodología de nomenclatura con preprocesador  
✅ **View Encapsulation**: Estilos aislados por componente  
✅ **Material Theming**: Sistema de colores y tokens de diseño  

---

## Comparación: @Input vs input() signal

```typescript
// Approach clásico (@Input)
@Input() titulo: string = 'Título';
// En template: {{titulo}}

// Approach moderno (signal)
titulo = input<string>('Título');
// En template: {{titulo()}}
```

**Ventajas de signals:**
- ✅ Detección de cambios granular (solo actualiza lo necesario)
- ✅ Type inference automático
- ✅ Readonly por defecto (inmutabilidad)
- ✅ Composición con `computed()` y `effect()`

---

## Estructura del Componente MyPanel

```
my-panel/
├── my-panel.ts         → Lógica + inputs (titulo, tipo)
├── my-panel.html       → Template con MatCard
├── my-panel.scss       → Estilos BEM customizados
└── my-panel.spec.ts    → Tests unitarios
```

**Responsabilidades:**
- **Presentación**: Muestra UI basada en props
- **Sin lógica de negocio**: Solo recibe datos y renderiza
- **Reutilizable**: Puede usarse en múltiples páginas

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
