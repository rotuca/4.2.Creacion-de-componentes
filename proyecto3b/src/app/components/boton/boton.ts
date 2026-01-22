import { Component, Input, Output, EventEmitter  } from '@angular/core';
import {CommonModule} from '@angular/common';
 
@Component({
  selector: 'boton',
  imports: [CommonModule],
  templateUrl: './boton.html',
  styleUrl: './boton.scss'
})
export class Boton  {
    @Input() funcion:'normal' | 'alternativa' | 'peligrosa'='normal';
    @Input() href:string="";
    @Output() onClick = new EventEmitter<void>();
 
    handleOnClick(): void {
      this.onClick.emit();
    }
}