export type Turno = 'matutino' | 'vespertino' | 'noturno';

export type RecursoId =
  | 'datashow'
  | 'caixa_som'
  | 'chromebook'
  | 'tv'
  | 'biblioteca'
  | 'laboratorio'
  | 'patio';

export interface RecursoConfig {
  id: RecursoId;
  nome: string;
  categoria: 'equipamento' | 'espaco';
  icone: string;
  descricao: string;
  cor: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    light: string;
  };
}

export interface HorarioAula {
  aula: 1 | 2 | 3 | 4 | 5;
  rotulo: string;
  inicio: string;
  fim: string;
  faixaHorario: string;
}

export interface Agendamento {
  id: string;
  data: string; // formato YYYY-MM-DD
  turno: Turno;
  aulas: number[]; // ex: [1, 2] para 1ª e 2ª aula
  turma: string; // ex: "8º Ano A"
  disciplina: string; // ex: "Matemática"
  professor: string; // ex: "Profª. Ana Lopes"
  recursos: RecursoId[]; // ex: ['datashow', 'caixa_som']
  observacao?: string;
  quantidadeChromebooks?: number;
  criadoEm: string;
  atualizadoEm?: string;
}

export type ViewMode = 'semanal' | 'diaria' | 'mensal' | 'lista';

export interface ConflitoAgendamento {
  recursoId: RecursoId;
  aula: number;
  agendamentoExistente: Agendamento;
}
