import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class CalculadoraComponent {
  dataInicial: string = '';
  dataFinal: string = '';
  primeiroPagamento: string = '';
  valorEmprestimo: number = 0;
  taxaJuros: number = 0;
} 