import { HorarioAula, RecursoConfig, RecursoId, Turno, Agendamento } from '../types';

export const TURNOS_CONFIG: Record<
  Turno,
  { label: string; descricao: string; cor: string; badgeCor: string; horarTotal: string }
> = {
  matutino: {
    label: 'Matutino',
    descricao: 'Manhã (07:15 às 11:40)',
    cor: 'amber',
    badgeCor: 'bg-amber-100 text-amber-900 border-amber-200',
    horarTotal: '07:15 - 11:40',
  },
  vespertino: {
    label: 'Vespertino',
    descricao: 'Tarde (13:00 às 17:25)',
    cor: 'blue',
    badgeCor: 'bg-blue-100 text-blue-900 border-blue-200',
    horarTotal: '13:00 - 17:25',
  },
  noturno: {
    label: 'Noturno',
    descricao: 'Noite (19:00 às 22:55)',
    cor: 'indigo',
    badgeCor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    horarTotal: '19:00 - 22:55',
  },
};

export const HORARIOS_AULAS: Record<Turno, HorarioAula[]> = {
  matutino: [
    {
      aula: 1,
      rotulo: '1ª Aula',
      inicio: '07:15',
      fim: '08:05',
      faixaHorario: '07:15 - 08:05',
    },
    {
      aula: 2,
      rotulo: '2ª Aula',
      inicio: '08:05',
      fim: '08:55',
      faixaHorario: '08:05 - 08:55',
    },
    {
      aula: 3,
      rotulo: '3ª Aula',
      inicio: '08:55',
      fim: '09:45',
      faixaHorario: '08:55 - 09:45',
    },
    {
      aula: 4,
      rotulo: '4ª Aula',
      inicio: '10:00',
      fim: '10:50',
      faixaHorario: '10:00 - 10:50',
    },
    {
      aula: 5,
      rotulo: '5ª Aula',
      inicio: '10:50',
      fim: '11:40',
      faixaHorario: '10:50 - 11:40',
    },
  ],
  vespertino: [
    {
      aula: 1,
      rotulo: '1ª Aula',
      inicio: '13:00',
      fim: '13:50',
      faixaHorario: '13:00 - 13:50',
    },
    {
      aula: 2,
      rotulo: '2ª Aula',
      inicio: '13:50',
      fim: '14:40',
      faixaHorario: '13:50 - 14:40',
    },
    {
      aula: 3,
      rotulo: '3ª Aula',
      inicio: '14:40',
      fim: '15:30',
      faixaHorario: '14:40 - 15:30',
    },
    {
      aula: 4,
      rotulo: '4ª Aula',
      inicio: '15:45',
      fim: '16:35',
      faixaHorario: '15:45 - 16:35',
    },
    {
      aula: 5,
      rotulo: '5ª Aula',
      inicio: '16:35',
      fim: '17:25',
      faixaHorario: '16:35 - 17:25',
    },
  ],
  noturno: [
    {
      aula: 1,
      rotulo: '1ª Aula',
      inicio: '19:00',
      fim: '19:45',
      faixaHorario: '19:00 - 19:45',
    },
    {
      aula: 2,
      rotulo: '2ª Aula',
      inicio: '19:45',
      fim: '20:30',
      faixaHorario: '19:45 - 20:30',
    },
    {
      aula: 3,
      rotulo: '3ª Aula',
      inicio: '20:30',
      fim: '21:15',
      faixaHorario: '20:30 - 21:15',
    },
    {
      aula: 4,
      rotulo: '4ª Aula',
      inicio: '21:25',
      fim: '22:10',
      faixaHorario: '21:25 - 22:10',
    },
    {
      aula: 5,
      rotulo: '5ª Aula',
      inicio: '22:10',
      fim: '22:55',
      faixaHorario: '22:10 - 22:55',
    },
  ],
};

