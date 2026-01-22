import { Component, EventEmitter, input, Input, Output  } from '@angular/core';
import {CommonModule} from '@angular/common';
import { Boton } from '../boton/boton';
import { v4 as uuidv4 } from 'uuid';
 
@Component({
  selector: 'barraProgreso',
  imports: [CommonModule, Boton],
  templateUrl: './barraProgreso.html',
  styleUrl: './barraProgreso.scss'
})
export class BarraProgreso  {
    @Input() title:string='archivo procesado';
    @Input() porcentajeRealizado:number=0;
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