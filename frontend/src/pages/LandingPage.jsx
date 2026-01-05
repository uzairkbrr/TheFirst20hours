import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, LayoutDashboard, LogOut } from 'lucide-react';
import useStore from '../store/store';

const LandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-brand selection:text-black">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
                        <div className="w-10 h-10 bg-brand text-black rounded-lg flex items-center justify-center font-mono text-xl shadow-[0_0_15px_rgba(250,205,5,0.4)]">20</div>
                        <span>HOURS</span>
                    </div>
                    <div className="flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                <button onClick={() => navigate('/app')} className="font-medium hover:text-brand transition-colors flex items-center gap-2 text-sm md:text-base">
                                    <LayoutDashboard size={18} /> <span className="hidden md:inline">Dashboard</span>
                                </button>
                                <button onClick={handleLogout} className="bg-white/10 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-bold text-sm md:text-base hover:bg-white/20 transition-all flex items-center gap-2">
                                    <LogOut size={18} /> <span className="hidden md:inline">Log Out</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => navigate('/login')} className="font-medium hover:text-brand transition-colors text-sm md:text-base">Log In</button>
                                <button onClick={() => navigate('/signup')} className="bg-brand text-black px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-bold text-sm md:text-base hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.25)]">Start Journey</button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-32 px-6 overflow-hidden">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand/10 rounded-full blur-[120px] -z-10" />

                <div className="container mx-auto max-w-5xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
                            THE FIRST <br />
                            <span className="text-brand inline-block transform -rotate-2">20 HOURS</span>
                        </h1>
                        <p className="text-zinc-300 text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                            How to learn anything... <span className="text-white font-bold italic underline decoration-brand decoration-4 underline-offset-4">FAST!</span>
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            {isAuthenticated ? (
                                <button onClick={() => navigate('/app')} className="px-8 py-4 md:px-10 md:py-5 bg-brand text-black rounded-full font-black text-lg md:text-xl flex items-center gap-2 md:gap-3 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(250,205,5,0.3)]">
                                    GO TO DASHBOARD <ArrowRight className="stroke-[3px]" size={20} />
                                </button>
                            ) : (
                                <button onClick={() => navigate('/signup')} className="px-8 py-4 md:px-10 md:py-5 bg-brand text-black rounded-full font-black text-lg md:text-xl flex items-center gap-2 md:gap-3 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(250,205,5,0.3)]">
                                    START LEARNING <ArrowRight className="stroke-[3px]" size={20} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 10 Principles of Rapid Skill Acquisition */}
            <section className="py-24 bg-zinc-900 border-t border-white/10">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-hand">Rapid Skill Acquisition</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">The 10 principles to learn anything fast.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-5xl mx-auto">
                        <ListCard number="01" title="Choose a lovable project" desc="Pick something you're dying to learn." />
                        <ListCard number="02" title="Focus your energy on 1 skill" desc="Don't multitask. Immersion wins." />
                        <ListCard number="03" title="Define target performance level" desc="What does 'good enough' look like?" />
                        <ListCard number="04" title="Deconstruct into subskills" desc="Break it down into manageable chunks." />
                        <ListCard number="05" title="Obtain critical tools" desc="Get the gear you need before you start." />
                        <ListCard number="06" title="Eliminate barriers to practice" desc="Remove distractions and friction." />
                        <ListCard number="07" title="Make dedicated time for practice" desc="Schedule it. Protect that time." />
                        <ListCard number="08" title="Create fast feedback loops" desc="Know immediately if you're wrong." />
                        <ListCard number="09" title="Practice in short bursts" desc="Use timers. Sprint, then rest." />
                        <ListCard number="10" title="Emphasize quantity and speed" desc="Repetition builds muscle memory." />
                    </div>
                </div>
            </section>

            {/* 10 Principles of Effective Learning */}
            <section className="py-24 bg-black border-t border-white/10">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-hand text-brand">Effective Learning</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Support your practice with these learning strategies.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-5xl mx-auto">
                        <ListCard number="01" title="Research the skill" desc="Skim 3-5 books to map the terrain." />
                        <ListCard number="02" title="Jump in over your head" desc="Confusion is part of the process." />
                        <ListCard number="03" title="Identify mental models" desc="Understand the core concepts first." />
                        <ListCard number="04" title="Imagine the opposite" desc="Invert problems to find solutions." />
                        <ListCard number="05" title="Talk to practitioners" desc="Ask experts about the reality." />
                        <ListCard number="06" title="Eliminate distractions" desc="Turn off your phone. Focus." />
                        <ListCard number="07" title="Use spaced repetition" desc="Review at increasing intervals." />
                        <ListCard number="08" title="Create scaffolds and checklists" desc="Don't rely on willpower alone." />
                        <ListCard number="09" title="Make and test predictions" desc="Guess, test, learn, repeat." />
                        <ListCard number="10" title="Honor your biology" desc="Sleep, eat, and move to learn better." />
                    </div>
                </div>
            </section>

            {/* Feature Mapping Section */}
            <section className="py-24 bg-zinc-900 border-t border-white/10 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px] -z-10" />

                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <div className="inline-block px-4 py-1 bg-white/5 rounded-full border border-white/10 text-brand text-sm font-bold tracking-widest uppercase mb-4">
                            Theory to Practice
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Built to Enforce the Rules</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                            We didn't just build a to-do list. We built a system that forces you to follow the rapid acquisition framework.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <FeatureCard
                            icon={<LayoutDashboard size={32} />}
                            title="AI Deconstruction"
                            principle="Solves Principle #4 & #1"
                            desc="Don't know where to start? Enter any skill, and our AI instantly researches and breaks it down into a 20-hour roadmap of subskills."
                        />
                        <FeatureCard
                            icon={<Zap size={32} />}
                            title="Deep Focus Timer"
                            principle="Solves Principle #9 & #6"
                            desc="Stop multitasking. Our dedicated session timer keeps you honest, tracking your practice in 45-minute bursts to maximize retention."
                        />
                        <FeatureCard
                            icon={<ArrowRight size={32} />}
                            title="Smart Scheduling"
                            principle="Solves Principle #7 & #10"
                            desc="We auto-schedule your sessions. Miss a day? One-click 'Life Happened' adjusts your entire timeline so you never feel behind."
                        />
                        <FeatureCard
                            icon={<LayoutDashboard size={32} />} // Using similar icon for now, or maybe trophy?
                            title="Gamified Progress"
                            principle="Solves Principle #8 & #10"
                            desc="Earn badges for consistency and hours logged. Visible progress creates the fast feedback loops necessary to keep you motivated."
                        />
                    </div>
                </div>
            </section>

            {/* App Preview Section */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="container mx-auto text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Your Intelligent Coach</h2>
                    <p className="text-zinc-400">Designed to guide you through the process.</p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    <div className="border border-white/10 rounded-2xl shadow-2xl bg-zinc-900 overflow-hidden aspect-video relative group">
                        <img
                            src="/images/concept_intelligent_coach_1767641455406.png"
                            alt="Intelligent Coach Dashboard"
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 bg-zinc-950">
                <div className="container mx-auto px-6 flex flex-col items-center gap-6 text-center">
                    <div className="text-zinc-500 font-medium">
                        Built with <span className="text-red-500 mx-1">🫶</span> by
                        <a
                            href="https://linkedin.com/in/uzairkbrr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand hover:underline hover:text-yellow-400 ml-1 transition-colors"
                        >
                            uzair
                        </a>
                    </div>
                    <p className="text-zinc-600 text-sm">&copy; 2026 First 20 Hours. Inspired by Josh Kaufman.</p>
                </div>
            </footer>
        </div>
    );
};

