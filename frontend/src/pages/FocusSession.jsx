import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Save, ArrowLeft } from 'lucide-react';

const FocusSession = () => {
    const { activeSkill, fetchActiveSkill } = useStore();
    const navigate = useNavigate();

    const [isRunning, setIsRunning] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [sessionState, setSessionState] = useState('idle'); // idle, running, paused, reflecting, saving
    const [targetDuration, setTargetDuration] = useState(20);

    // Reflection state
    const [reflection, setReflection] = useState({
        content: '',
        difficulty: 'Medium',
        key_takeaway: ''
    });

    useEffect(() => {
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setElapsedSeconds(s => s + 1);
            }, 1000);
        } else if (!isRunning && interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        // Ensure we have active skill data
        if (!activeSkill) {
            fetchActiveSkill();
        } else {
            setTargetDuration(activeSkill.daily_minutes);
        }
    }, [activeSkill]);

    const toggleTimer = () => setIsRunning(!isRunning);

    const stopTimer = () => {
        setIsRunning(false);
        setSessionState('reflecting');
    };

    const handleSaveSession = async () => {
        setSessionState('saving');
        try {
            // 1. Log Session
            const durationMinutes = Math.floor(elapsedSeconds / 60); // Or Math.ceil to be generous
            if (durationMinutes < 1) {
                // If less than 1 min, simpler handling or warn user? 
                // Allow it for testing.
            }

            const sessionRes = await api.post('/sessions', {
                duration_minutes: durationMinutes > 0 ? durationMinutes : 1
            }, {
                params: { skill_id: activeSkill.id }
            });

            const sessionId = sessionRes.data.id;

            // 2. Log Reflection
            if (sessionId) {
                await api.post('/reflections', {
                    session_id: sessionId,
                    ...reflection
                });
            }

            // 3. Refresh and Redirect
            await fetchActiveSkill();
            navigate('/app');

        } catch (error) {
            console.error(error);
            alert("Failed to save session");
            setSessionState('reflecting');
        }
    };

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const progressPercent = targetDuration
        ? Math.min((elapsedSeconds / (targetDuration * 60)) * 100, 100)
        : 0;

    if (sessionState === 'reflecting') {
        return (
            <div className="max-w-xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Session Reflection</h2>
                <div className="bg-surface p-8 rounded-2xl border border-zinc-100 shadow-sm space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">What did you work on?</label>
                        <textarea
                            className="w-full p-3 border rounded-xl"
                            rows={3}
                            value={reflection.content}
                            onChange={e => setReflection({ ...reflection, content: e.target.value })}
                            placeholder="Practiced scales..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Difficulty</label>
                        <div className="flex gap-2">
                            {['Easy', 'Medium', 'Hard'].map(diff => (
                                <button
                                    key={diff}
                                    onClick={() => setReflection({ ...reflection, difficulty: diff })}
                                    className={`px-4 py-2 rounded-lg border ${reflection.difficulty === diff
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-zinc-600 border-zinc-200'
                                        }`}
                                >
                                    {diff}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">One Key Takeaway</label>
                        <input
                            className="w-full p-3 border rounded-xl"
                            value={reflection.key_takeaway}
                            onChange={e => setReflection({ ...reflection, key_takeaway: e.target.value })}
                            placeholder="Need to relax my wrist..."
                        />
                    </div>

                    <button
                        onClick={handleSaveSession}
                        className="w-full bg-black text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        Save Session
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="mb-8 text-center bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">
                <div className="text-zinc-500 font-medium uppercase tracking-wider text-xs mb-1">Focus Session</div>
                <h1 className="text-xl font-bold mb-4">{activeSkill?.name || 'Loading...'}</h1>

                {sessionState === 'idle' && (
                    <div className="flex flex-col items-center gap-2">
                        <label className="text-xs text-secondary font-medium uppercase">Session Goal</label>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setTargetDuration(Math.max(5, targetDuration - 5))}
                                className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-lg hover:bg-zinc-200"
                            >-</button>
                            <span className="text-2xl font-mono font-bold w-16 text-center">{targetDuration}m</span>
                            <button
                                onClick={() => setTargetDuration(targetDuration + 5)}
                                className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-lg hover:bg-zinc-200"
                            >+</button>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => setTargetDuration(15)} className="text-xs px-2 py-1 bg-zinc-50 border rounded hover:bg-zinc-100">15m</button>
                            <button onClick={() => setTargetDuration(30)} className="text-xs px-2 py-1 bg-zinc-50 border rounded hover:bg-zinc-100">30m</button>
                            <button onClick={() => setTargetDuration(activeSkill?.daily_minutes || 60)} className="text-xs px-2 py-1 bg-zinc-50 border rounded hover:bg-zinc-100">Full</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Timer Circle */}
            <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                {/* SVG Circle Progress */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="#f4f4f5"
                        strokeWidth="4"
                    />
                    <circle
                        cx="50" cy="50" r="45"
                        fill="none"
                        stroke="black"
                        strokeWidth="4"
                        strokeDasharray="283"
                        strokeDashoffset={283 - (283 * progressPercent) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl font-mono font-bold tracking-tight">
                        {formatTime(elapsedSeconds)}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                {sessionState === 'idle' && elapsedSeconds === 0 ? (
                    <button
                        onClick={() => { setIsRunning(true); setSessionState('running'); }}
                        className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                    >
                        <Play size={24} fill="currentColor" className="ml-1" />
                    </button>
                ) : (
                    <>
                        <button
                            onClick={toggleTimer}
                            className="w-14 h-14 bg-zinc-100 text-black rounded-full flex items-center justify-center hover:bg-zinc-200"
                        >
                            {isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </button>

                        <button
                            onClick={stopTimer}
                            className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100"
                        >
                            <Square size={20} fill="currentColor" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FocusSession;
