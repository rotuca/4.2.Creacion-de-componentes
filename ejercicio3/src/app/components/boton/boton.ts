import { Component, input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

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