const VisualCard = ({ imgSrc, step, title, desc }) => (
    <motion.div
        whileHover={{ y: -10 }}
        className="flex flex-col items-center text-center group"
    >
        <div className="relative w-full aspect-square mb-8 rounded-2xl overflow-hidden border-2 border-white/10 bg-zinc-800/50 group-hover:border-brand/50 transition-colors p-4">
            <img src={imgSrc} alt={title} className="w-full h-full object-contain filter brightness-90 contrast-125 saturate-0 group-hover:saturate-100 transition-all duration-500" />
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-brand text-black font-bold flex items-center justify-center">
                {step}
            </div>
        </div>
        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-brand transition-colors">{title}</h3>
        <p className="text-zinc-400 leading-relaxed max-w-xs">{desc}</p>
    </motion.div>
);

const ListCard = ({ number, title, desc }) => (
    <motion.div
        initial="rest"
        whileHover="hover"
        variants={{
            rest: { x: 0 },
            hover: { x: 10 }
        }}
        className="flex items-center gap-6 p-6 rounded-xl border border-white/5 hover:bg-white/5 hover:border-brand/20 transition-all group h-full relative overflow-hidden"
    >
        <div className="text-4xl font-black text-white/10 group-hover:text-brand transition-colors font-mono tracking-tighter shrink-0">{number}</div>
        <div className="flex-1">
            <div className="text-xl font-bold text-zinc-200 group-hover:text-white transition-colors leading-tight mb-1">{title}</div>
            <motion.div
                variants={{
                    rest: { opacity: 0, height: 0, marginTop: 0 },
                    hover: { opacity: 1, height: 'auto', marginTop: 8 }
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-sm text-zinc-400 group-hover:text-brand/80 overflow-hidden"
            >
                {desc}
            </motion.div>
        </div>
    </motion.div>
);

const FeatureCard = ({ icon, title, principle, desc }) => (
    <div className="bg-zinc-800/30 border border-white/5 p-8 rounded-2xl hover:bg-zinc-800/50 hover:border-brand/20 transition-all group">
        <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-brand group-hover:text-black transition-colors shadow-lg">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="text-brand text-xs font-bold uppercase tracking-wider mb-4">{principle}</div>
        <p className="text-zinc-400 leading-relaxed text-lg">{desc}</p>
    </div>
);

export default LandingPage;
