import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Filter,
} from 'lucide-react';
import { Agendamento, RecursoId, Turno } from '../types';
import {
  HORARIOS_AULAS,
  RECURSOS_DISPONIVEIS,
  TURNOS_CONFIG,
  getRecursoConfig,
} from '../constants/schedule';
import { RecursoIcon } from './RecursoIcon';
import {
  formatarDataBR,
  formatarDataCurta,
  getDiasSemanaUtil,
  MESES_NOMES,
} from '../utils/dateUtils';

interface WeeklyScheduleGridProps {
  currentDate: Date;
  onChangeDate: (d: Date) => void;
  turnoAtivo: Turno;
  onChangeTurno: (t: Turno) => void;
  agendamentos: Agendamento[];
  recursoFiltro: RecursoId | 'todos';
  onChangeRecursoFiltro: (r: RecursoId | 'todos') => void;
  onOpenBooking: (dadosPreDefinidos?: { data?: string; turno?: Turno; aula?: number; recurso?: RecursoId }) => void;
  onEditBooking: (agendamento: Agendamento) => void;
  onDeleteBooking: (agendamento: Agendamento) => void;
}

export const WeeklyScheduleGrid: React.FC<WeeklyScheduleGridProps> = ({
  currentDate,
  onChangeDate,
  turnoAtivo,
  onChangeTurno,
  agendamentos,
  recursoFiltro,
  onChangeRecursoFiltro,
  onOpenBooking,
  onEditBooking,
  onDeleteBooking,
}) => {
  const diasSemana = getDiasSemanaUtil(currentDate, false);
  const horarios = HORARIOS_AULAS[turnoAtivo] || [];

  // Navegação semanal
  const handleSemanaAnterior = () => {
    const novaData = new Date(currentDate);
    novaData.setDate(novaData.getDate() - 7);
    onChangeDate(novaData);
  };

  const handleProximaSemana = () => {
    const novaData = new Date(currentDate);
    novaData.setDate(novaData.getDate() + 7);
    onChangeDate(novaData);
  };

  const handleIrParaHoje = () => {
    onChangeDate(new Date());
  };

  // Alteração direta do mês/ano
  const handleMudarMes = (mesIndex: number) => {
    const novaData = new Date(currentDate);
    novaData.setMonth(mesIndex);
    onChangeDate(novaData);
  };

  const handleMudarAno = (ano: number) => {
    const novaData = new Date(currentDate);
    novaData.setFullYear(ano);
    onChangeDate(novaData);
  };

  const anoAtual = currentDate.getFullYear();
  const mesAtual = currentDate.getMonth();

  return (
    <div className="space-y-4">
      {/* Barra de Controles: Mês, Semana, Turno e Filtro de Recurso */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Controle do Mês e Navegação Semanal */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSemanaAnterior}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Semana anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleIrParaHoje}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={handleProximaSemana}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Próxima semana"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Seletores rápidos de Mês e Ano ("tem como editar o mês") */}
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <select
              value={mesAtual}
              onChange={(e) => handleMudarMes(Number(e.target.value))}
              className="text-sm font-bold text-slate-900 bg-transparent border-0 border-b border-slate-300 focus:outline-none focus:border-blue-600 py-0.5 cursor-pointer"
            >
              {MESES_NOMES.map((nome, idx) => (
                <option key={nome} value={idx}>
                  {nome}
                </option>
              ))}
            </select>
            <select
              value={anoAtual}
              onChange={(e) => handleMudarAno(Number(e.target.value))}
              className="text-sm font-semibold text-slate-700 bg-transparent border-0 border-b border-slate-300 focus:outline-none focus:border-blue-600 py-0.5 cursor-pointer font-mono"
            >
              {[2025, 2026, 2027, 2028].map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            Semana de {formatarDataBR(diasSemana[0].data)} a {formatarDataBR(diasSemana[diasSemana.length - 1].data)}
          </div>
        </div>

        {/* Turnos e Filtro de Recursos */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Seletor de Turno */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['matutino', 'vespertino', 'noturno'] as Turno[]).map((t) => {
              const cfg = TURNOS_CONFIG[t];
              const isAtivo = turnoAtivo === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onChangeTurno(t)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                    isAtivo
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Filtro de Recursos */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={recursoFiltro}
              onChange={(e) => onChangeRecursoFiltro(e.target.value as RecursoId | 'todos')}
              className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              <option value="todos">Todos os Recursos e Espaços</option>
              {RECURSOS_DISPONIVEIS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grade da Semana */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Cabeçalho de Dias da Semana */}
        <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-50/80 text-xs font-semibold">
          <div className="p-3 text-slate-500 border-r border-slate-200 flex items-center justify-center">
            <span>Aulas / Horários</span>
          </div>
          {diasSemana.map((dia) => (
            <div
              key={dia.data}
              className={`p-3 text-center border-r last:border-r-0 border-slate-200 transition-colors ${
                dia.isHoje ? 'bg-blue-50/70 text-blue-900 font-bold' : 'text-slate-700'
              }`}
            >
              <div className="uppercase tracking-wider text-[11px] text-slate-500 font-bold">
                {dia.abrev}
              </div>
              <div className="text-base font-bold font-mono mt-0.5">
                {String(dia.diaNum).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-slate-400 font-normal">
                {formatarDataCurta(dia.data).split(', ')[1]}
              </div>
            </div>
          ))}
        </div>

        {/* Linhas das Aulas (1ª a 5ª Aula) */}
        <div className="divide-y divide-slate-200">
          {horarios.map((horario) => (
            <div key={horario.aula} className="grid grid-cols-6 min-h-[105px]">
              {/* Coluna da Aula e Horário */}
              <div className="p-2.5 sm:p-3 border-r border-slate-200 bg-slate-50/40 flex flex-col justify-center items-center text-center">
                <span className="font-bold text-xs text-slate-900">{horario.rotulo}</span>
                <span className="text-[11px] font-mono text-slate-500 font-medium mt-0.5 whitespace-nowrap">
                  {horario.faixaHorario}
                </span>
                <span className="text-[10px] text-slate-400 capitalize mt-1">
                  {turnoAtivo}
                </span>
              </div>

              {/* Colunas dos Dias da Semana */}
              {diasSemana.map((dia) => {
                // Filtrar agendamentos para este dia, turno e aula
                const agendamentosSlot = agendamentos.filter((ag) => {
                  const matchDia = ag.data === dia.data;
                  const matchTurno = ag.turno === turnoAtivo;
                  const matchAula = ag.aulas.includes(horario.aula);
                  const matchRecurso =
                    recursoFiltro === 'todos' || ag.recursos.includes(recursoFiltro);
                  return matchDia && matchTurno && matchAula && matchRecurso;
                });

                return (
                  <div
                    key={dia.data}
                    className={`p-2 border-r last:border-r-0 border-slate-200 transition-colors flex flex-col gap-1.5 relative group ${
                      dia.isHoje ? 'bg-blue-50/20' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Cards dos Agendamentos neste slot */}
                    {agendamentosSlot.map((ag) => (
                      <div
                        key={ag.id}
                        className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all text-xs flex flex-col justify-between group/card"
                      >
                        <div>
                          {/* Disciplina e Turma */}
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold text-slate-900 truncate leading-snug">
                              {ag.disciplina}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                              {ag.turma}
                            </span>
                          </div>

                          {/* Nome do Professor */}
                          <div className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                            {ag.professor}
                          </div>

                          {/* Recursos reservados */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {ag.recursos.map((recId) => {
                              const rec = getRecursoConfig(recId);
                              return (
                                <span
                                  key={recId}
                                  className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${rec.cor.bg} ${rec.cor.border}`}
                                  title={rec.nome}
                                >
                                  <RecursoIcon id={recId} className="w-3 h-3" />
                                  <span className="truncate max-w-[85px]">{rec.nome.split(' ')[0]}</span>
                                  {recId === 'chromebook' && ag.quantidadeChromebooks && (
                                    <span className="font-mono text-[9px]">({ag.quantidadeChromebooks})</span>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* Botões de Ação Inline (Editar / Excluir) */}
                        <div className="flex items-center justify-end gap-1 pt-1.5 mt-1 border-t border-slate-100 opacity-90 group-hover/card:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => onEditBooking(ag)}
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Editar agendamento"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteBooking(ag)}
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Excluir agendamento"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Botão de Agendamento Rápido no Slot */}
                    <button
                      type="button"
                      onClick={() =>
                        onOpenBooking({
                          data: dia.data,
                          turno: turnoAtivo,
                          aula: horario.aula,
                          recurso: recursoFiltro !== 'todos' ? recursoFiltro : undefined,
                        })
                      }
                      className="w-full mt-auto py-1 text-[11px] font-medium text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 rounded border border-dashed border-slate-200 hover:border-blue-300 flex items-center justify-center gap-1 transition-all opacity-40 hover:opacity-100 group-hover:opacity-100"
                      title={`Reservar na ${horario.rotulo} de ${dia.diaSemana}`}
                    >
                      <Plus className="w-3 h-3" />
                      <span className="text-[10px]">Reservar</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
