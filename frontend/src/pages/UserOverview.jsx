import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';
import { motion } from 'framer-motion';
import {
    Plus,
    Play,
    Clock,
    Trophy,
    ArrowRight,
    MoreHorizontal
} from 'lucide-react';
import api from '../lib/axios';

const UserOverview = () => {
    const navigate = useNavigate();
    const { fetchUserSkills } = useStore();
    const [skills, setSkills] = useState({ active: [], future: [], completed: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchUserSkills();
            if (data) setSkills(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleStartFutureSkill = async (skillId) => {
        try {
            await api.post(`/skills/${skillId}/start`);
            // Refresh
            const data = await fetchUserSkills();
            if (data) setSkills(data);
        } catch (e) {
            alert("Failed to start skill");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">My Journey</h1>
                    <p className="text-zinc-500">Manage your learning portfolio</p>
                </div>
                <button
                    onClick={() => navigate('/app/setup')}
                    className="bg-black text-white px-5 py-2.5 rounded-xl font-bold hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-lg shadow-zinc-200"
                >
                    <Plus size={18} /> New Skill
                </button>
            </header>

            {/* Active Projects */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <h2 className="text-lg font-bold uppercase tracking-wider text-zinc-400">Active Projects</h2>
                </div>

                {skills.active.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {skills.active.map(skill => (
                            <motion.div
                                key={skill.id}
                                whileHover={{ y: -4 }}
                                onClick={() => navigate(`/app/skill/${skill.id}`)}
                                className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-brand/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />

                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold group-hover:text-brand-dark transition-colors">{skill.name}</h3>
                                    <div className="bg-zinc-100 p-2 rounded-full text-zinc-400 group-hover:bg-black group-hover:text-white transition-colors">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>

                                <p className="text-zinc-500 text-sm mb-6 line-clamp-2 h-10">{skill.target_definition}</p>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
                                        <span>{skill.percentage}% Complete</span>
                                        <span>{skill.hours_done} / 20 Hours</span>
                                    </div>
                                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-black transition-all duration-1000"
                                            style={{ width: `${skill.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                        <p className="text-zinc-400 mb-4">No active projects right now.</p>
                        <button onClick={() => navigate('/app/setup')} className="text-black font-bold hover:underline">Start Learning Something</button>
                    </div>
                )}
            </section>

            {/* Future / Wishlist */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 bg-zinc-300 rounded-full" />
                    <h2 className="text-lg font-bold uppercase tracking-wider text-zinc-400">Future List</h2>
                </div>

                {skills.future.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100">
                        {skills.future.map(skill => (
                            <div key={skill.id} className="p-4 flex items-center justify-between group hover:bg-zinc-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
                                <div>
                                    <h3 className="font-bold text-lg">{skill.name}</h3>
                                    <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {skill.daily_minutes}m / day</span>
                                        <span>Created {new Date(skill.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleStartFutureSkill(skill.id)}
                                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                                >
                                    <Play size={14} fill="currentColor" /> Start Now
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-zinc-400 italic pl-4">Your wishlist is empty. Add ideas you want to learn later!</div>
                )}
            </section>

            {/* Completed */}
            {skills.completed.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        <h2 className="text-lg font-bold uppercase tracking-wider text-zinc-400">Hall of Fame</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {skills.completed.map(skill => (
                            <div key={skill.id} className="bg-yellow-50 border border-yellow-100 p-6 rounded-2xl text-center">
                                <div className="inline-flex p-3 bg-white rounded-full mb-3 shadow-sm text-yellow-500">
                                    <Trophy size={24} />
                                </div>
                                <h3 className="font-bold text-yellow-900">{skill.name}</h3>
                                <p className="text-xs text-yellow-700/60 mt-1">Completed {new Date(skill.completed_at || skill.created_at).toLocaleDateString()}</p>
                                <button
                                    onClick={() => navigate(`/app/portfolio/${skill.id}`)} // Assuming portfolio supports ID? Not yet, but link for future
                                    className="mt-4 text-xs font-bold text-yellow-800 hover:underline"
                                >
                                    View Certificate
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default UserOverview;
