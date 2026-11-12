import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Plus,
  Clock,
  Calendar,
  Layers,
} from 'lucide-react';
import { Agendamento, RecursoId, Turno } from '../types';
import {
  RECURSOS_DISPONIVEIS,
  TURNOS_CONFIG,
  HORARIOS_AULAS,
  getRecursoConfig,
} from '../constants/schedule';
import { RecursoIcon } from './RecursoIcon';
import { formatarDataBR, formatarDataExtenso, formatarDataISO } from '../utils/dateUtils';

interface BookingsListViewProps {
  agendamentos: Agendamento[];
  onOpenBooking: () => void;
  onEditBooking: (agendamento: Agendamento) => void;
  onDeleteBooking: (agendamento: Agendamento) => void;
  onDeleteMultiplos?: (itens: Agendamento[]) => void;
}

export const BookingsListView: React.FC<BookingsListViewProps> = ({
  agendamentos,
  onOpenBooking,
  onEditBooking,
  onDeleteBooking,
  onDeleteMultiplos,
}) => {
  const [busca, setBusca] = useState('');
  const [filtroTurno, setFiltroTurno] = useState<Turno | 'todos'>('todos');
  const [filtroRecurso, setFiltroRecurso] = useState<RecursoId | 'todos'>('todos');
  const [filtroPeriodo, setFiltroPeriodo] = useState<'todos' | 'hoje' | 'futuros'>('todos');
  const [selecionadosIds, setSelecionadosIds] = useState<string[]>([]);

  const hojeStr = formatarDataISO(new Date());

  // Filtragem
  const agendamentosFiltrados = useMemo(() => {
    return agendamentos
      .filter((ag) => {
        // Busca textual
        if (busca.trim()) {
          const termo = busca.toLowerCase();
          const matchProf = ag.professor.toLowerCase().includes(termo);
          const matchDisc = ag.disciplina.toLowerCase().includes(termo);
          const matchTurma = ag.turma.toLowerCase().includes(termo);
          const matchObs = ag.observacao?.toLowerCase().includes(termo);
          if (!matchProf && !matchDisc && !matchTurma && !matchObs) return false;
        }

        // Filtro de Turno
        if (filtroTurno !== 'todos' && ag.turno !== filtroTurno) return false;

        // Filtro de Recurso
        if (filtroRecurso !== 'todos' && !ag.recursos.includes(filtroRecurso)) return false;

        // Filtro de Período
        if (filtroPeriodo === 'hoje' && ag.data !== hojeStr) return false;
        if (filtroPeriodo === 'futuros' && ag.data < hojeStr) return false;

        return true;
      })
      .sort((a, b) => {
        // Ordenar por data decrescente e depois por aula
        if (a.data !== b.data) return b.data.localeCompare(a.data);
        return a.aulas[0] - b.aulas[0];
      });
  }, [agendamentos, busca, filtroTurno, filtroRecurso, filtroPeriodo, hojeStr]);

  const toggleSelecionarTudo = () => {
    if (selecionadosIds.length === agendamentosFiltrados.length) {
      setSelecionadosIds([]);
    } else {
      setSelecionadosIds(agendamentosFiltrados.map((a) => a.id));
    }
  };

  const toggleSelecionarItem = (id: string) => {
    if (selecionadosIds.includes(id)) {
      setSelecionadosIds(selecionadosIds.filter((itemId) => itemId !== id));
    } else {
      setSelecionadosIds([...selecionadosIds, id]);
    }
  };

  const handleExcluirSelecionados = () => {
    const itensParaExcluir = agendamentos.filter((a) => selecionadosIds.includes(a.id));
    if (itensParaExcluir.length === 0) return;
    if (onDeleteMultiplos) {
      onDeleteMultiplos(itensParaExcluir);
      setSelecionadosIds([]);
    } else {
      // fallback caso não tenha handler de múltiplos
      itensParaExcluir.forEach((it) => onDeleteBooking(it));
      setSelecionadosIds([]);
    }
  };

  // Exportar para CSV
  const exportarCSV = () => {
    const cabecalho = [
      'Data',
      'Turno',
      'Aulas',
      'Disciplina',
      'Turma',
      'Professor',
      'Recursos',
      'Observação',
    ];
    const linhas = agendamentosFiltrados.map((ag) => [
      formatarDataBR(ag.data),
      ag.turno,
      ag.aulas.map((a) => `${a}ª`).join(', '),
      `"${ag.disciplina.replace(/"/g, '""')}"`,
      `"${ag.turma.replace(/"/g, '""')}"`,
      `"${ag.professor.replace(/"/g, '""')}"`,
      `"${ag.recursos.join('; ')}"`,
      `"${(ag.observacao || '').replace(/"/g, '""')}"`,
    ]);

    const conteudoCSV = [cabecalho.join(','), ...linhas.map((l) => l.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + conteudoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `agendamentos_multimidia_${hojeStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Campo de Busca Rápida */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por professor, disciplina ou turma..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
            />
            {busca && (
              <button
                type="button"
                onClick={() => setBusca('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2 shrink-0">
            {selecionadosIds.length > 0 && (
              <button
                type="button"
                onClick={handleExcluirSelecionados}
                className="px-3 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir ({selecionadosIds.length}) Selecionados</span>
              </button>
            )}
            <button
              type="button"
              onClick={exportarCSV}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              title="Baixar planilha CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
            <button
              type="button"
              onClick={onOpenBooking}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo</span>
            </button>
          </div>
        </div>

        {/* Dropdowns de Filtro */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Turno */}
          <select
            value={filtroTurno}
            onChange={(e) => setFiltroTurno(e.target.value as Turno | 'todos')}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="todos">Todos os Turnos</option>
            <option value="matutino">Matutino</option>
            <option value="vespertino">Vespertino</option>
            <option value="noturno">Noturno</option>
          </select>

          {/* Recurso */}
          <select
            value={filtroRecurso}
            onChange={(e) => setFiltroRecurso(e.target.value as RecursoId | 'todos')}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="todos">Todos os Recursos</option>
            {RECURSOS_DISPONIVEIS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome}
              </option>
            ))}
          </select>

          {/* Período */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setFiltroPeriodo('todos')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                filtroPeriodo === 'todos' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setFiltroPeriodo('hoje')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                filtroPeriodo === 'hoje' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Hoje
            </button>
            <button
              type="button"
              onClick={() => setFiltroPeriodo('futuros')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                filtroPeriodo === 'futuros' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Hoje e Futuros
            </button>
          </div>

          <span className="text-slate-500 ml-auto font-mono">
            {agendamentosFiltrados.length} agendamento(s)
          </span>
        </div>
      </div>

      {/* Tabela de Agendamentos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {agendamentosFiltrados.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Layers className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium text-slate-600">Nenhum agendamento encontrado</p>
            <p className="text-xs text-slate-400 mt-1">Tente ajustar os filtros ou crie um novo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={
                        agendamentosFiltrados.length > 0 &&
                        selecionadosIds.length === agendamentosFiltrados.length
                      }
                      onChange={toggleSelecionarTudo}
                      className="rounded border-slate-300 text-blue-600 cursor-pointer"
                      title="Selecionar todos"
                    />
                  </th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-3">Turno / Aulas</th>
                  <th className="py-3 px-3">Disciplina & Turma</th>
                  <th className="py-3 px-3">Professor(a)</th>
                  <th className="py-3 px-4">Recursos Reservados</th>
                  <th className="py-3 px-3">Observação</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agendamentosFiltrados.map((ag) => {
                  const cfgTurno = TURNOS_CONFIG[ag.turno];
                  const isChecked = selecionadosIds.includes(ag.id);

                  return (
                    <tr
                      key={ag.id}
                      className={`hover:bg-slate-50/80 transition-colors group ${
                        isChecked ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {/* Checkbox de seleção */}
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelecionarItem(ag.id)}
                          className="rounded border-slate-300 text-blue-600 cursor-pointer"
                        />
                      </td>

                      {/* Data */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold font-mono text-slate-900 text-sm">
                          {formatarDataBR(ag.data)}
                        </div>
                        <div className="text-[11px] text-slate-400 capitalize">
                          {formatarDataExtenso(ag.data).split(', ')[0]}
                        </div>
                      </td>

                      {/* Turno / Aulas */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${cfgTurno.badgeCor}`}
                        >
                          {cfgTurno.label}
                        </span>
                        <div className="text-[11px] font-mono text-slate-600 mt-1">
                          {ag.aulas.map((a) => `${a}ª`).join(', ')} aula
                        </div>
                      </td>

                      {/* Disciplina e Turma */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 text-sm">{ag.disciplina}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{ag.turma}</div>
                      </td>

                      {/* Professor */}
                      <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-800">
                        {ag.professor}
                      </td>

                      {/* Recursos */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {ag.recursos.map((recId) => {
                            const rec = getRecursoConfig(recId);
                            return (
                              <span
                                key={recId}
                                className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border ${rec.cor.bg} ${rec.cor.border}`}
                              >
                                <RecursoIcon id={recId} className="w-3 h-3" />
                                <span>{rec.nome}</span>
                                {recId === 'chromebook' && ag.quantidadeChromebooks && (
                                  <span className="font-mono text-[9px]">
                                    ({ag.quantidadeChromebooks})
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      {/* Observação */}
                      <td className="py-3 px-3 text-slate-500 max-w-xs truncate text-[11px] italic">
                        {ag.observacao || '—'}
                      </td>

                      {/* Ações (Editar / Excluir) */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEditBooking(ag)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar Agendamento"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteBooking(ag)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir Agendamento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
