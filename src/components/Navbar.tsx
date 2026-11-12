import React from 'react';
import { Plus, Printer } from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  viewMode: ViewMode;
  onSelectViewMode: (mode: ViewMode) => void;
  onOpenNewBooking: () => void;
  onOpenPrint: () => void;
  totalAgendamentos: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  onSelectViewMode,
  onOpenNewBooking,
  onOpenPrint,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8 h-16">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
            M
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            Agendamento Multimídia
          </span>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => onSelectViewMode('semanal')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              viewMode === 'semanal'
                ? 'text-blue-600 border-blue-600 font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Grade Semanal
          </button>
          <button
            type="button"
            onClick={() => onSelectViewMode('diaria')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              viewMode === 'diaria'
                ? 'text-blue-600 border-blue-600 font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Visão Diária
          </button>
          <button
            type="button"
            onClick={() => onSelectViewMode('mensal')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              viewMode === 'mensal'
                ? 'text-blue-600 border-blue-600 font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Calendário Mensal
          </button>
          <button
            type="button"
            onClick={() => onSelectViewMode('lista')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
              viewMode === 'lista'
                ? 'text-blue-600 border-blue-600 font-semibold'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Todos os Agendamentos
          </button>
        </nav>

        {/* Zone 3: 1 primary action button (plus print button) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenPrint}
            title="Imprimir Mapa de Agendamentos"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 no-print"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenNewBooking}
            className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Agendamento</span>
          </button>
        </div>
      </div>

      {/* Mobile nav tabs */}
      <div className="flex md:hidden items-center justify-around px-2 py-1.5 border-t border-slate-100 bg-slate-50 text-xs font-medium text-slate-600 overflow-x-auto">
        <button
          type="button"
          onClick={() => onSelectViewMode('semanal')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            viewMode === 'semanal' ? 'bg-white text-blue-700 shadow-xs font-semibold' : ''
          }`}
        >
          Semanal
        </button>
        <button
          type="button"
          onClick={() => onSelectViewMode('diaria')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            viewMode === 'diaria' ? 'bg-white text-blue-700 shadow-xs font-semibold' : ''
          }`}
        >
          Diária
        </button>
        <button
          type="button"
          onClick={() => onSelectViewMode('mensal')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            viewMode === 'mensal' ? 'bg-white text-blue-700 shadow-xs font-semibold' : ''
          }`}
        >
          Mensal
        </button>
        <button
          type="button"
          onClick={() => onSelectViewMode('lista')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            viewMode === 'lista' ? 'bg-white text-blue-700 shadow-xs font-semibold' : ''
          }`}
        >
          Lista
        </button>
      </div>
    </header>
  );
};