export const RECURSOS_DISPONIVEIS: RecursoConfig[] = [
  {
    id: 'datashow',
    nome: 'Datashow (Projetor)',
    categoria: 'equipamento',
    icone: 'Projector',
    descricao: 'Projetor multimídia com entrada HDMI e VGA',
    cor: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      text: 'text-emerald-700',
      border: 'border-emerald-300',
      badge: 'bg-emerald-100 text-emerald-800',
      light: 'bg-emerald-500',
    },
  },
  {
    id: 'caixa_som',
    nome: 'Caixa de Som',
    categoria: 'equipamento',
    icone: 'Speaker',
    descricao: 'Caixa de som amplificada com microfone sem fio',
    cor: {
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      text: 'text-blue-700',
      border: 'border-blue-300',
      badge: 'bg-blue-100 text-blue-800',
      light: 'bg-blue-500',
    },
  },
  {
    id: 'chromebook',
    nome: 'Chromebook',
    categoria: 'equipamento',
    icone: 'Laptop',
    descricao: 'Carrinho móvel com computadores portáteis',
    cor: {
      bg: 'bg-sky-50 text-sky-800 border-sky-200',
      text: 'text-sky-700',
      border: 'border-sky-300',
      badge: 'bg-sky-100 text-sky-800',
      light: 'bg-sky-500',
    },
  },
  {
    id: 'tv',
    nome: 'TV',
    categoria: 'equipamento',
    icone: 'Tv',
    descricao: 'Smart TV móvel em suporte com rodas',
    cor: {
      bg: 'bg-purple-50 text-purple-800 border-purple-200',
      text: 'text-purple-700',
      border: 'border-purple-300',
      badge: 'bg-purple-100 text-purple-800',
      light: 'bg-purple-500',
    },
  },
  {
    id: 'biblioteca',
    nome: 'Biblioteca',
    categoria: 'espaco',
    icone: 'BookOpen',
    descricao: 'Espaço de leitura e pesquisa em grupo',
    cor: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      text: 'text-amber-700',
      border: 'border-amber-300',
      badge: 'bg-amber-100 text-amber-800',
      light: 'bg-amber-500',
    },
  },
  {
    id: 'laboratorio',
    nome: 'Laboratório',
    categoria: 'espaco',
    icone: 'FlaskConical',
    descricao: 'Laboratório de ciências / informática',
    cor: {
      bg: 'bg-teal-50 text-teal-800 border-teal-200',
      text: 'text-teal-700',
      border: 'border-teal-300',
      badge: 'bg-teal-100 text-teal-800',
      light: 'bg-teal-500',
    },
  },
  {
    id: 'patio',
    nome: 'Pátio',
    categoria: 'espaco',
    icone: 'MapPin',
    descricao: 'Área coberta e externa para atividades práticas',
    cor: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      text: 'text-rose-700',
      border: 'border-rose-300',
      badge: 'bg-rose-100 text-rose-800',
      light: 'bg-rose-500',
    },
  },
];

export const DISCIPLINAS_SUGESTOES = [
  'Língua Portuguesa',
  'Matemática',
  'História',
  'Geografia',
  'Ciências',
  'Biologia',
  'Física',
  'Química',
  'Língua Inglesa',
  'Artes',
  'Educação Física',
  'Filosofia',
  'Sociologia',
  'Redação',
  'Robótica e Tecnologia',
  'Projeto de Vida',
];

export const TURMAS_SUGESTOES = [
  '6º Ano A',
  '6º Ano B',
  '7º Ano A',
  '7º Ano B',
  '8º Ano A',
  '8º Ano B',
  '9º Ano A',
  '9º Ano B',
  '1ª Série EM A',
  '1ª Série EM B',
  '2ª Série EM A',
  '2ª Série EM B',
  '3ª Série EM',
  'EJA - Segmento I',
  'EJA - Segmento II',
];

export const PROFESSORES_SUGESTOES = [
  'Profª. Ana Lopes',
  'Prof. Carlos Eduardo',
  'Profª. Juliana Silva',
  'Prof. Roberto Santos',
  'Profª. Mariana Costa',
  'Prof. Rodrigo Lima',
  'Profª. Fernanda Rocha',
  'Prof. Marcelo Oliveira',
];

