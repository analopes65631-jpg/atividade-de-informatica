export const DIAS_SEMANA_NOMES = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export const DIAS_SEMANA_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const MESES_NOMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

// Retorna data formatada YYYY-MM-DD
export function formatarDataISO(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

// Converte string YYYY-MM-DD em objeto Date local sem timezone shift
export function parseDataISO(dataStr: string): Date {
  const [ano, mes, dia] = dataStr.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

// Formato brasileiro: 29/10/2026
export function formatarDataBR(dataStr: string): string {
  if (!dataStr) return '';
  const [ano, mes, dia] = dataStr.split('-');
  return `${dia}/${mes}/${ano}`;
}

// Formato por extenso: Quinta-feira, 29 de Outubro de 2026
export function formatarDataExtenso(dataStr: string): string {
  if (!dataStr) return '';
  const d = parseDataISO(dataStr);
  const diaSemana = DIAS_SEMANA_NOMES[d.getDay()];
  const dia = d.getDate();
  const mes = MESES_NOMES[d.getMonth()];
  const ano = d.getFullYear();
  return `${diaSemana}, ${dia} de ${mes} de ${ano}`;
}

// Formato curto de cabeçalho: Seg, 29/10
export function formatarDataCurta(dataStr: string): string {
  if (!dataStr) return '';
  const d = parseDataISO(dataStr);
  const diaSemana = DIAS_SEMANA_ABREV[d.getDay()];
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${diaSemana}, ${dia}/${mes}`;
}

// Obter os dias da semana útil (Segunda a Sexta ou Sábado) para uma data de referência
export function getDiasSemanaUtil(dataReferencia: Date, incluirSabado = false): { data: string; dateObj: Date; diaSemana: string; abrev: string; diaNum: number; isHoje: boolean }[] {
  const d = new Date(dataReferencia);
  const diaDaSemana = d.getDay(); // 0 = Domingo, 1 = Segunda, etc.
  
  // Calcular a segunda-feira daquela semana
  // Se for domingo (0), a segunda foi há 6 dias atrás ou amanhã? Geralmente semana escolar inicia na segunda.
  const diffParaSegunda = diaDaSemana === 0 ? -6 : 1 - diaDaSemana;
  const segunda = new Date(d);
  segunda.setDate(d.getDate() + diffParaSegunda);

  const totalDias = incluirSabado ? 6 : 5;
  const resultado = [];
  const hojeStr = formatarDataISO(new Date());

  for (let i = 0; i < totalDias; i++) {
    const diaAtual = new Date(segunda);
    diaAtual.setDate(segunda.getDate() + i);
    const dataISO = formatarDataISO(diaAtual);

    resultado.push({
      data: dataISO,
      dateObj: diaAtual,
      diaSemana: DIAS_SEMANA_NOMES[diaAtual.getDay()],
      abrev: DIAS_SEMANA_ABREV[diaAtual.getDay()],
      diaNum: diaAtual.getDate(),
      isHoje: dataISO === hojeStr,
    });
  }

  return resultado;
}

// Obter dias do mês para a grade de calendário mensal
export function getDiasCalendarioMes(ano: number, mesZeroIndex: number): {
  data: string;
  diaNum: number;
  mesmoMes: boolean;
  isHoje: boolean;
  dateObj: Date;
}[] {
  const hojeStr = formatarDataISO(new Date());
  const primeiroDia = new Date(ano, mesZeroIndex, 1);
  const ultimoDia = new Date(ano, mesZeroIndex + 1, 0);

  // Dia da semana do 1º dia (0 = Domingo)
  const primeiroDiaSemana = primeiroDia.getDay();
  // Quantos dias do mês anterior precisamos mostrar para começar no Domingo
  const diasMesAnterior = primeiroDiaSemana;

  const resultado = [];

  // Dias do mês anterior
  for (let i = diasMesAnterior - 1; i >= 0; i--) {
    const d = new Date(ano, mesZeroIndex, 1 - (i + 1));
    const dataISO = formatarDataISO(d);
    resultado.push({
      data: dataISO,
      diaNum: d.getDate(),
      mesmoMes: false,
      isHoje: dataISO === hojeStr,
      dateObj: d,
    });
  }

  // Dias do mês atual
  for (let d = 1; d <= ultimoDia.getDate(); d++) {
    const dataAtual = new Date(ano, mesZeroIndex, d);
    const dataISO = formatarDataISO(dataAtual);
    resultado.push({
      data: dataISO,
      diaNum: d,
      mesmoMes: true,
      isHoje: dataISO === hojeStr,
      dateObj: dataAtual,
    });
  }

  // Preencher até completar múltiplos de 7 (geralmente 35 ou 42 slots)
  const totalSlots = Math.ceil(resultado.length / 7) * 7;
  const diasFaltantes = totalSlots - resultado.length;
  for (let i = 1; i <= diasFaltantes; i++) {
    const d = new Date(ano, mesZeroIndex + 1, i);
    const dataISO = formatarDataISO(d);
    resultado.push({
      data: dataISO,
      diaNum: d.getDate(),
      mesmoMes: false,
      isHoje: dataISO === hojeStr,
      dateObj: d,
    });
  }

  return resultado;
}
