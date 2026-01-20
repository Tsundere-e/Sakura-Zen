import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { 
  Flower, 
  CheckCircle2, 
  Search, 
  Plus, 
  Loader2, 
  Trash2,
  ChevronRight,
  Sparkles,
  Heart,
  Wind,
  Zap
} from 'lucide-react';

// --- Styles & Animation ---

const CSS_ANIMATIONS = `
  @keyframes float-slow {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(20px, -30px) rotate(10deg); }
  }
  @keyframes petal-fall {
    0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(110vh) translateX(100px) rotate(360deg); opacity: 0; }
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-float { animation: float-slow 10s ease-in-out infinite; }
  .animate-petal { animation: petal-fall 15s linear infinite; }
  .animate-marquee { animation: marquee 20s linear infinite; }
  
  .pink-pattern-bg {
    background-color: #fdf2f8;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f9a8d4' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  .text-glow {
    text-shadow: 0 0 15px rgba(244, 114, 182, 0.4);
  }
`;

const STYLES = {
  container: "min-h-screen pink-pattern-bg text-pink-900 font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden",
  glassCard: "bg-white/70 backdrop-blur-xl rounded-[3rem] border-2 border-white shadow-[0_25px_60px_-15px_rgba(244,114,182,0.3)] transition-all duration-500",
  input: "w-full pl-14 pr-6 py-6 bg-white/90 rounded-[2rem] border-2 border-pink-100 outline-none transition-all placeholder:text-pink-200 focus:border-pink-500 focus:shadow-[0_0_30px_rgba(244,114,182,0.2)] text-pink-950 font-bold",
  buttonPrimary: "group relative px-10 py-6 bg-pink-500 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-pink-300",
  badge: "px-4 py-1.5 rounded-full bg-pink-600 text-[10px] font-black text-white uppercase tracking-widest"
};

// --- Decorative Elements ---

