import React from 'react';
import { Calendar, Layers, Clock, Laptop, Projector, CheckCircle2 } from 'lucide-react';
import { Agendamento, Turno } from '../types';
import { formatarDataExtenso, formatarDataISO } from '../utils/dateUtils';

interface StatsBannerProps {
  agendamentos: Agendamento[];
  currentDate: Date;
  turnoAtivo: Turno;
  onOpenNewBooking: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  agendamentos,
  currentDate,
  turnoAtivo,
  onOpenNewBooking,
}) => {
  const hojeStr = formatarDataISO(new Date());
  const agendamentosHoje = agendamentos.filter((a) => a.data === hojeStr);

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
      <div className="absolute left-1/2 bottom-0 -mb-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Painel de Reservas Escolares</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Agendamento Rápido de Multimídia e Espaços
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Reserva simplificada de datashow, caixa de som, chromebooks, TV, biblioteca, laboratório e pátio para professores nos turnos matutino, vespertino e noturno.
          </p>
        </div>

        {/* Mini stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-blue-200 font-medium">Hoje</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              {agendamentosHoje.length}
            </div>
            <div className="text-[10px] text-slate-300">reserva(s) ativas</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
            <div className="text-[11px] text-blue-200 font-medium">Total Cadastrado</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              {agendamentos.length}
            </div>
            <div className="text-[10px] text-slate-300">agendamentos</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 col-span-2 sm:col-span-1">
            <div className="text-[11px] text-blue-200 font-medium">Turnos Ativos</div>
            <div className="text-xs font-bold text-white mt-1 flex flex-wrap gap-1">
              <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200">Mat</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200">Vesp</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200">Not</span>
            </div>
            <div className="text-[10px] text-slate-300 mt-1">5 aulas cada</div>
          </div>
        </div>
      </div>
    </div>
  );
};
