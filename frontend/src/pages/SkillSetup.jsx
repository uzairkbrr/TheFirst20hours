import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';
import api from '../lib/axios';
import { motion } from 'framer-motion';

const SkillSetup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        target_definition: '',
        daily_minutes: 45
    });
    const [isLoading, setIsLoading] = useState(false);
    const { fetchActiveSkill } = useStore();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await api.post('/skills', formData);
            await fetchActiveSkill();
            navigate('/app');
        } catch (error) {
            alert('Failed to create skill. You might already have an active one.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-12">
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">New Skill Setup</h2>
                <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-black"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-surface p-8 rounded-2xl border border-zinc-100 shadow-sm"
            >
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-lg font-medium mb-2">What skill do you want to learn?</label>
                            <p className="text-secondary text-sm mb-4">Be specific. Instead of "Coding", try "Build a React App".</p>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                                placeholder="e.g. Play 'River Flows in You' on Piano"
                                autoFocus
                            />
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            disabled={!formData.name}
                            className="w-full bg-black text-white py-3 rounded-xl font-medium disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-lg font-medium mb-2">Define "Good Enough"</label>
                            <p className="text-secondary text-sm mb-4">What will you be able to do after 20 hours?</p>
                            <textarea
                                value={formData.target_definition}
                                onChange={e => setFormData({ ...formData, target_definition: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-base min-h-[120px] focus:outline-none focus:ring-2 focus:ring-black/5"
                                placeholder="I will be able to play the song at full speed with no mistakes..."
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="w-1/3 bg-zinc-100 text-black py-3 rounded-xl font-medium"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                disabled={!formData.target_definition}
                                className="w-2/3 bg-black text-white py-3 rounded-xl font-medium disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-lg font-medium mb-2">Daily Commitment</label>
                            <p className="text-secondary text-sm mb-8">How many minutes can you seriously focus each day?</p>

                            <div className="space-y-4">
                                {[30, 45, 60, 90, 120].map(mins => (
                                    <button
                                        key={mins}
                                        onClick={() => setFormData({ ...formData, daily_minutes: mins })}
                                        className={`w-full py-3 px-4 rounded-xl border text-left transition-all ${formData.daily_minutes === mins
                                            ? 'border-black bg-black/5 ring-1 ring-black'
                                            : 'border-zinc-200 hover:border-zinc-300'
                                            }`}
                                    >
                                        <span className="font-medium">{mins} Minutes</span>
                                        <span className="text-sm text-secondary ml-2">
                                            (~{Math.ceil((20 * 60) / mins)} days to complete)
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setStep(2)}
                                className="w-1/3 bg-zinc-100 text-black py-3 rounded-xl font-medium"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-2/3 bg-black text-white py-3 rounded-xl font-medium disabled:opacity-50"
                            >
                                {isLoading ? 'Creating Plan...' : 'Start My Journey'}
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default SkillSetup;
