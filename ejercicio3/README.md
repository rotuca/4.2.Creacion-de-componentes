# Ejercicio 3 - Sistema de Botones con Variantes Múltiples

Este proyecto demuestra el uso de **union types de TypeScript** y **signals API** para crear un sistema de botones con múltiples variantes (función + importancia), utilizando Angular Material.

## Manual de Creación Paso a Paso

### Paso 1: Crear el proyecto Angular
```powershell
ng new ejercicio3
```

**Opciones durante la creación:**
- ¿Routing? → **No**
- ¿Stylesheet? → **SCSS**

**📚 Explicación técnica:**
- Proyecto enfocado en **design system**: múltiples variantes de un componente
- Demuestra la potencia de TypeScript para tipos estrictos en componentes UI

---

### Paso 2: Instalar Angular Material
```powershell
cd ejercicio3
ng add @angular/material
```

**Opciones:**
- ¿Pre-built theme? → **Deep Purple/Amber** (o tu preferencia)
- ¿Set up typography? → **Yes**
- ¿Include animations? → **Include and enable**

**📚 Explicación técnica:**
- Material Button (`MatButtonModule`) proporciona variantes: filled, outlined, text
- Usaremos Material como base y añadiremos nuestros estilos custom

---

### Paso 3: Generar el componente Boton
```powershell
ng generate component components/boton
```

**📚 Explicación técnica:**
- Componente reutilizable con **múltiples ejes de variación**:
  - **Función**: normal, alternativa, peligrosa (color)
  - **Importancia**: primaria, secundaria, terciaria (énfasis visual)
- Total de combinaciones: 3 × 3 = **9 variantes** posibles

---

### Paso 4: Implementar el componente Boton

Edita `src/app/components/boton/boton.ts`:

```typescript
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'boton',
  imports: [MatButtonModule],
  templateUrl: './boton.html',
  styleUrl: './boton.scss',
})
export class Boton {
  funcion = input<'normal' | 'alternativa' | 'peligrosa'>('normal');
  importancia = input<'primaria' | 'secundaria' | 'terciaria'>('primaria');
  texto = input<string>('Más información');
}
```

**📚 Explicación técnica:**
- **Union Types** (`'normal' | 'alternativa' | 'peligrosa'`):
  - TypeScript solo permite estos valores exactos
  - Autocompletado en el IDE: `<boton funcion="...">`
  - Error de compilación si pasas valor inválido: `<boton funcion="invalido">`
- **Signal inputs con tipos estrictos**:
  - `input<'normal' | 'alternativa' | 'peligrosa'>()` es **type-safe**
  - Mejor que `input<string>()` (aceptaría cualquier string)
- **Default values**:
  - Si no se pasa `[funcion]`, usa `'normal'`
  - Permite uso simple: `<boton texto="Click aquí"></boton>`
- **Patrón de diseño**: **Variant Component**
  - Un componente con múltiples configuraciones visuales
  - Usado en design systems (Material, Ant Design, Chakra UI)

Edita `src/app/components/boton/boton.html`:

```html
<button 
  [attr.mat-button]="importancia() === 'primaria' ? 'flat' : importancia() === 'secundaria' ? 'outlined' : 'text'"
  [class]="'boton boton--' + funcion() + ' boton--' + importancia()">
  {{texto()}}
</button>
```

**📚 Explicación técnica:**
- **Condicional ternario anidado**:
  - `importancia() === 'primaria' ? 'flat' : ...`
  - Mapea importancia → atributo Material: 
    - primaria → `mat-button="flat"` (sólido)
    - secundaria → `mat-button="outlined"` (borde)
    - terciaria → `mat-button="text"` (solo texto)
- **`[attr.mat-button]`**: Attribute binding dinámico
  - Material Button usa atributos: `<button mat-button="flat">`
  - No es una propiedad DOM, por eso usamos `[attr.*]`
- **BEM classes**: `boton--normal boton--primaria`
  - Múltiples modifiers en un mismo elemento
  - SCSS permite selectores combinados: `.boton--normal.boton--primaria`
- **`{{texto()}}`**: Interpolación de signal
  - Muestra el texto pasado como input

Edita `src/app/components/boton/boton.scss`:

```scss
.boton {
  margin: 8px;
  text-transform: uppercase;
  font-weight: 500;
  
  // Función: COLORES
  &--normal {
    &.boton--primaria { background-color: #2196F3 !important; color: white; }
    &.boton--secundaria { border-color: #2196F3 !important; color: #2196F3; }
    &.boton--terciaria { color: #2196F3; }
  }
  
  &--alternativa {
    &.boton--primaria { background-color: #FF9800 !important; color: white; }
    &.boton--secundaria { border-color: #FF9800 !important; color: #FF9800; }
    &.boton--terciaria { color: #FF9800; }
  }
  
  &--peligrosa {
    &.boton--primaria { background-color: #F44336 !important; color: white; }
    &.boton--secundaria { border-color: #F44336 !important; color: #F44336; }
    &.boton--terciaria { color: #F44336; }
  }
}
```

**📚 Explicación técnica:**
- **Selectores anidados**: `.boton--normal.boton--primaria`
  - Selecciona elementos con AMBAS clases
  - CSS Specificity: Mayor que `.boton--primaria` solo
