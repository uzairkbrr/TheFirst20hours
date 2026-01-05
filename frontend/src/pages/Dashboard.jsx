import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';
import api from '../lib/axios';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Calendar, Clock, Shuffle, Link as LinkIcon, Search, Plus, Trophy, Award, Footprints, Hand as HandIcon, Download } from 'lucide-react';

const Dashboard = () => {
    const { activeSkill, isLoading, user } = useStore();
    const [dashboardData, setDashboardData] = useState(null);
    const [showLifeHappened, setShowLifeHappened] = useState(false);
    const navigate = useNavigate();

    const handleShift = async (days) => {
        try {
            await api.post(`/skills/${dashboardData.skill.id}/shift`, null, { params: { days } });
            // Refresh data
            const res = await api.get('/dashboard');
            setDashboardData(res.data);
            setShowLifeHappened(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddResource = async () => {
        const url = prompt("Enter resource URL:");
        if (!url) return;
        const title = prompt("Enter a title (e.g. 'Great Tutorial'):") || "Resource";

        try {
            await api.post(`/plans/${dashboardData.current_plan.id}/resources`, { title, url, type: 'link' });
            // Optimistic update or refresh
            const res = await api.get('/dashboard');
            setDashboardData(res.data);
        } catch (err) {
            alert("Failed to add resource");
        }
    };

    const handleSmartSearch = () => {
        const query = `site:reddit.com OR site:stackoverflow.com OR site:youtube.com "${dashboardData.current_plan.focus_topic}" tutorial guide`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    };

    const handleExportCalendar = async () => {
        try {
            const res = await api.get(`/skills/${dashboardData.skill.id}/calendar`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${dashboardData.skill.name}_schedule.ics`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            alert("Failed to export calendar");
        }
    };

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/dashboard');
                if (!res.data.has_active_skill) {
                    navigate('/app/setup');
                } else {
                    setDashboardData(res.data);
                }
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    useStore.getState().logout();
                    navigate('/login');
                } else {
                    setError("Something went wrong loading your dashboard.");
                }
            }
        };
        fetchData();
    }, [activeSkill, navigate]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center mt-20 space-y-4">
                <div className="text-red-500 font-bold">Error</div>
                <div className="text-secondary">{error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-zinc-800"
                >
                    Retry
                </button>
                <button
                    onClick={() => { useStore.getState().logout(); navigate('/login'); }}
                    className="text-sm text-zinc-400 hover:text-black hover:underline"
                >
                    Log Out
                </button>
            </div>
        );
    }

    if (isLoading || !dashboardData) {
        return (
            <div className="flex flex-col items-center justify-center mt-20 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <div className="text-secondary">Loading your 20 Hours...</div>
                {/* Long loading safety valve */}
                <button
                    onClick={() => { useStore.getState().logout(); navigate('/login'); }}
                    className="text-sm text-red-500 hover:underline mt-4"
                >
                    Taking too long? Log Out
                </button>
            </div>
        );
    }

    const { skill, progress } = dashboardData;
    const nextSessionNumber = Math.ceil((progress.total_minutes / 60) * (skill.daily_minutes / 60)) // Rough calc, or get from backend
    // Actually better to get next daily plan from backend.
    // For MVP let's just show "Next Session" generically or assume day X based on completed sessions.
    // We didn't implement 'get next plan' API. Let's do it in frontend logic or add endpoint later.
    // Simplification: Just show "Start Session" button.

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-1">{skill.name}</h2>
                    <p className="text-secondary">Target: {skill.target_definition}</p>
                </div>
                <button
                    onClick={handleExportCalendar}
                    className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors"
                    title="Export Schedule to Calendar"
                >
                    <Download size={20} />
                </button>
            </header>

            {/* Progress Section */}
            <section className="bg-surface p-6 rounded-2xl border border-zinc-100 shadow-sm">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <div className="text-4xl font-bold mb-1">{progress.hours_done}h</div>
                        <div className="text-sm text-secondary">of 20 hours completed</div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-semibold mb-1">{progress.percentage}%</div>
                        <div className="text-sm text-secondary">Progress</div>
                    </div>
                </div>
                <div className="h-4 bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-black"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percentage}%` }}
                    />
                </div>
            </section>

            {/* Daily Task Card */}
            {dashboardData.current_plan && (
                <section className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-zinc-100 px-3 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Day {dashboardData.current_plan.day_number}
                        {dashboardData.current_plan.scheduled_date && (
                            <span className="ml-1 text-zinc-400 font-normal">
                                • {new Date(dashboardData.current_plan.scheduled_date).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between items-start mb-2 mt-4">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Today's Focus</h3>
                        <div className="relative">
                            <button
                                onClick={() => setShowLifeHappened(!showLifeHappened)}
                                className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                                title="Life Happened? Shift Schedule"
                            >
                                <Shuffle size={16} />
                            </button>

                            {showLifeHappened && (
                                <div className="absolute top-8 right-0 bg-white shadow-xl border border-zinc-200 p-4 rounded-xl z-20 w-64 text-left">
                                    <h4 className="font-bold mb-2 text-red-500 text-sm">Life Happened?</h4>
                                    <p className="text-xs text-secondary mb-3 leading-relaxed">Don't worry. It's not about perfection, it's about persistence. Shift your schedule.</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => handleShift(1)} className="bg-zinc-100 hover:bg-zinc-200 py-2 rounded-lg text-xs text-black font-medium transition-colors">Missed 1 Day</button>
                                        <button onClick={() => handleShift(7)} className="bg-zinc-100 hover:bg-zinc-200 py-2 rounded-lg text-xs text-black font-medium transition-colors">Busy Week (+7)</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-xl font-bold mb-4">{dashboardData.current_plan.focus_topic}</div>

                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-secondary mb-6">
                        {dashboardData.current_plan.action_task}
                    </div>

                    {/* Resources Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Resources</h4>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSmartSearch}
                                    className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <Search size={12} /> Find Help
                                </button>
                                <button
                                    onClick={handleAddResource}
                                    className="text-xs flex items-center gap-1 text-zinc-600 hover:text-black font-medium"
                                >
                                    <Plus size={12} /> Add Pin
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {dashboardData.current_plan.resources && dashboardData.current_plan.resources.length > 0 ? (
                                dashboardData.current_plan.resources.map((res, i) => (
                                    <a
                                        key={i}
                                        href={res.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block p-3 bg-white border border-zinc-200 rounded-lg hover:border-black transition-colors flex items-center gap-3 group"
                                    >
                                        <div className="w-8 h-8 bg-zinc-50 rounded-md flex items-center justify-center text-zinc-500 group-hover:text-black">
                                            <LinkIcon size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-black">{res.title}</div>
                                            <div className="text-xs text-zinc-400 truncate">{res.url}</div>
                                        </div>
                                    </a>
                                ))
                            ) : (
                                <div className="text-sm text-zinc-400 italic">No resources pinned yet.</div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/app/session')}
                        className="w-full bg-black text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        <Play size={18} fill="currentColor" />
                        Start {dashboardData.current_plan.suggested_duration_minutes}m Session
                    </button>
                </section>
            )}

            {/* Action Card */}
            <section className="bg-gradient-to-br from-black to-zinc-800 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-medium mb-3 backdrop-blur-sm">
                            Ready to learn?
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Start a Focus Session</h3>
                        <p className="text-zinc-300 max-w-md">
                            Spend {skill.daily_minutes} minutes of deep practice. No distractions.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/app/session')}
                        className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-100 transition-colors flex items-center gap-2"
                    >
                        <Play size={20} fill="currentColor" />
                        Start Session
                    </button>
                </div>

                {/* Decorative BG */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-700/30 rounded-full -mr-16 -mt-16 blur-3xl" />
            </section>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface p-6 rounded-2xl border border-zinc-100">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                        <Clock size={20} />
                    </div>
                    <div className="text-2xl font-bold">{skill.daily_minutes}m</div>
                    <div className="text-sm text-secondary">Daily Goal</div>
                </div>
                <div className="bg-surface p-6 rounded-2xl border border-zinc-100">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
                        <Calendar size={20} />
                    </div>
                    <div className="text-2xl font-bold">Day {progress.current_day}</div>
                    <div className="text-sm text-secondary">Current Day</div>
                </div>
                <div className="bg-surface p-6 rounded-2xl border border-zinc-100">
                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                        <TrendingUp size={20} />
                    </div>
                    <div className="text-2xl font-bold">1</div>
                    {/* Hardcoded streak for MVP or active sessions count */}
                    <div className="text-sm text-secondary">Current Streak</div>
                </div>
            </div>

            {/* Achievements Section */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Trophy size={18} className="text-yellow-500" />
                        Achievements
                    </h3>
                    <button
                        onClick={() => navigate('/app/portfolio')}
                        className="text-xs text-zinc-400 hover:text-black underline"
                    >
                        View Certificate
                    </button>
                </div>
                <div className="bg-surface p-6 rounded-2xl border border-zinc-100 min-h-[100px]">
                    {dashboardData.badges && dashboardData.badges.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                            {dashboardData.badges.map((ub, i) => (
                                <div key={i} className="flex flex-col items-center bg-zinc-50 p-3 rounded-xl w-24 border border-zinc-100 text-center" title={ub.badge.description}>
                                    <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-2">
                                        {/* Dynamic Icon Mapping based on badge.icon_name */}
                                        {ub.badge.icon_name === 'trophy' ? <Trophy size={16} /> :
                                            ub.badge.icon_name === 'footprints' ? <Footprints size={16} /> :
                                                ub.badge.icon_name === 'hand' ? <HandIcon size={16} /> :
                                                    <Award size={16} />}
                                    </div>
                                    <div className="text-xs font-bold truncate w-full">{ub.badge.name}</div>
                                    <div className="text-[10px] text-zinc-400">{new Date(ub.earned_at).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-zinc-400">
                            <Award size={32} className="mb-2 opacity-50" />
                            <p className="text-sm">Complete sessions to earn badges!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
