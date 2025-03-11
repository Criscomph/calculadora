export interface LoanCalculation {
  dataInicial: string;
  dataFinal: string;
  primeiroPagamento: string;
  valorEmprestimo: number;
  taxaJuros: number;
}

export interface InstallmentDTO {
  dataCompetencia: string;
  valorEmprestimo: number;
  saldoDevedor: number;
  consolidada: number;
  total: number;
  amortizacao: number;
  saldo: number;
  provisao: number;
  acumulado: number;
  pago: number;
} 