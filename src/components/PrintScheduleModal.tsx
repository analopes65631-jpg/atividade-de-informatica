import React, { useState } from 'react';
import { X, Printer, Calendar } from 'lucide-react';
import { Agendamento, Turno } from '../types';
import {
  HORARIOS_AULAS,
  RECURSOS_DISPONIVEIS,
  TURNOS_CONFIG,
  getRecursoConfig,
} from '../constants/schedule';
import {
  formatarDataBR,
  formatarDataExtenso,
  formatarDataISO,
  getDiasSemanaUtil,
} from '../utils/dateUtils';

interface PrintScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  agendamentos: Agendamento[];
  currentDate: Date;
}

export const PrintScheduleModal: React.FC<PrintScheduleModalProps> = ({
  isOpen,
  onClose,
  agendamentos,
  currentDate,
}) => {
  const [modoImpressao, setModoImpressao] = useState<'dia' | 'semana'>('dia');
  const [dataSelecionada, setDataSelecionada] = useState<string>(
    formatarDataISO(currentDate)
  );

  if (!isOpen) return null;

  const diasSemana = getDiasSemanaUtil(new Date(dataSelecionada + 'T12:00:00'));

  const handleImprimir = () => {
    window.print();
  };

  const turnos: Turno[] = ['matutino', 'vespertino', 'noturno'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Controles de Configuração da Impressão (não imprimem) */}
        <div className="no-print p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Imprimir Mapa de Agendamento Multimídia
            </h2>
            <p className="text-xs text-slate-500">
              Relatório formatado para afixar no mural da escola ou sala dos professores
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 text-xs">
              <button
                type="button"
                onClick={() => setModoImpressao('dia')}
                className={`px-3 py-1 rounded font-medium ${
                  modoImpressao === 'dia' ? 'bg-blue-600 text-white' : 'text-slate-600'
                }`}
              >
                Imprimir Dia
              </button>
              <button
                type="button"
                onClick={() => setModoImpressao('semana')}
                className={`px-3 py-1 rounded font-medium ${
                  modoImpressao === 'semana' ? 'bg-blue-600 text-white' : 'text-slate-600'
                }`}
              >
                Imprimir Semana Inteira
              </button>
            </div>

            <input
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
              className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800"
            />

            <button
              type="button"
              onClick={handleImprimir}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Agora</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Folha de Visualização / Impressão */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1 text-slate-900">
          {/* Cabeçalho do Relatório */}
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
              Controle de Agendamento Multimídia e Espaços
            </h1>
            <p className="text-sm font-semibold text-slate-700 mt-1">
              {modoImpressao === 'dia'
                ? formatarDataExtenso(dataSelecionada)
                : `Semana de ${formatarDataBR(diasSemana[0].data)} a ${formatarDataBR(
                    diasSemana[diasSemana.length - 1].data
                  )}`}
            </p>
            <div className="flex justify-center gap-6 text-xs text-slate-500 mt-2 font-mono">
              <span>Matutino: 07:15 às 11:40</span>
              <span>·</span>
              <span>Vespertino: 13:00 às 17:25</span>
              <span>·</span>
              <span>Noturno: 19:00 às 22:55</span>
            </div>
          </div>

          {/* Se for modo Dia */}
          {modoImpressao === 'dia' && (
            <div className="space-y-6">
              {turnos.map((turno) => {
                const cfg = TURNOS_CONFIG[turno];
                const horarios = HORARIOS_AULAS[turno];
                const agsTurno = agendamentos.filter(
                  (a) => a.data === dataSelecionada && a.turno === turno
                );

                return (
                  <div key={turno} className="space-y-2">
                    <div className="bg-slate-100 px-3 py-1.5 border border-slate-300 font-bold text-xs uppercase tracking-wide flex justify-between">
                      <span>Turno {cfg.label}</span>
                      <span className="font-mono text-slate-600 font-normal">
                        {cfg.horarTotal}
                      </span>
                    </div>

                    <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-300 font-semibold text-slate-700">
                          <th className="p-2 border-r border-slate-300 w-36">Aula / Horário</th>
                          <th className="p-2 border-r border-slate-300">Disciplina & Turma</th>
                          <th className="p-2 border-r border-slate-300">Professor(a)</th>
                          <th className="p-2 border-r border-slate-300">Recurso(s) Reservado(s)</th>
                          <th className="p-2">Obs. / Atividade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {horarios.map((h) => {
                          const agsDestaAula = agsTurno.filter((a) =>
                            a.aulas.includes(h.aula)
                          );

                          if (agsDestaAula.length === 0) {
                            return (
                              <tr key={h.aula} className="text-slate-400">
                                <td className="p-2 border-r border-slate-300 font-mono">
                                  <strong>{h.rotulo}</strong> ({h.faixaHorario})
                                </td>
                                <td colSpan={4} className="p-2 italic text-slate-400">
                                  Disponível (nenhum recurso agendado)
                                </td>
                              </tr>
                            );
                          }

                          return agsDestaAula.map((ag, idx) => (
                            <tr key={ag.id + idx}>
                              {idx === 0 && (
                                <td
                                  rowSpan={agsDestaAula.length}
                                  className="p-2 border-r border-slate-300 font-mono font-medium align-top bg-slate-50/50"
                                >
                                  <strong>{h.rotulo}</strong>
                                  <div className="text-[11px] text-slate-500">
                                    {h.faixaHorario}
                                  </div>
                                </td>
                              )}
                              <td className="p-2 border-r border-slate-300 font-semibold">
                                {ag.disciplina}{' '}
                                <span className="font-normal text-slate-600">({ag.turma})</span>
                              </td>
                              <td className="p-2 border-r border-slate-300 font-medium">
                                {ag.professor}
                              </td>
                              <td className="p-2 border-r border-slate-300">
                                {ag.recursos
                                  .map((rId) => {
                                    const r = getRecursoConfig(rId);
                                    return r.nome;
                                  })
                                  .join(', ')}
                              </td>
                              <td className="p-2 text-slate-600 text-[11px] italic">
                                {ag.observacao || '—'}
                              </td>
                            </tr>
                          ));
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          )}

          {/* Se for modo Semana Inteira */}
          {modoImpressao === 'semana' && (
            <div className="space-y-6">
              {diasSemana.map((dia) => {
                const agsDia = agendamentos.filter((a) => a.data === dia.data);
                return (
                  <div key={dia.data} className="space-y-1.5 print-page-break">
                    <div className="bg-slate-200 px-3 py-1 font-bold text-xs uppercase flex justify-between">
                      <span>
                        {dia.diaSemana} - {formatarDataBR(dia.data)}
                      </span>
                      <span>{agsDia.length} Agendamentos</span>
                    </div>

                    <table className="w-full text-left text-xs border border-slate-300 border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-300 font-semibold text-slate-700">
                          <th className="p-2 border-r border-slate-300 w-28">Turno / Aula</th>
                          <th className="p-2 border-r border-slate-300">Disciplina & Turma</th>
                          <th className="p-2 border-r border-slate-300">Professor(a)</th>
                          <th className="p-2 border-r border-slate-300">Recursos</th>
                          <th className="p-2">Obs</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {agsDia.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-3 text-center text-slate-400 italic">
                              Sem agendamentos registrados neste dia.
                            </td>
                          </tr>
                        ) : (
                          agsDia.map((ag) => (
                            <tr key={ag.id}>
                              <td className="p-2 border-r border-slate-300 font-mono capitalize">
                                <strong>{ag.turno}</strong>
                                <div>{ag.aulas.map((a) => `${a}ª`).join(', ')} aula</div>
                              </td>
                              <td className="p-2 border-r border-slate-300 font-semibold">
                                {ag.disciplina}{' '}
                                <span className="font-normal text-slate-600">({ag.turma})</span>
                              </td>
                              <td className="p-2 border-r border-slate-300 font-medium">
                                {ag.professor}
                              </td>
                              <td className="p-2 border-r border-slate-300">
                                {ag.recursos.map((r) => getRecursoConfig(r).nome).join(', ')}
                              </td>
                              <td className="p-2 text-slate-600 text-[11px] italic">
                                {ag.observacao || '—'}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          )}

          {/* Rodapé de Assinatura */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
            <div className="border-t border-slate-400 pt-1">
              Coordenação Pedagógica / Direção
            </div>
            <div className="border-t border-slate-400 pt-1">
              Responsável pelo Laboratório / Multimídia
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
