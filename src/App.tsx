/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Agendamento, RecursoId, Turno, ViewMode } from './types';
import { gerarDadosIniciais } from './constants/schedule';
import { Navbar } from './components/Navbar';
import { WeeklyScheduleGrid } from './components/WeeklyScheduleGrid';
import { DailyScheduleView } from './components/DailyScheduleView';
import { MonthlyCalendarView } from './components/MonthlyCalendarView';
import { BookingsListView } from './components/BookingsListView';
import { BookingModal } from './components/BookingModal';
import { PrintScheduleModal } from './components/PrintScheduleModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { StatsBanner } from './components/StatsBanner';
import { CheckCircle2, RotateCcw, Trash2 } from 'lucide-react';
import { formatarDataISO } from './utils/dateUtils';

const STORAGE_KEY = 'agendamento_multimidia_dados_v1';

export default function App() {
  // Estado principal de agendamentos com carregamento inicial do localStorage
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler localStorage', e);
    }
    return gerarDadosIniciais();
  });

  // Salvar no localStorage sempre que agendamentos mudarem
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(agendamentos));
    } catch (e) {
      console.error('Erro ao salvar no localStorage', e);
    }
  }, [agendamentos]);

  // Controles de navegação e visualização
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('semanal');
  const [turnoAtivo, setTurnoAtivo] = useState<Turno>('matutino');
  const [recursoFiltro, setRecursoFiltro] = useState<RecursoId | 'todos'>('todos');

  // Modal de Agendamento / Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agendamentoEmEdicao, setAgendamentoEmEdicao] = useState<Agendamento | null>(null);
  const [dadosPreDefinidos, setDadosPreDefinidos] = useState<{
    data?: string;
    turno?: Turno;
    aula?: number;
    recurso?: RecursoId;
  }>({});

  // Modal de Exclusão Confiável (sem window.confirm)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [agendamentoParaExcluir, setAgendamentoParaExcluir] = useState<Agendamento | null>(null);
  const [itensMultiplosParaExcluir, setItensMultiplosParaExcluir] = useState<Agendamento[]>([]);
  const [itensParaDesfazer, setItensParaDesfazer] = useState<Agendamento[]>([]);

  // Modal de Impressão
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Toast de feedback com suporte a Desfazer
  const [toast, setToast] = useState<{ mensagem: string; podeDesfazer?: boolean } | null>(null);

  const showToast = (mensagem: string, podeDesfazer: boolean = false) => {
    setToast({ mensagem, podeDesfazer });
    setTimeout(() => {
      setToast((prev) => (prev?.mensagem === mensagem ? null : prev));
    }, 5500);
  };

  // Abrir modal para novo agendamento
  const handleOpenNewBooking = (predefined?: {
    data?: string;
    turno?: Turno;
    aula?: number;
    recurso?: RecursoId;
  }) => {
    setAgendamentoEmEdicao(null);
    setDadosPreDefinidos(predefined || {});
    setIsModalOpen(true);
  };

  // Abrir modal para editar agendamento existente
  const handleEditBooking = (agendamento: Agendamento) => {
    setAgendamentoEmEdicao(agendamento);
    setDadosPreDefinidos({});
    setIsModalOpen(true);
  };

  // Solicitar exclusão de um agendamento individual (abre modal in-app)
  const handleSolicitarExclusao = (ag: Agendamento) => {
    setAgendamentoParaExcluir(ag);
    setItensMultiplosParaExcluir([]);
    setIsDeleteModalOpen(true);
  };

  // Solicitar exclusão de múltiplos agendamentos (em lote)
  const handleSolicitarExclusaoMultiplos = (itens: Agendamento[]) => {
    if (itens.length === 0) return;
    setItensMultiplosParaExcluir(itens);
    setAgendamentoParaExcluir(null);
    setIsDeleteModalOpen(true);
  };

  // Executar exclusão confirmada
  const handleConfirmarExclusao = () => {
    if (itensMultiplosParaExcluir.length > 0) {
      const idsParaRemover = new Set(itensMultiplosParaExcluir.map((it) => it.id));
      setItensParaDesfazer(itensMultiplosParaExcluir);
      setAgendamentos((prev) => prev.filter((item) => !idsParaRemover.has(item.id)));
      showToast(`${itensMultiplosParaExcluir.length} agendamentos excluídos.`, true);
      setItensMultiplosParaExcluir([]);
    } else if (agendamentoParaExcluir) {
      const idParaRemover = agendamentoParaExcluir.id;
      setItensParaDesfazer([agendamentoParaExcluir]);
      setAgendamentos((prev) => prev.filter((item) => item.id !== idParaRemover));
      showToast(
        `Agendamento de ${agendamentoParaExcluir.disciplina} (${agendamentoParaExcluir.professor}) excluído.`,
        true
      );
      setAgendamentoParaExcluir(null);
    }
  };

  // Exclusão direta chamada de dentro do BookingModal
  const handleDeleteFromBookingModal = (id: string) => {
    const itemEncontrado = agendamentos.find((a) => a.id === id);
    if (itemEncontrado) {
      setItensParaDesfazer([itemEncontrado]);
    }
    setAgendamentos((prev) => prev.filter((item) => item.id !== id));
    showToast('Agendamento excluído com sucesso.', true);
  };

  // Desfazer última exclusão
  const handleDesfazerExclusao = () => {
    if (itensParaDesfazer.length > 0) {
      setAgendamentos((prev) => [...prev, ...itensParaDesfazer]);
      showToast(`${itensParaDesfazer.length} agendamento(s) restaurado(s)!`, false);
      setItensParaDesfazer([]);
    }
  };

  // Salvar agendamento (Criação, Edição ou Multi-datas)
  const handleSaveBooking = (
    agendamentoData: Omit<Agendamento, 'id' | 'criadoEm'>,
    multiDatas?: string[]
  ) => {
    if (agendamentoEmEdicao) {
      // Atualizar existente
      setAgendamentos((prev) =>
        prev.map((item) =>
          item.id === agendamentoEmEdicao.id
            ? {
                ...item,
                ...agendamentoData,
                atualizadoEm: new Date().toISOString(),
              }
            : item
        )
      );
      showToast(
        `Agendamento de ${agendamentoData.disciplina} (${agendamentoData.professor}) atualizado!`
      );
    } else {
      // Criar novo(s)
      const dataPrincipal = agendamentoData.data;
      const datasParaCriar = [dataPrincipal, ...(multiDatas || [])];

      const novos: Agendamento[] = datasParaCriar.map((dt, idx) => ({
        ...agendamentoData,
        id: `ag-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
        data: dt,
        criadoEm: new Date().toISOString(),
      }));

      setAgendamentos((prev) => [...prev, ...novos]);

      if (novos.length > 1) {
        showToast(`${novos.length} agendamentos registrados com sucesso!`);
      } else {
        showToast(
          `Agendamento de ${agendamentoData.disciplina} (${agendamentoData.professor}) confirmado!`
        );
      }
    }
  };

  // Restaurar dados de exemplo
  const handleRestaurarExemplo = () => {
    const iniciais = gerarDadosIniciais();
    setAgendamentos(iniciais);
    showToast('Dados de demonstração escolares restaurados.');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Barra de Navegação Superior */}
      <Navbar
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
        onOpenNewBooking={() => handleOpenNewBooking()}
        onOpenPrint={() => setIsPrintModalOpen(true)}
        totalAgendamentos={agendamentos.length}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Banner Informativo e Estatísticas */}
        <StatsBanner
          agendamentos={agendamentos}
          currentDate={currentDate}
          turnoAtivo={turnoAtivo}
          onOpenNewBooking={() => handleOpenNewBooking()}
        />

        {/* Visualização Ativa */}
        {viewMode === 'semanal' && (
          <WeeklyScheduleGrid
            currentDate={currentDate}
            onChangeDate={setCurrentDate}
            turnoAtivo={turnoAtivo}
            onChangeTurno={setTurnoAtivo}
            agendamentos={agendamentos}
            recursoFiltro={recursoFiltro}
            onChangeRecursoFiltro={setRecursoFiltro}
            onOpenBooking={handleOpenNewBooking}
            onEditBooking={handleEditBooking}
            onDeleteBooking={handleSolicitarExclusao}
          />
        )}

        {viewMode === 'diaria' && (
          <DailyScheduleView
            currentDate={currentDate}
            onChangeDate={setCurrentDate}
            agendamentos={agendamentos}
            onOpenBooking={handleOpenNewBooking}
            onEditBooking={handleEditBooking}
            onDeleteBooking={handleSolicitarExclusao}
          />
        )}

        {viewMode === 'mensal' && (
          <MonthlyCalendarView
            currentDate={currentDate}
            onChangeDate={setCurrentDate}
            agendamentos={agendamentos}
            onOpenBooking={handleOpenNewBooking}
            onEditBooking={handleEditBooking}
            onDeleteBooking={handleSolicitarExclusao}
          />
        )}

        {viewMode === 'lista' && (
          <BookingsListView
            agendamentos={agendamentos}
            onOpenBooking={() => handleOpenNewBooking()}
            onEditBooking={handleEditBooking}
            onDeleteBooking={handleSolicitarExclusao}
            onDeleteMultiplos={handleSolicitarExclusaoMultiplos}
          />
        )}

        {/* Rodapé Útil e Rápido */}
        <footer className="pt-8 pb-4 text-xs text-slate-500 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
          <div>
            <strong>Sistema de Agendamento Multimídia Escolar</strong> · Turnos Matutino (07:15 - 11:40), Vespertino (13:00 - 17:25) e Noturno (19:00 - 22:55)
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleRestaurarExemplo}
              className="text-slate-500 hover:text-slate-800 underline transition-colors"
            >
              Restaurar Dados de Exemplo
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="text-blue-600 hover:underline font-medium"
            >
              Imprimir Relatório
            </button>
          </div>
        </footer>
      </main>

      {/* Modal de Agendamento / Edição */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBooking}
        onDelete={handleDeleteFromBookingModal}
        agendamentoParaEditar={agendamentoEmEdicao}
        todosAgendamentos={agendamentos}
        dataInicial={dadosPreDefinidos.data || formatarDataISO(currentDate)}
        turnoInicial={dadosPreDefinidos.turno || turnoAtivo}
        aulaInicial={dadosPreDefinidos.aula}
        recursoInicial={dadosPreDefinidos.recurso}
      />

      {/* Modal de Confirmação de Exclusão (sem window.confirm) */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAgendamentoParaExcluir(null);
          setItensMultiplosParaExcluir([]);
        }}
        onConfirm={handleConfirmarExclusao}
        agendamento={agendamentoParaExcluir}
        itensMultiplos={itensMultiplosParaExcluir}
      />

      {/* Modal de Impressão */}
      <PrintScheduleModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        agendamentos={agendamentos}
        currentDate={currentDate}
      />

      {/* Toast Notification com Desfazer */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.mensagem}</span>
          {toast.podeDesfazer && (
            <button
              type="button"
              onClick={handleDesfazerExclusao}
              className="ml-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white rounded-md border border-slate-600 transition-colors flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Desfazer</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
