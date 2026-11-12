import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Edit2,
  Trash2,
  Clock,
} from 'lucide-react';
import { Agendamento, RecursoId, Turno } from '../types';
import {
  RECURSOS_DISPONIVEIS,
  TURNOS_CONFIG,
  getRecursoConfig,
} from '../constants/schedule';
import { RecursoIcon } from './RecursoIcon';
import {
  DIAS_SEMANA_ABREV,
  MESES_NOMES,
  formatarDataBR,
  formatarDataExtenso,
  formatarDataISO,
  getDiasCalendarioMes,
} from '../utils/dateUtils';

interface MonthlyCalendarViewProps {
  currentDate: Date;
  onChangeDate: (d: Date) => void;
  agendamentos: Agendamento[];
  onOpenBooking: (dados?: { data?: string; turno?: Turno; aula?: number; recurso?: RecursoId }) => void;
  onEditBooking: (agendamento: Agendamento) => void;
  onDeleteBooking: (agendamento: Agendamento) => void;
}

export const MonthlyCalendarView: React.FC<MonthlyCalendarViewProps> = ({
  currentDate,
  onChangeDate,
  agendamentos,
  onOpenBooking,
  onEditBooking,
  onDeleteBooking,
}) => {
  const ano = currentDate.getFullYear();
  const mesIndex = currentDate.getMonth();

  const [diaSelecionadoStr, setDiaSelecionadoStr] = useState<string>(
    formatarDataISO(currentDate)
  );

  const diasGrade = getDiasCalendarioMes(ano, mesIndex);

  const handleMesAnterior = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    onChangeDate(d);
  };

  const handleProximoMes = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    onChangeDate(d);
  };

  const handleMudarMes = (novoMes: number) => {
    const d = new Date(currentDate);
    d.setMonth(novoMes);
    onChangeDate(d);
  };

  const handleMudarAno = (novoAno: number) => {
    const d = new Date(currentDate);
    d.setFullYear(novoAno);
    onChangeDate(novoAno === ano ? d : new Date(novoAno, mesIndex, 1));
  };

  const agendamentosDiaSelecionado = agendamentos.filter(
    (a) => a.data === diaSelecionadoStr
  );

  return (
    <div className="space-y-6">
      {/* Controles do Mês / Navegação ("editar o mês") */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleMesAnterior}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                const hoje = new Date();
                onChangeDate(hoje);
                setDiaSelecionadoStr(formatarDataISO(hoje));
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              Mês Atual
            </button>
            <button
              type="button"
              onClick={handleProximoMes}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Próximo mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Seletores de Edição de Mês e Ano */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-400" />
            <select
              value={mesIndex}
              onChange={(e) => handleMudarMes(Number(e.target.value))}
              className="text-base font-bold text-slate-900 bg-transparent border-0 border-b-2 border-slate-300 focus:outline-none focus:border-blue-600 py-0.5 cursor-pointer"
            >
              {MESES_NOMES.map((nome, idx) => (
                <option key={nome} value={idx}>
                  {nome}
                </option>
              ))}
            </select>
            <select
              value={ano}
              onChange={(e) => handleMudarAno(Number(e.target.value))}
              className="text-base font-bold text-slate-800 bg-transparent border-0 border-b-2 border-slate-300 focus:outline-none focus:border-blue-600 py-0.5 cursor-pointer font-mono"
            >
              {[2024, 2025, 2026, 2027, 2028].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Clique em qualquer dia para ver os detalhes ou reservar
          </span>
        </div>
      </div>

      {/* Grid do Calendário Mensal e Painel Lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendário (8 colunas no desktop) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Dias da Semana (Dom a Sáb) */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center text-xs font-semibold py-2.5">
            {DIAS_SEMANA_ABREV.map((d) => (
              <span key={d} className="text-slate-500 uppercase tracking-wider">
                {d}
              </span>
            ))}
          </div>

          {/* Células dos Dias */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 border-b border-slate-200">
            {diasGrade.map((diaObj, index) => {
              const agsDesteDia = agendamentos.filter((a) => a.data === diaObj.data);
              const isSelected = diaSelecionadoStr === diaObj.data;

              return (
                <div
                  key={diaObj.data + index}
                  onClick={() => setDiaSelecionadoStr(diaObj.data)}
                  className={`min-h-[92px] p-2 transition-all cursor-pointer flex flex-col justify-between ${
                    diaObj.mesmoMes ? 'bg-white' : 'bg-slate-50/40 opacity-40'
                  } ${
                    isSelected
                      ? 'ring-2 ring-blue-600 bg-blue-50/20 z-10'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        diaObj.isHoje
                          ? 'bg-blue-600 text-white'
                          : diaObj.mesmoMes
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {diaObj.diaNum}
                    </span>

                    {agsDesteDia.length > 0 && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 rounded-full">
                        {agsDesteDia.length}
                      </span>
                    )}
                  </div>

                  {/* Badges de visualização rápida de recursos */}
                  <div className="space-y-1 my-1">
                    {agsDesteDia.slice(0, 2).map((ag) => (
                      <div
                        key={ag.id}
                        className="text-[10px] truncate px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-medium"
                      >
                        {ag.disciplina} ({ag.turma})
                      </div>
                    ))}
                    {agsDesteDia.length > 2 && (
                      <div className="text-[9px] text-slate-400 font-medium pl-1">
                        +{agsDesteDia.length - 2} outro(s)
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {agsDesteDia.map((a) => (
                      <span
                        key={a.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          a.turno === 'matutino'
                            ? 'bg-amber-400'
                            : a.turno === 'vespertino'
                            ? 'bg-blue-400'
                            : 'bg-indigo-400'
                        }`}
                        title={`${a.disciplina} (${a.turno})`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legenda de turnos */}
          <div className="p-3 bg-slate-50 text-xs text-slate-500 flex flex-wrap items-center gap-4">
            <span className="font-semibold text-slate-700">Turnos:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Matutino</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span>Vespertino</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span>Noturno</span>
            </div>
          </div>
        </div>

        {/* Detalhes do Dia Selecionado (4 colunas no desktop) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {formatarDataBR(diaSelecionadoStr)}
                </h3>
                <p className="text-xs text-slate-500 capitalize">
                  {formatarDataExtenso(diaSelecionadoStr).split(', ')[0]}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenBooking({ data: diaSelecionadoStr })}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Reservar</span>
              </button>
            </div>

            {/* Lista dos Agendamentos neste dia */}
            <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {agendamentosDiaSelecionado.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Nenhum agendamento para este dia.</p>
                  <button
                    type="button"
                    onClick={() => onOpenBooking({ data: diaSelecionadoStr })}
                    className="text-xs text-blue-600 hover:underline font-semibold mt-2 inline-block"
                  >
                    + Criar primeiro agendamento
                  </button>
                </div>
              ) : (
                agendamentosDiaSelecionado.map((ag) => (
                  <div
                    key={ag.id}
                    className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg transition-colors text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm">
                          {ag.disciplina}
                        </div>
                        <div className="text-slate-600 font-medium">
                          {ag.professor} · {ag.turma}
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          TURNOS_CONFIG[ag.turno].badgeCor
                        }`}
                      >
                        {ag.turno}
                      </span>
                    </div>

                    <div className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>
                        Aulas: {ag.aulas.map((a) => `${a}ª`).join(', ')} aula
                      </span>
                    </div>

                    {/* Recursos */}
                    <div className="flex flex-wrap gap-1">
                      {ag.recursos.map((recId) => {
                        const rec = getRecursoConfig(recId);
                        return (
                          <span
                            key={recId}
                            className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${rec.cor.bg} ${rec.cor.border}`}
                          >
                            <RecursoIcon id={recId} className="w-3 h-3" />
                            <span>{rec.nome}</span>
                          </span>
                        );
                      })}
                    </div>

                    {ag.observacao && (
                      <p className="text-[11px] text-slate-500 italic">
                        "{ag.observacao}"
                      </p>
                    )}

                    {/* Ações de Edição e Exclusão */}
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => onEditBooking(ag)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        Editar
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => onDeleteBooking(ag)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
