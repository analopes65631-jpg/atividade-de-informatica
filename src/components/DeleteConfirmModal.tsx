import React from 'react';
import { Trash2, AlertTriangle, X, Clock, Calendar } from 'lucide-react';
import { Agendamento } from '../types';
import { TURNOS_CONFIG, getRecursoConfig } from '../constants/schedule';
import { formatarDataBR, formatarDataExtenso } from '../utils/dateUtils';
import { RecursoIcon } from './RecursoIcon';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  agendamento: Agendamento | null;
  itensMultiplos?: Agendamento[];
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  agendamento,
  itensMultiplos,
}) => {
  if (!isOpen) return null;

  const isMultiplo = itensMultiplos && itensMultiplos.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isMultiplo ? 'Excluir Agendamentos' : 'Excluir Agendamento'}
              </h3>
              <p className="text-xs text-slate-500">
                {isMultiplo
                  ? `Confirmação de exclusão em massa (${itensMultiplos.length} itens)`
                  : 'Esta ação removerá a reserva do sistema escolar'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detalhes do item a ser excluído */}
        <div className="p-5 space-y-4">
          {isMultiplo ? (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1 max-h-48 overflow-y-auto">
              <p className="font-semibold text-slate-900 mb-2">
                Os seguintes {itensMultiplos.length} agendamentos serão removidos:
              </p>
              {itensMultiplos.map((item) => (
                <div key={item.id} className="py-1 border-b border-slate-200 last:border-b-0 flex justify-between">
                  <span>
                    <strong>{item.disciplina}</strong> ({item.professor})
                  </span>
                  <span className="font-mono text-slate-500">
                    {formatarDataBR(item.data)} · {item.turno}
                  </span>
                </div>
              ))}
            </div>
          ) : agendamento ? (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {agendamento.disciplina}
                  </div>
                  <div className="text-slate-600 font-medium">
                    {agendamento.professor} · {agendamento.turma}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    TURNOS_CONFIG[agendamento.turno].badgeCor
                  }`}
                >
                  {agendamento.turno}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 pt-1 border-t border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{formatarDataExtenso(agendamento.data)}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  {agendamento.aulas.map((a) => `${a}ª`).join(', ')} aula
                </span>
              </div>

              {/* Recursos */}
              <div className="flex flex-wrap gap-1 pt-1">
                {agendamento.recursos.map((recId) => {
                  const r = getRecursoConfig(recId);
                  return (
                    <span
                      key={recId}
                      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border ${r.cor.bg} ${r.cor.border}`}
                    >
                      <RecursoIcon id={recId} className="w-3 h-3" />
                      <span>{r.nome}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-900 text-xs">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span>
                O horário e o(s) equipamento(s) ficarão imediatamente liberados para outros professores agendarem.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200/80 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sim, Confirmar Exclusão</span>
          </button>
        </div>
      </div>
    </div>
  );
};
