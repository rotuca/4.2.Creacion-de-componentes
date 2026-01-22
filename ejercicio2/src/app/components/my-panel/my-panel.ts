import { Component, input } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

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