// Helper to get resource by ID
export function getRecursoConfig(id: RecursoId): RecursoConfig {
  const found = RECURSOS_DISPONIVEIS.find((r) => r.id === id);
  if (found) return found;
  return {
    id,
    nome: id,
    categoria: 'equipamento',
    icone: 'Box',
    descricao: '',
    cor: {
      bg: 'bg-slate-100 text-slate-800 border-slate-200',
      text: 'text-slate-700',
      border: 'border-slate-300',
      badge: 'bg-slate-100 text-slate-800',
      light: 'bg-slate-500',
    },
  };
}

// Generate realistic seed bookings centered on current date
export function gerarDadosIniciais(): Agendamento[] {
  const hoje = new Date();
  const formatData = (d: Date) => d.toISOString().split('T')[0];

  const offsetData = (dias: number) => {
    const d = new Date(hoje);
    d.setDate(d.getDate() + dias);
    return formatData(d);
  };

  return [
    {
      id: 'seed-1',
      data: offsetData(0), // hoje
      turno: 'matutino',
      aulas: [1, 2],
      turma: '9º Ano A',
      disciplina: 'Ciências',
      professor: 'Profª. Ana Lopes',
      recursos: ['datashow', 'caixa_som'],
      observacao: 'Apresentação de vídeo sobre células e genética. Precisa de cabo HDMI.',
      criadoEm: new Date().toISOString(),
    },
    {
      id: 'seed-2',
      data: offsetData(0), // hoje
      turno: 'matutino',
      aulas: [4, 5],
      turma: '1ª Série EM A',
      disciplina: 'Física',
      professor: 'Prof. Carlos Eduardo',
      recursos: ['laboratorio'],
      observacao: 'Experimento sobre refração da luz e óptica.',
      criadoEm: new Date().toISOString(),
    },
    {
      id: 'seed-3',
      data: offsetData(0), // hoje
      turno: 'vespertino',
      aulas: [1, 2],
      turma: '8º Ano B',
      disciplina: 'História',
      professor: 'Profª. Mariana Costa',
      recursos: ['chromebook'],
      quantidadeChromebooks: 25,
      observacao: 'Pesquisa orientada sobre a Revolução Industrial.',
      criadoEm: new Date().toISOString(),
    },
    {
      id: 'seed-4',
      data: offsetData(0), // hoje
      turno: 'vespertino',
      aulas: [3],
      turma: '7º Ano A',
      disciplina: 'Língua Portuguesa',
      professor: 'Profª. Juliana Silva',
      recursos: ['biblioteca'],
      observacao: 'Roda de leitura e escolha de livros paradidáticos.',
      criadoEm: new Date().toISOString(),
    },
    {
      id: 'seed-5',
      data: offsetData(1), // amanhã
      turno: 'matutino',
      aulas: [2, 3],
      turma: '2ª Série EM A',
      disciplina: 'Matemática',
      professor: 'Prof. Rodrigo Lima',
      recursos: ['datashow', 'chromebook'],
      quantidadeChromebooks: 30,
      observacao: 'Uso de software GeoGebra com os alunos.',
      criadoEm: new Date().toISOString(),
    },
    {
      id: 'seed-6',
      data: offsetData(1), // amanhã
      turno: 'vespertino',
      aulas: [4, 5],
      turma: '6º Ano A',
      disciplina: 'Educação Física',
      professor: 'Prof. Marcelo Oliveira',
      recursos: ['patio', 'caixa_som'],
      observacao: 'Circuito de atividades psicomotoras e dança.',
      criadoEm: new Date().toISOString(),
    },
    {
      id: 'seed-7',
      data: offsetData(2), // depois de amanhã
      turno: 'noturno',
      aulas: [1, 2],
      turma: 'EJA - Segmento II',
      disciplina: 'Informática e Cidadania',
      professor: 'Prof. Roberto Santos',
      recursos: ['datashow', 'tv'],
      observacao: 'Oficina de elaboração de currículos e portais governamentais.',
      criadoEm: new Date().toISOString(),
    },
  ];
}
