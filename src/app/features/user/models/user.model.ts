export interface User {
  idusu: number;
  cliente?: ClientData | null;
  nome: string;
  email: string;
  senha?: string;
}

export interface ClientData {
  id?: number;
  nomeCliente?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  telefone?: string;
  email?: string;
  cpfCnpj?: string;
  inscricaoEst?: string;
  numUsuarios?: number;
  dtaInclu?: string;
}
