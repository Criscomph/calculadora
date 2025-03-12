export interface LoanCalculation {
  dataInicial: string;
  dataFinal: string;
  primeiroPagamento: string;
  valorEmprestimo: number;
  taxaJuros: number;
}

export interface InstallmentDTO {
  dataCompetencia: Date;
  valorEmprestimo: number;
  saldoDevedor: number;
  consolidada: string;
  total: number;
  amortizacao: number;
  saldo: number;
  provisao: number;
  acumulado: number;
  pago: number;
} 