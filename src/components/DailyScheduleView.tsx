import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
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
  formatarDataExtenso,
  formatarDataISO,
} from '../utils/dateUtils';

interface DailyScheduleViewProps {
  currentDate: Date;
  onChangeDate: (d: Date) => void;
  agendamentos: Agendamento[];
  onOpenBooking: (dados?: { data?: string; turno?: Turno; aula?: number; recurso?: RecursoId }) => void;
  onEditBooking: (agendamento: Agendamento) => void;
  onDeleteBooking: (agendamento: Agendamento) => void;
}

export const DailyScheduleView: React.FC<DailyScheduleViewProps> = ({
  currentDate,
  onChangeDate,
  agendamentos,
  onOpenBooking,
  onEditBooking,
  onDeleteBooking,
}) => {
  const dataISO = formatarDataISO(currentDate);

  const agendamentosDoDia = agendamentos.filter((a) => a.data === dataISO);

  const irDiaAnterior = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    onChangeDate(d);
  };

  const irProximoDia = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    onChangeDate(d);
  };

  const irHoje = () => {
    onChangeDate(new Date());
  };

  const turnos: Turno[] = ['matutino', 'vespertino', 'noturno'];

  return (
    <div className="space-y-6">
      {/* Navegação de Data Diária */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={irDiaAnterior}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Dia anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={irHoje}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={irProximoDia}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Próximo dia"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="relative ml-2">
            <input
              type="date"
              value={dataISO}
              onChange={(e) => {
                if (e.target.value) {
                  const [ano, mes, dia] = e.target.value.split('-').map(Number);
                  onChangeDate(new Date(ano, mes - 1, dia));
                }
              }}
              className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-700 font-medium cursor-pointer"
            />
          </div>
        </div>

        <div className="text-center sm:text-right">
          <div className="text-base font-bold text-slate-900">
            {formatarDataExtenso(dataISO)}
          </div>
          <div className="text-xs text-slate-500">
            {agendamentosDoDia.length} agendamento(s) programado(s) para este dia
          </div>
        </div>
      </div>

      {/* Panorama dos 7 Recursos no Dia */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          Status dos Recursos e Espaços no Dia
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {RECURSOS_DISPONIVEIS.map((rec) => {
            const agsComRecurso = agendamentosDoDia.filter((a) =>
              a.recursos.includes(rec.id)
            );
            const estaEmUso = agsComRecurso.length > 0;

            return (
              <div
                key={rec.id}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  estaEmUso
                    ? 'border-blue-200 bg-blue-50/50 text-slate-900'
                    : 'border-slate-200 bg-slate-50/50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-1.5 rounded-md ${
                      estaEmUso ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <RecursoIcon id={rec.id} className="w-3.5 h-3.5" />
                  </div>
                  {estaEmUso ? (
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-full">
                      {agsComRecurso.length} aula(s)
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Livre</span>
                  )}
                </div>
                <div className="font-semibold text-xs truncate leading-snug">{rec.nome}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Os 3 Turnos: Matutino, Vespertino e Noturno */}
      <div className="space-y-6">
        {turnos.map((turno) => {
          const cfgTurno = TURNOS_CONFIG[turno];
          const horarios = HORARIOS_AULAS[turno];
          const agsDoTurno = agendamentosDoDia.filter((a) => a.turno === turno);

          return (
            <div
              key={turno}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* Header do Turno */}
              <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/90 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-slate-900">
                    Turno {cfgTurno.label}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ({cfgTurno.horarTotal})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">
                    {agsDoTurno.length} atividade(s) agendada(s)
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenBooking({ data: dataISO, turno })}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Adicionar no {cfgTurno.label}
                  </button>
                </div>
              </div>

              {/* Tabela das 5 Aulas deste Turno */}
              <div className="divide-y divide-slate-200">
                {horarios.map((horario) => {
                  const agsDestaAula = agsDoTurno.filter((a) =>
                    a.aulas.includes(horario.aula)
                  );

                  return (
                    <div
                      key={horario.aula}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Horário da Aula */}
                      <div className="flex items-center gap-3 md:w-48 shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center font-mono">
                          {horario.aula}ª
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">
                            {horario.rotulo}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 font-medium">
                            {horario.faixaHorario}
                          </div>
                        </div>
                      </div>

                      {/* Agendamentos na aula */}
                      <div className="flex-1">
                        {agsDestaAula.length === 0 ? (
                          <div className="text-xs text-slate-400 italic flex items-center gap-1.5">
                            <span>Nenhum recurso reservado neste horário</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {agsDestaAula.map((ag) => (
                              <div
                                key={ag.id}
                                className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-slate-900">
                                      {ag.disciplina}
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-500">
                                      · {ag.turma}
                                    </span>
                                    <span className="text-[11px] font-medium text-blue-700">
                                      · {ag.professor}
                                    </span>
                                  </div>
                                  {ag.observacao && (
                                    <div className="text-xs text-slate-500 mt-1 italic">
                                      "{ag.observacao}"
                                    </div>
                                  )}
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {ag.recursos.map((recId) => {
                                      const rec = getRecursoConfig(recId);
                                      return (
                                        <span
                                          key={recId}
                                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border ${rec.cor.bg} ${rec.cor.border}`}
                                        >
                                          <RecursoIcon id={recId} className="w-3 h-3" />
                                          <span>{rec.nome}</span>
                                          {recId === 'chromebook' && ag.quantidadeChromebooks && (
                                            <span className="font-mono text-[10px]">
                                              ({ag.quantidadeChromebooks} unid.)
                                            </span>
                                          )}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => onEditBooking(ag)}
                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Editar"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDeleteBooking(ag)}
                                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Excluir"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Botão de Agendar rápido nesta aula */}
                      <div className="shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            onOpenBooking({ data: dataISO, turno, aula: horario.aula })
                          }
                          className="px-3 py-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Reservar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
