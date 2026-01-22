import { Component, Input, input, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Boton } from './components/boton/boton';
import { CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Boton, CurrencyPipe, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('proyecto3b');

  alerta() : void {
    alert('Hola mundo');
  }

  @Input() precio:number=55;
  @Input() fechaCompra:Date=new Date();
}
