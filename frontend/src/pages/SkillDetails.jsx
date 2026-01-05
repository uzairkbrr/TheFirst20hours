import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from '../store/store';
import api from '../lib/axios';
import { motion } from 'framer-motion';
import {
    Play,
    Calendar,
    Link as LinkIcon,
    Plus,
    Search,
    Download,
    Shuffle,
    ArrowLeft
} from 'lucide-react';

const SkillDetails = () => {
    const { skillId } = useParams();
    const navigate = useNavigate();
    const { activeSkill } = useStore();
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showLifeHappened, setShowLifeHappened] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data for specific skill ID if provided, otherwise default active
                const url = skillId ? `/dashboard?skill_id=${skillId}` : '/dashboard';
                const res = await api.get(url);
                if (!res.data.has_active_skill) {
                    navigate('/app/setup');
                } else {
                    setDashboardData(res.data);
                }
                setIsLoading(false);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    useStore.getState().logout();
                    navigate('/login');
                } else if (err.response?.status === 404) {
                    setError("Skill not found.");
                    setIsLoading(false);
                } else {
                    setError("Something went wrong loading your dashboard.");
                    setIsLoading(false);
                }
            }
        };
        fetchData();
    }, [skillId, navigate]);

    const handleShift = async (days) => {
        if (!dashboardData?.skill?.id) return;
        try {
            await api.post(`/skills/${dashboardData.skill.id}/shift?days=${days}`);
            // Refresh
            const url = skillId ? `/dashboard?skill_id=${skillId}` : '/dashboard';
            const res = await api.get(url);
            setDashboardData(res.data);
            setShowLifeHappened(false);
        } catch (error) {
            alert("Failed to shift schedule");
        }
    };

    const handleAddResource = async () => {
        if (!dashboardData?.current_plan) return;
        const url = prompt("Enter resource URL:");
        if (!url) return;

        try {
            // Basic Title extraction (mock)
            const title = new URL(url).hostname;

            await api.post(`/plans/${dashboardData.current_plan.id}/resources`, {
                title: title,
                url: url,
                type: 'link'
            });
            // Refresh
            const dashboardUrl = skillId ? `/dashboard?skill_id=${skillId}` : '/dashboard';
            const res = await api.get(dashboardUrl);
            setDashboardData(res.data);
        } catch (e) {
            alert("Failed to add resource");
        }
    };

    const handleSmartSearch = () => {
        if (!dashboardData?.current_plan) return;
        const query = `${dashboardData.skill.name} ${dashboardData.current_plan.focus_topic} tutorial`;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    };

    const handleExportCalendar = async () => {
        if (!dashboardData?.skill?.id) return;
        try {
            const response = await api.get(`/skills/${dashboardData.skill.id}/calendar`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${dashboardData.skill.name.toLowerCase().replace(/\s+/g, '_')}_schedule.ics`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert("Failed to export calendar");
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center mt-20 space-y-4">
                <div className="text-red-500 font-bold">Error</div>
                <div className="text-secondary">{error}</div>
                <button
                    onClick={() => navigate('/app')}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-zinc-800"
                >
                    Back to Overview
                </button>
            </div>
        );
    }

    if (isLoading || !dashboardData) {
        return (
            <div className="flex flex-col items-center justify-center mt-20 space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <div className="text-secondary">Loading learning path...</div>
            </div>
        );
    }

    const { skill, progress } = dashboardData;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 mb-4">
                <button onClick={() => navigate('/app')} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
                    <ArrowLeft size={20} className="text-zinc-500" />
                </button>
                <h1 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Skill Focus</h1>
            </div>

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
            {dashboardData.current_plan ? (
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
                                    <p className="text-xs text-secondary mb-3 leading-relaxed">Adjust your timeline without guilt.</p>
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

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => navigate(`/app/completion`)}
                            className="text-sm text-zinc-400 hover:text-black hover:underline"
                        >
                            Mark skill as completed
                        </button>
                    </div>
                </section>
            ) : (
                <div className="bg-zinc-50 p-8 rounded-2xl text-center">
                    <h3 className="text-xl font-bold mb-2">You're All Done!</h3>
                    <p className="text-secondary mb-4">You've completed the scheduled plan for this skill.</p>
                    <button
                        onClick={() => navigate('/app/completion')}
                        className="bg-brand text-black px-6 py-2 rounded-lg font-bold"
                    >
                        View Certificate
                    </button>
                </div>
            )}
        </div>
    );
};

export default SkillDetails;
