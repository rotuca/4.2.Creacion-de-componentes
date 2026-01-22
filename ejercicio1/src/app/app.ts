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
