import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Flower, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Plus, 
  Loader2, 
  Trash2,
  ChevronRight,
  Sparkles,
  Calendar,
  CloudRain
} from 'lucide-react';

/**
 * Componente Visual: Pétala de Sakura
 * Usado para criar a atmosfera estética do dashboard.
 */
const SakuraPetal = ({ className }) => (
  <svg className={`absolute opacity-20 pointer-events-none ${className}`} viewBox="0 0 100 100" fill="currentColor">
    <path d="M50 0C50 0 80 30 80 60C80 82 66 100 50 100C34 100 20 82 20 60C20 30 50 0 50 0Z" />
  </svg>
);

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

const App = () => {
  // Estados da Aplicação
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Função para procurar tarefas da API
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}?_limit=8`);
      if (!response.ok) throw new Error('Não foi possível conectar ao Jardim Zen.');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handlers de Interação
  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setIsAdding(false);
  };

  // Lógica de Filtro e Progresso (Memoized)
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'all' 
        ? true 
        : filter === 'completed' ? task.completed : !task.completed;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, filter]);

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
  }, [tasks]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md border border-pink-100">
          <CloudRain size={48} className="mx-auto text-pink-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chuva no Jardim</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={fetchTasks} className="px-8 py-3 bg-pink-400 text-white rounded-full hover:bg-pink-500 transition-all font-medium">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-gray-800 font-sans selection:bg-pink-200 overflow-x-hidden relative">
      {/* Elementos Decorativos */}
      <SakuraPetal className="w-12 h-12 text-pink-300 top-10 left-[10%] animate-pulse" />
      <SakuraPetal className="w-8 h-8 text-pink-200 top-40 right-[15%] rotate-45" />
      <SakuraPetal className="w-16 h-16 text-pink-100 bottom-20 left-[5%] -rotate-12" />

      <header className="pt-12 pb-8 px-6 max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-pink-500 font-bold tracking-widest text-sm mb-2">
              <Sparkles size={16} />
              <span>FASE DE FLORAÇÃO</span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight">
              Sakura <span className="text-pink-400">Zen</span>
            </h1>
          </div>
          
          {/* Barra de Progresso Circular/Horizontal */}
          <div className="bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-white/80 shadow-sm min-w-[200px]">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Progresso Diário</span>
              <span className="text-lg font-black text-pink-500">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-300 to-pink-500 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar de Navegação */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-pink-400" />
                Filtros Zen
              </h3>
              <nav className="space-y-2">
                {['all', 'pending', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all flex items-center justify-between ${
                      filter === f 
                        ? 'bg-pink-500 text-white shadow-md shadow-pink-100' 
                        : 'hover:bg-pink-50 text-gray-500'
                    }`}
                  >
                    <span className="capitalize">{f === 'all' ? 'Tudo' : f === 'pending' ? 'Em Crescimento' : 'Florescido'}</span>
                    <ChevronRight size={14} className={filter === f ? 'opacity-100' : 'opacity-0'} />
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-gradient-to-br from-pink-400 to-rose-400 rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden group">
              <Flower className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
              <h4 className="text-xl font-bold mb-2 relative z-10">Dica Zen</h4>
              <p className="text-pink-50 text-sm leading-relaxed relative z-10 italic">
                "Uma pétala de cada vez. Não apresses a tua própria estação de floração."
              </p>
            </div>
          </aside>

          {/* Área Principal de Conteúdo */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
                <input 
                  type="text"
                  placeholder="Procurar uma tarefa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-pink-300 outline-none transition-all placeholder:text-pink-200"
                />
              </div>
              <button 
                onClick={() => setIsAdding(true)}
                className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg active:scale-95"
              >
                <Plus size={20} />
                <span>Nova Tarefa</span>
              </button>
            </div>

            {/* Modal/Formulário de Adição */}
            {isAdding && (
              <form onSubmit={addTask} className="bg-white p-6 rounded-[2rem] shadow-md border-2 border-pink-200 animate-in fade-in slide-in-from-top-4 duration-300">
                <input 
                  autoFocus
                  type="text"
                  placeholder="Qual é o teu próximo objetivo?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full text-xl font-medium border-none focus:ring-0 mb-4 placeholder:text-gray-300"
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-400 font-bold">Cancelar</button>
                  <button type="submit" className="px-6 py-2 bg-pink-500 text-white rounded-xl font-bold shadow-pink-100 shadow-lg">Plantar Semente</button>
                </div>
              </form>
            )}

            {/* Lista de Tarefas */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-pink-300">
                  <Loader2 className="animate-spin mb-4" size={32} />
                  <p className="font-medium">A organizar as pétalas...</p>
                </div>
              ) : filteredTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`group flex items-center gap-4 bg-white p-5 rounded-[2rem] shadow-sm border border-transparent hover:border-pink-100 transition-all hover:shadow-md ${task.completed ? 'bg-white/50' : ''}`}
                >
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                      task.completed ? 'bg-emerald-500 text-white' : 'bg-pink-50 text-pink-400 hover:bg-pink-100'
                    }`}
                  >
                    {task.completed ? <CheckCircle2 size={20} /> : <div className="w-2 h-2 rounded-full bg-pink-300" />}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`font-bold transition-all ${task.completed ? 'text-gray-300 line-through' : 'text-gray-700'}`}>
                      {task.title}
                    </p>
                  </div>

                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 rounded-xl"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {!isLoading && filteredTasks.length === 0 && (
                <div className="text-center py-20 bg-white/40 rounded-[2rem] border-2 border-dashed border-pink-100">
                  <Flower className="mx-auto text-pink-200 mb-4" size={48} />
                  <p className="text-pink-300 font-medium italic">Jardim vazio. Adiciona sementes de produtividade!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
