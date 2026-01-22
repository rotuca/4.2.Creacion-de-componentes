import { Component, Input  } from '@angular/core';
import {CommonModule} from '@angular/common';
 
@Component({
  selector: 'boton',
  imports: [CommonModule],
  templateUrl: './boton.html',
  styleUrl: './boton.scss'
})
export class Boton  {
    @Input() funcion:'normal' | 'alternativa' | 'peligrosa'='normal';
}