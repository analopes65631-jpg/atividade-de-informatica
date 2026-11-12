import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  BookOpen,
  GraduationCap,
  FileText,
  AlertTriangle,
  Check,
  Plus,
  Repeat,
  Trash2,
  Laptop,
} from 'lucide-react';
import { Agendamento, RecursoId, Turno } from '../types';
import {
  HORARIOS_AULAS,
  RECURSOS_DISPONIVEIS,
  TURNOS_CONFIG,
  DISCIPLINAS_SUGESTOES,
  TURMAS_SUGESTOES,
  PROFESSORES_SUGESTOES,
} from '../constants/schedule';
import { RecursoIcon } from './RecursoIcon';
import { formatarDataBR, formatarDataExtenso, formatarDataISO } from '../utils/dateUtils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agendamentoData: Omit<Agendamento, 'id' | 'criadoEm'>, multiDatas?: string[]) => void;
  onDelete?: (id: string) => void;
  agendamentoParaEditar?: Agendamento | null;
  todosAgendamentos: Agendamento[];
  dataInicial?: string;
  turnoInicial?: Turno;
  aulaInicial?: number;
  recursoInicial?: RecursoId;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  agendamentoParaEditar,
  todosAgendamentos,
  dataInicial,
  turnoInicial = 'matutino',
  aulaInicial,
  recursoInicial,
}) => {
  const hojeStr = formatarDataISO(new Date());

  // Form states
  const [data, setData] = useState<string>(dataInicial || hojeStr);
  const [turno, setTurno] = useState<Turno>(turnoInicial);
  const [aulas, setAulas] = useState<number[]>([1]);
  const [recursos, setRecursos] = useState<RecursoId[]>(['datashow']);
  const [professor, setProfessor] = useState<string>('');
  const [disciplina, setDisciplina] = useState<string>('');
  const [turma, setTurma] = useState<string>('');
  const [observacao, setObservacao] = useState<string>('');
  const [quantidadeChromebooks, setQuantidadeChromebooks] = useState<number>(25);

  // Multi-date booking feature
  const [modoMultiDatas, setModoMultiDatas] = useState<boolean>(false);
  const [datasAdicionais, setDatasAdicionais] = useState<string[]>([]);
  const [novaDataAdicional, setNovaDataAdicional] = useState<string>('');

  // Validation errors
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [confirmandoExclusaoModal, setConfirmandoExclusaoModal] = useState<boolean>(false);

  // Reset or populate form whenever modal opens or item changes
  useEffect(() => {
    setConfirmandoExclusaoModal(false);
    if (agendamentoParaEditar) {
      setData(agendamentoParaEditar.data);
      setTurno(agendamentoParaEditar.turno);
      setAulas(agendamentoParaEditar.aulas || [1]);
      setRecursos(agendamentoParaEditar.recursos || ['datashow']);
      setProfessor(agendamentoParaEditar.professor || '');
      setDisciplina(agendamentoParaEditar.disciplina || '');
      setTurma(agendamentoParaEditar.turma || '');
      setObservacao(agendamentoParaEditar.observacao || '');
      setQuantidadeChromebooks(agendamentoParaEditar.quantidadeChromebooks || 25);
      setModoMultiDatas(false);
      setDatasAdicionais([]);
    } else {
      setData(dataInicial || hojeStr);
      setTurno(turnoInicial || 'matutino');
      setAulas(aulaInicial ? [aulaInicial] : [1]);
      setRecursos(recursoInicial ? [recursoInicial] : ['datashow']);
      setProfessor('');
      setDisciplina('');
      setTurma('');
      setObservacao('');
      setQuantidadeChromebooks(25);
      setModoMultiDatas(false);
      setDatasAdicionais([]);
    }
    setErros({});
  }, [isOpen, agendamentoParaEditar, dataInicial, turnoInicial, aulaInicial, recursoInicial]);

  // Handle toggling classes / aulas
  const toggleAula = (numeroAula: number) => {
    if (aulas.includes(numeroAula)) {
      if (aulas.length > 1) {
        setAulas(aulas.filter((a) => a !== numeroAula));
      }
    } else {
      setAulas([...aulas, numeroAula].sort((a, b) => a - b));
    }
  };

  // Select all or quick range
  const selecionarAulas = (listaAulas: number[]) => {
    setAulas(listaAulas);
  };

  // Handle toggling resources (allows multi-resource: datashow + sound, etc.)
  const toggleRecurso = (id: RecursoId) => {
    if (recursos.includes(id)) {
      if (recursos.length > 1) {
        setRecursos(recursos.filter((r) => r !== id));
      }
    } else {
      setRecursos([...recursos, id]);
    }
  };

  // Add date to multi-date list
  const adicionarDataExtra = () => {
    if (!novaDataAdicional) return;
    if (novaDataAdicional === data || datasAdicionais.includes(novaDataAdicional)) {
      return;
    }
    setDatasAdicionais([...datasAdicionais, novaDataAdicional].sort());
    setNovaDataAdicional('');
  };

  const removerDataExtra = (dRemover: string) => {
    setDatasAdicionais(datasAdicionais.filter((d) => d !== dRemover));
  };

  // Quick repeat generator: repeat for next 2 or 3 weeks on same weekday
  const adicionarProximasSemanas = (qtdSemanas: number) => {
    const dataBase = new Date(data + 'T12:00:00');
    const novas: string[] = [];
    for (let i = 1; i <= qtdSemanas; i++) {
      const d = new Date(dataBase);
      d.setDate(d.getDate() + i * 7);
      const iso = formatarDataISO(d);
      if (!datasAdicionais.includes(iso) && iso !== data) {
        novas.push(iso);
      }
    }
    setDatasAdicionais([...datasAdicionais, ...novas].sort());
  };

  // Check conflicts in real time
  const conflitosDetectados = useMemo(() => {
    const listaConflitos: {
      recursoNome: string;
      aula: number;
      faixaHorario: string;
      agendadoPor: string;
      turma: string;
      dataConflito: string;
    }[] = [];

    const todasAsDatas = [data, ...datasAdicionais];
    const horarios = HORARIOS_AULAS[turno] || [];

    for (const dataCheck of todasAsDatas) {
      for (const ag of todosAgendamentos) {
        // Ignora o próprio agendamento caso esteja em edição
        if (agendamentoParaEditar && ag.id === agendamentoParaEditar.id) {
          continue;
        }

        if (ag.data === dataCheck && ag.turno === turno) {
          // Checar sobreposição de aula e recurso
          const aulasEmComum = aulas.filter((a) => ag.aulas.includes(a));
          const recursosEmComum = recursos.filter((r) => ag.recursos.includes(r));

          if (aulasEmComum.length > 0 && recursosEmComum.length > 0) {
            for (const aulaNum of aulasEmComum) {
              const horarioInfo = horarios.find((h) => h.aula === aulaNum);
              for (const recId of recursosEmComum) {
                const recCfg = RECURSOS_DISPONIVEIS.find((r) => r.id === recId);
                listaConflitos.push({
                  recursoNome: recCfg?.nome || recId,
                  aula: aulaNum,
                  faixaHorario: horarioInfo ? horarioInfo.faixaHorario : `${aulaNum}ª Aula`,
                  agendadoPor: ag.professor,
                  turma: ag.turma,
                  dataConflito: dataCheck,
                });
              }
            }
          }
        }
      }
    }

    return listaConflitos;
  }, [data, datasAdicionais, turno, aulas, recursos, todosAgendamentos, agendamentoParaEditar]);

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novosErros: { [key: string]: string } = {};

    if (!professor.trim()) {
      novosErros.professor = 'Informe o nome do professor(a)';
    }
    if (!disciplina.trim()) {
      novosErros.disciplina = 'Informe a disciplina';
    }
    if (!turma.trim()) {
      novosErros.turma = 'Informe a turma';
    }
    if (aulas.length === 0) {
      novosErros.aulas = 'Selecione pelo menos um horário de aula';
    }
    if (recursos.length === 0) {
      novosErros.recursos = 'Selecione pelo menos um recurso';
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    const payload = {
      data,
      turno,
      aulas,
      turma: turma.trim(),
      disciplina: disciplina.trim(),
      professor: professor.trim(),
      recursos,
      observacao: observacao.trim() || undefined,
      quantidadeChromebooks: recursos.includes('chromebook') ? quantidadeChromebooks : undefined,
    };

    onSave(payload, modoMultiDatas && datasAdicionais.length > 0 ? datasAdicionais : undefined);
    onClose();
  };

  if (!isOpen) return null;

  const horariosDoTurno = HORARIOS_AULAS[turno] || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {agendamentoParaEditar ? 'Editar Agendamento' : 'Novo Agendamento Multimídia'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Preenchimento rápido para reserva de equipamentos e espaços escolares
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {/* Data e Turno */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            {/* Data */}
            <div className="sm:col-span-6 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Data do Agendamento *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                  required
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setData(hojeStr)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Hoje
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => {
                    const amanh = new Date();
                    amanh.setDate(amanh.getDate() + 1);
                    setData(formatarDataISO(amanh));
                  }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Amanhã
                </button>
                <span>·</span>
                <span className="truncate">{formatarDataExtenso(data)}</span>
              </div>
            </div>

            {/* Turno */}
            <div className="sm:col-span-6 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Turno da Aula *
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
                {(['matutino', 'vespertino', 'noturno'] as Turno[]).map((t) => {
                  const cfg = TURNOS_CONFIG[t];
                  const isSelected = turno === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTurno(t)}
                      className={`py-1.5 px-2 text-xs font-medium rounded-md transition-all text-center ${
                        isSelected
                          ? 'bg-white text-slate-900 shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500">{TURNOS_CONFIG[turno].descricao}</p>
            </div>
          </div>

          {/* Horários / Aulas (1ª a 5ª aula com horários exatos) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Horário da Aula (Selecione uma ou mais) *
              </label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => selecionarAulas([1, 2, 3, 4, 5])}
                  className="text-blue-600 hover:underline"
                >
                  Todas as 5 aulas
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => selecionarAulas([1, 2])}
                  className="text-blue-600 hover:underline"
                >
                  1ª e 2ª
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => selecionarAulas([4, 5])}
                  className="text-blue-600 hover:underline"
                >
                  4ª e 5ª
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {horariosDoTurno.map((item) => {
                const isSelected = aulas.includes(item.aula);
                return (
                  <button
                    key={item.aula}
                    type="button"
                    onClick={() => toggleAula(item.aula)}
                    className={`p-2.5 rounded-lg border text-left transition-all relative ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{item.rotulo}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 font-medium">
                      {item.faixaHorario}
                    </div>
                  </button>
                );
              })}
            </div>
            {erros.aulas && <p className="text-xs text-red-600">{erros.aulas}</p>}
          </div>

          {/* Recursos para Reservar (Datashow, Caixa de som, Chromebook, TV, Biblioteca, Laboratório, Pátio) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Recursos e Espaços a Reservar * (Permite mais de um)
              </label>
              <span className="text-xs text-slate-500">
                {recursos.length} selecionado(s)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {RECURSOS_DISPONIVEIS.map((rec) => {
                const isChecked = recursos.includes(rec.id);
                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => toggleRecurso(rec.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
                      isChecked
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-md shrink-0 mt-0.5 ${
                        isChecked ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <RecursoIcon id={rec.id} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs leading-tight">{rec.nome}</div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {rec.categoria === 'espaco' ? 'Espaço Escolar' : 'Equipamento'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Configuração adicional se Chromebook estiver selecionado */}
            {recursos.includes('chromebook') && (
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg flex items-center justify-between text-xs text-sky-900">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-sky-700" />
                  <span>Quantidade de Chromebooks necessária:</span>
                </div>
                <div className="flex items-center gap-2">
                  {[15, 20, 25, 30].map((qtd) => (
                    <button
                      key={qtd}
                      type="button"
                      onClick={() => setQuantidadeChromebooks(qtd)}
                      className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                        quantidadeChromebooks === qtd
                          ? 'bg-sky-600 text-white'
                          : 'bg-white text-sky-800 border border-sky-300 hover:bg-sky-100'
                      }`}
                    >
                      {qtd}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={quantidadeChromebooks}
                    onChange={(e) => setQuantidadeChromebooks(Number(e.target.value))}
                    className="w-14 px-2 py-1 text-xs bg-white border border-sky-300 rounded text-center font-mono font-bold"
                  />
                </div>
              </div>
            )}
            {erros.recursos && <p className="text-xs text-red-600">{erros.recursos}</p>}
          </div>

          {/* Professor, Disciplina e Turma */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Nome do Professor */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Professor(a) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={professor}
                  onChange={(e) => setProfessor(e.target.value)}
                  placeholder="Nome do professor(a)"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                  required
                />
              </div>
              {erros.professor && <p className="text-xs text-red-600">{erros.professor}</p>}
            </div>

            {/* Disciplina */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Disciplina *
              </label>
              <input
                type="text"
                value={disciplina}
                onChange={(e) => setDisciplina(e.target.value)}
                placeholder="Disciplina"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                required
              />
              {erros.disciplina && <p className="text-xs text-red-600">{erros.disciplina}</p>}
            </div>

            {/* Turma */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Turma *
              </label>
              <input
                type="text"
                value={turma}
                onChange={(e) => setTurma(e.target.value)}
                placeholder="Turma"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                required
              />
              {erros.turma && <p className="text-xs text-red-600">{erros.turma}</p>}
            </div>
          </div>


          {/* Agendar em mais de uma data (recorrência / multi-datas) */}
          {!agendamentoParaEditar && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-semibold text-slate-800">
                    Agendar em mais de uma data? (Repetir agendamento)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setModoMultiDatas(!modoMultiDatas)}
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                    modoMultiDatas
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {modoMultiDatas ? 'Ativado' : 'Adicionar mais datas'}
                </button>
              </div>

              {modoMultiDatas && (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <p className="text-xs text-slate-600">
                    Gere reservas automáticas com os mesmos horários e recursos para as semanas seguintes:
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => adicionarProximasSemanas(1)}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md hover:bg-slate-100 text-slate-700"
                    >
                      + 1 semana seguinte
                    </button>
                    <button
                      type="button"
                      onClick={() => adicionarProximasSemanas(2)}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md hover:bg-slate-100 text-slate-700"
                    >
                      + 2 semanas seguintes
                    </button>
                    <button
                      type="button"
                      onClick={() => adicionarProximasSemanas(4)}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md hover:bg-slate-100 text-slate-700"
                    >
                      + 4 semanas (1 mês)
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="date"
                      value={novaDataAdicional}
                      onChange={(e) => setNovaDataAdicional(e.target.value)}
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-md bg-white text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={adicionarDataExtra}
                      className="px-3 py-1 text-xs bg-slate-800 text-white rounded-md hover:bg-slate-900 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Incluir data
                    </button>
                  </div>

                  {datasAdicionais.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {datasAdicionais.map((d) => (
                        <span
                          key={d}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-md"
                        >
                          {formatarDataBR(d)}
                          <button
                            type="button"
                            onClick={() => removerDataExtra(d)}
                            className="hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Alerta de Conflitos em Tempo Real */}
          {conflitosDetectados.length > 0 && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Atenção: Conflito de Agendamento Detectado!</span>
              </div>
              <ul className="text-xs space-y-1 list-disc list-inside text-amber-900">
                {conflitosDetectados.map((c, i) => (
                  <li key={i}>
                    <strong>{c.recursoNome}</strong> já está reservado por{' '}
                    <strong>{c.agendadoPor}</strong> ({c.turma}) na{' '}
                    <strong>
                      {c.aula}ª Aula ({c.faixaHorario})
                    </strong>{' '}
                    em {formatarDataBR(c.dataConflito)}.
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-amber-800 italic">
                Você pode ajustar a aula, data ou recurso para evitar conflitos na sala dos professores.
              </p>
            </div>
          )}

          {/* Actions Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <div>
              {agendamentoParaEditar && onDelete && (
                <div>
                  {!confirmandoExclusaoModal ? (
                    <button
                      type="button"
                      onClick={() => setConfirmandoExclusaoModal(true)}
                      className="px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir Agendamento
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                      <span className="text-xs font-semibold text-red-700">Confirmar exclusão?</span>
                      <button
                        type="button"
                        onClick={() => {
                          onDelete(agendamentoParaEditar.id);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded shadow-xs"
                      >
                        Sim, Excluir
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmandoExclusaoModal(false)}
                        className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-200/60 rounded"
                      >
                        Não
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                {agendamentoParaEditar
                  ? 'Salvar Alterações'
                  : modoMultiDatas && datasAdicionais.length > 0
                  ? `Confirmar ${datasAdicionais.length + 1} Agendamentos`
                  : 'Confirmar Agendamento'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