const FloatingPetals = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    {[...Array(8)].map((_, i) => (
      <Flower 
        key={i} 
        className="absolute animate-petal text-pink-300 opacity-20"
        size={Math.random() * 20 + 10}
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 15}s`,
          animationDuration: `${Math.random() * 10 + 10}s`
        }}
      />
    ))}
  </div>
);

// --- Decorative flower ---

const SakuraGulp = () => {
  const [showAsset, setShowAsset] = useState(false);
  const [ripples, setRipples] = useState([]);
  const audioRef = useRef(null); 
  const hasPlayedRef = useRef(false);

  const triggerEffect = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(
        'https://assets.mixkit.co/active_storage/sfx/1120/1120-preview.mp3'
      );
      audioRef.current.volume = 0.4;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});

    setShowAsset(true);
    const id = Date.now();
    setRipples(r => [...r, id]);

    setTimeout(() => {
      setRipples(r => r.filter(x => x !== id));
    }, 2000);

    setTimeout(() => {
      setShowAsset(false);
    }, 4000);
  }, []);

  useEffect(() => {
  if (hasPlayedRef.current) return;
  hasPlayedRef.current = true;
  triggerEffect();
  }, [triggerEffect]);

  return (
    <div className="relative w-[220px] h-[220px] pointer-events-none">
      <style>{`
        @keyframes gulp-spin-y {
          0% { transform: scale(0) rotateY(0deg); opacity: 0; }
          20% { transform: scale(1) rotateY(0deg); opacity: 1; }
          80% { transform: scale(1) rotateY(360deg); opacity: 1; }
          100% { transform: scale(0) rotateY(360deg); opacity: 0; }
        }

        .perspective { perspective: 800px; }

        .animate-flower {
          animation: gulp-spin-y 4s ease-in-out forwards;
          transform-style: preserve-3d;
        }

        @keyframes water-ripple {
          0% { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(2.8); opacity: 0; }
        }

        .ripple {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid rgba(244,114,182,0.5);
          animation: water-ripple 2s ease-out forwards;
        }
      `}</style>

      {ripples.map(id => (
        <div key={id} className="ripple" />
      ))}

      {showAsset && (
        <div className="perspective flex items-center justify-center">
          <div className="animate-flower">
            <img
              src="https://i.ibb.co/ynbjc8Wm/5413e8853f7d2bfd789c67e71395f3b6-removebg-preview.png"
              alt=""
              className="w-56 h-56 object-contain drop-shadow-[0_30px_60px_rgba(244,114,182,0.5)]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-Components ---

const MagazineHeader = memo(({ progress }) => (
  <header className="relative w-full bg-white border-b-[12px] border-pink-500 overflow-hidden">
    {/* Marquee Background Text */}
    <div className="absolute top-0 left-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none py-4">
      <div className="animate-marquee whitespace-nowrap text-[120px] font-black uppercase tracking-tighter">
        SAKURA ZEN • SAKURA ZEN • SAKURA ZEN • SAKURA ZEN • SAKURA ZEN • SAKURA ZEN • SAKURA ZEN • SAKURA ZEN • 
      </div>
    </div>

    <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row min-h-[650px] relative z-10">
      <div className="flex-1 px-8 md:px-20 py-20 md:py-32 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-6">
          <Zap className="text-pink-500 fill-pink-500" size={16} />
          <span className="text-pink-500 font-black tracking-[0.5em] text-[13px] uppercase">
            Tsundere-Creation • 2026 Edition
          </span>
        </div>
        
        <div className="relative">
        <h1 className="text-8xl md:text-[11rem] font-serif italic text-pink-950 leading-[0.75] mb-12 tracking-tighter text-glow">
        Sakur
        <span className="relative inline-block">
          a
          <span className="absolute -top-32 left-1/2 -translate-x-1/2 pointer-events-none">
            <SakuraGulp />
          </span>
        </span>
        <br />
          <span className="not-italic font-black text-pink-500 inline-block hover:scale-110 transition-transform cursor-default">Zen.</span>
        </h1>

        {/* ✨ ANIMATION GOES HERE ✨ */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 pointer-events-none">
        <SakuraGulp />
        </div>
        </div>
        <div className="max-w-md relative">
          <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-pink-500 rounded-full" />
          <p className="text-pink-900 font-black leading-tight mb-12 text-2xl uppercase italic tracking-tight">
            Good mood, mental looseness <br/> for creative problem-solving .
          </p>
          
          <div className="flex items-center gap-8">
             <div className="relative">
                <svg className="w-24 h-24 rotate-[-90deg]">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#fee2e2" strokeWidth="12" />
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#ec4899" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progress / 100)} strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-pink-600 text-lg">
                  {progress}%
                </div>
             </div>
             <div>
                <div className="text-[11px] font-black uppercase tracking-[0.3em] text-pink-400 mb-1">Status</div>
                <div className="text-xl font-black text-pink-950">BLOOM LEVEL</div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-pink-100 min-h-[500px] md:min-h-full overflow-hidden group">
        <img 
          src="https://i.ibb.co/3YyGnWX5/download.png" 
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 border-[30px] border-white/10 group-hover:border-white/20 transition-all pointer-events-none" />
      </div>
    </div>
  </header>
));

const TaskItem = memo(({ task, onToggle, onDelete }) => (
  <li className={`group animate-bloom flex items-center gap-8 p-8 ${STYLES.glassCard} ${
    task.completed ? 'opacity-40 grayscale-[0.5] bg-pink-100/30' : 'hover:scale-[1.03] hover:shadow-pink-400/20'
  }`}>
    <button 
      onClick={() => onToggle(task.id)}
      className={`w-14 h-14 rounded-[1.5rem] border-4 transition-all flex items-center justify-center shadow-lg ${
        task.completed 
          ? 'bg-pink-500 border-pink-500 text-white rotate-12' 
          : 'border-pink-200 bg-white text-transparent hover:border-pink-500 hover:scale-110'
      }`}
    >
      <CheckCircle2 size={28} strokeWidth={3} className={task.completed ? 'scale-110' : 'scale-0'} />
    </button>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-4 mb-2">
        <span className={STYLES.badge}>{task.completed ? 'Done' : 'On demand'}</span>
        <Wind size={14} className="text-pink-300" />
      </div>
      <p className={`text-2xl font-black transition-all duration-300 truncate tracking-tight ${task.completed ? 'text-pink-400 line-through' : 'text-pink-950'}`}>
        {task.title}
      </p>
    </div>

    <button 
      onClick={() => onDelete(task.id)}
      className="p-5 text-pink-300 hover:text-white hover:bg-rose-500 rounded-3xl transition-all scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100"
    >
      <Trash2 size={24} />
    </button>
  </li>
));

const App = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Defining goals and strategy.", completed: false },
    { id: 2, title: "Strategic, high-impact work ", completed: true },
    { id: 3, title: "for creative problem-solving ", completed: false }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const progress = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
  }, [tasks]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' ? true : filter === 'completed' ? task.completed : !task.completed;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={STYLES.container}>
      <style>{CSS_ANIMATIONS}</style>
      <FloatingPetals />
      
      <MagazineHeader progress={progress} />

      <main className="max-w-7xl mx-auto px-6 py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          <aside className="lg:col-span-4 space-y-12">
            <div className={`${STYLES.glassCard} p-10 overflow-hidden relative`}>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Flower size={80} />
              </div>
              <h3 className="text-[14px] font-black mb-10 text-pink-600 uppercase tracking-[0.5em] border-b-4 border-pink-500 pb-4 inline-block">
                Archive
              </h3>
              <nav className="space-y-4">
                {['all', 'pending', 'completed'].map((id) => (
                  <button
                    key={id}
                    onClick={() => setFilter(id)}
                    className={`w-full text-left px-8 py-6 rounded-[2rem] text-xs font-black transition-all flex items-center justify-between group ${
                      filter === id 
                        ? 'bg-pink-600 text-white shadow-2xl shadow-pink-400 -translate-y-1' 
                        : 'text-pink-400 uppercase tracking-[0.3em] hover:bg-pink-50 hover:text-pink-600'
                    }`}
                  >
                    <span>{id === 'all' ? 'The Garden' : id === 'pending' ? 'Growing' : 'Bloomed'}</span>
                    <ChevronRight size={18} className={`transition-transform ${filter === id ? 'translate-x-1' : 'opacity-0'}`} />
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="bg-pink-950 rounded-[4rem] p-14 text-white relative overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)]">
              <Sparkles className="text-pink-500 mb-10 animate-pulse" size={48} />
              <p className="text-3xl font-serif italic mb-10 leading-tight">
                “Place demanding tasks during your peak times and easy tasks during troughs.”
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-1 bg-pink-500" />
                <span className="text-xs uppercase tracking-[0.5em] font-black text-pink-500">Sakura Zen</span>
              </div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-pink-500/20 rounded-full blur-[100px]" />
            </div>
          </aside>

          <section className="lg:col-span-8 space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-pink-400 group-focus-within:text-pink-600" size={24} />
                <input 
                  type="text"
                  placeholder="FIND YOUR FOCUS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={STYLES.input}
                />
              </div>
              <button onClick={() => setIsAdding(true)} className={STYLES.buttonPrimary}>
                <div className="relative z-10 flex items-center gap-3">
                  <Plus size={24} strokeWidth={4} />
                  <span>PLANT IDEA</span>
                </div>
                <div className="absolute inset-0 bg-pink-400 translate-y-full group-hover:translate-y-0 transition-transform" />
              </button>
            </div>

            {isAdding && (
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newTaskTitle.trim()) return;
                setTasks([{ id: Date.now(), title: newTaskTitle.toUpperCase(), completed: false }, ...tasks]);
                setNewTaskTitle('');
                setIsAdding(false);
              }} className={`${STYLES.glassCard} p-12 animate-bloom relative overflow-hidden`}>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-rose-500" />
                <input 
                  autoFocus
                  type="text"
                  placeholder="WHAT SHALL BLOOM?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full text-5xl font-black italic border-none focus:ring-0 mb-12 placeholder:text-pink-50 text-pink-950 bg-transparent outline-none tracking-tighter"
                />
                <div className="flex justify-end gap-10 items-center">
                  <button type="button" onClick={() => setIsAdding(false)} className="text-sm font-black text-pink-300 uppercase tracking-widest hover:text-pink-600">Discard</button>
                  <button type="submit" className="px-12 py-5 bg-pink-950 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-black transition-all">Archive Entry</button>
                </div>
              </form>
            )}

            <ul className="space-y-8">
              {filteredTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={(id) => setTasks(tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t))}
                  onDelete={(id) => setTasks(tasks.filter(t => t.id !== id))}
                />
              ))}
              {filteredTasks.length === 0 && (
                <div className="text-center py-40 border-8 border-dashed border-pink-200 rounded-[5rem]">
                  <p className="text-5xl font-black text-pink-200 italic tracking-tighter uppercase opacity-50">Empty Space</p>
                </div>
              )}
            </ul>
          </section>
        </div>
      </main>

      <footer className="py-40 px-8 text-center bg-white border-t-[20px] border-pink-500 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
              <Flower className="absolute -left-20 -top-20 w-[400px] h-[400px] rotate-45" />
              <Flower className="absolute -right-20 -bottom-20 w-[400px] h-[400px] -rotate-45" />
           </div>
           <h2 className="text-8xl md:text-[10rem] font-serif italic text-pink-950 mb-6 tracking-tighter text-glow">Sakura Zen</h2>
           <p className="text-sm font-black uppercase tracking-[1em] text-pink-500">Editorial Core — Est. 2026</p>
      </footer>
    </div>
  );
};

export default App;
