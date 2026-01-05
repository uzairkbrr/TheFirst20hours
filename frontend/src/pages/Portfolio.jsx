import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/store';
import api from '../lib/axios';
import { ArrowLeft, Trophy, Calendar, Clock, Award, Printer } from 'lucide-react';

const Portfolio = () => {
    const { skillId } = useParams();
    const navigate = useNavigate();
    const { user } = useStore();

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const res = await api.get('/dashboard');
                if (!res.data.has_active_skill) {
                    // No active skill means no meaningful portfolio yet
                    setData(null);
                } else {
                    setData(res.data);
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchPortfolio();
    }, [skillId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 mb-4"></div>
                <p className="text-zinc-500">Loading Certificate...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                    <Trophy size={40} className="text-zinc-300" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No Certificate Available Yet</h2>
                <p className="text-zinc-500 max-w-md mx-auto mb-8">
                    Completing your first 20 hours of practice is how you earn your certificate. Start a skill and track your progress!
                </p>
                <button
                    onClick={() => navigate('/app')}
                    className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
                >
                    Go to Dashboard
                </button>
            </div>
        );
    }

    const { skill, progress, badges } = data;

    return (
        <div className="max-w-4xl mx-auto p-8 print:p-0">
            <style>{`
                @media print {
                    @page { margin: 0.5cm; }
                    body { -webkit-print-color-adjust: exact; }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                }
            `}</style>

            <div className="mb-8 no-print">
                <button onClick={() => navigate('/app')} className="flex items-center text-zinc-500 hover:text-black">
                    <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
                </button>
            </div>

            <div className="bg-white border-4 border-double border-zinc-200 p-12 rounded-lg text-center shadow-2xl print:shadow-none print:border-8 print:border-black">
                <div className="inline-block p-4 bg-yellow-50 rounded-full mb-6 print:hidden">
                    <Trophy size={48} className="text-yellow-600" />
                </div>
                {/* Print version icon */}
                <div className="hidden print:block text-4xl mb-4">🏆</div>

                <h1 className="text-4xl font-serif font-bold mb-2 text-zinc-900">Certificate of Progress</h1>
                <p className="text-zinc-500 italic mb-8">The First 20 Hours</p>

                <div className="text-xl mb-8">
                    This certifies that
                    <div className="text-3xl font-bold my-4 font-mono">{user?.username || 'The User'}</div>
                    has dedicated <span className="font-bold">{progress.hours_done} Hours</span> to learning
                    <div className="text-3xl font-bold text-black mt-4">{skill.name}</div>
                </div>

                <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-12 text-left">
                    <div className="bg-zinc-50 p-4 rounded-lg print:border print:bg-white">
                        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total Time</div>
                        <div className="text-xl font-bold">{progress.total_minutes}m</div>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-lg print:border print:bg-white">
                        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Sessions</div>
                        <div className="text-xl font-bold">{progress.current_day - 1}</div>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-lg print:border print:bg-white">
                        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Status</div>
                        <div className="text-xl font-bold text-green-600">Active</div>
                    </div>
                </div>

                {badges && badges.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-zinc-400">Badges Earned</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {badges.map((b, i) => (
                                <div key={i} className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-100 print:border-black print:bg-white">
                                    <Award size={16} className="text-yellow-600 print:text-black" />
                                    <span className="font-bold text-sm text-yellow-900 print:text-black">{b.badge.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="text-sm text-zinc-400 mt-12 pt-8 border-t">
                    Certified by The First 20 Hours App • {new Date().toLocaleDateString()}
                </div>
            </div>

            <div className="mt-8 text-center no-print">
                <button
                    onClick={() => window.print()}
                    className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 flex items-center gap-2 mx-auto"
                >
                    <Printer size={18} /> Print Certificate
                </button>
            </div>
        </div>
    );
};

export default Portfolio;