- **`!important`**: Sobrescribe estilos de Material
  - Material aplica colores con alta especificidad
  - Necesario para que nuestros colores tengan prioridad
  - **Alternativa mejor**: Usar Material theming (más complejo)
- **Colores por función**:
  - **Normal** (azul): Acciones neutras (info, ver más)
  - **Alternativa** (naranja): Acciones secundarias (editar, configurar)
  - **Peligrosa** (rojo): Acciones destructivas (eliminar, cancelar)
- **Importancia por opacidad/énfasis**:
  - **Primaria**: Fondo sólido (máxima atención)
  - **Secundaria**: Solo borde (menos prominente)
  - **Terciaria**: Solo texto (mínima interferencia)
- **Material Design guidelines**:
  - Máximo 1-2 botones primarios por vista
  - Secundarios para acciones alternativas
  - Terciarios para acciones opcionales

---

### Paso 5: Implementar el componente App con Grid

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
  protected readonly title = signal('ejercicio3');
}
```

Edita `src/app/app.html`:

```html
<div class="botones-grid">
  <boton funcion="normal" importancia="primaria" texto="Más información"></boton>
  <boton funcion="alternativa" importancia="primaria" texto="Más información"></boton>
  <boton funcion="peligrosa" importancia="primaria" texto="Más información"></boton>
  
  <boton funcion="normal" importancia="secundaria" texto="Más información"></boton>
  <boton funcion="alternativa" importancia="secundaria" texto="Más información"></boton>
  <boton funcion="peligrosa" importancia="secundaria" texto="Más información"></boton>
  
  <boton funcion="normal" importancia="terciaria" texto="Más información"></boton>
  <boton funcion="alternativa" importancia="terciaria" texto="Más información"></boton>
  <boton funcion="peligrosa" importancia="terciaria" texto="Más información"></boton>
</div>
```

**📚 Explicación técnica:**
- **Grid layout**: Muestra todas las combinaciones visuales
  - 3 columnas (normal, alternativa, peligrosa)
  - 3 filas (primaria, secundaria, terciaria)
- **Design System Documentation**:
  - Esta vista actúa como "component showcase"
  - Similar a Storybook: muestra todas las variantes
- **Ventaja de union types**:
  - Si escribes `funcion="invalido"`, TypeScript marca error ANTES de ejecutar
  - No necesitas validación en runtime

Edita `src/app/app.scss`:

```scss
.botones-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
}
```

**📚 Explicación técnica:**
- **CSS Grid**: Layout bidimensional
  - `repeat(3, 1fr)`: 3 columnas de igual tamaño
  - `gap: 20px`: Espacio entre celdas (no requiere margin en hijos)
- **Responsive**: En móviles podrías cambiar a 1 columna:
  ```scss
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  ```

---

### Paso 6: Ejecutar el servidor de desarrollo

```powershell
ng serve
```

Abre http://localhost:4200

**📚 Explicación técnica:**
- Verás una matriz 3×3 de botones
- Observa los efectos de Material:
  - Ripple effect al click
  - Elevación en primarios
  - Hover states
- Prueba cambiar valores en el template:
  - `funcion="invalido"` → Error de TypeScript
  - `importancia="cuaternaria"` → Error de TypeScript

---

## Conceptos Clave Demostrados

✅ **Union Types**: Tipos estrictos con valores limitados  
✅ **Signal inputs**: API reactiva para inputs  
✅ **Design System**: Componentes con variantes múltiples  
✅ **BEM combinado**: Múltiples modifiers en un elemento  
✅ **Material Button**: Integración con Angular Material  
✅ **CSS Grid**: Layout bidimensional  
✅ **Type Safety**: TypeScript previene errores en compile-time  

---

## Matriz de Variantes

|                | Normal (Azul) | Alternativa (Naranja) | Peligrosa (Rojo) |
|----------------|---------------|------------------------|------------------|
| **Primaria**   | Fondo azul    | Fondo naranja          | Fondo rojo       |
| **Secundaria** | Borde azul    | Borde naranja          | Borde rojo       |
| **Terciaria**  | Texto azul    | Texto naranja          | Texto rojo       |

---

## Comparación: String vs Union Type

```typescript
// ❌ Débilmente tipado
texto = input<string>(); // Acepta cualquier string
<boton funcion="askldjaslkd"> // Compila pero es incorrecto

// ✅ Fuertemente tipado
funcion = input<'normal' | 'alternativa' | 'peligrosa'>();
<boton funcion="askldjaslkd"> // ERROR de TypeScript
```

**Ventajas:**
- Autocompletado en IDE
- Detección de errores antes de ejecutar
- Documentación autogenerada (JSDoc)
- Refactoring seguro

---

## Arquitectura del Sistema de Botones

```
Componente Boton
├── Eje 1: funcion (color)
│   ├── normal      → Azul (#2196F3)
│   ├── alternativa → Naranja (#FF9800)
│   └── peligrosa   → Rojo (#F44336)
│
└── Eje 2: importancia (énfasis)
    ├── primaria    → Filled (fondo sólido)
    ├── secundaria  → Outlined (solo borde)
    └── terciaria   → Text (solo texto)

Total combinaciones: 3 × 3 = 9 variantes
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
