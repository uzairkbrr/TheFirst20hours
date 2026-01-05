import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useStore from '../store/store';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/app');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-zinc-900 selection:bg-brand selection:text-black relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            {/* Back Button */}
            <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-black font-medium transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white p-8 rounded-3xl border border-zinc-200 shadow-2xl relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-2 font-bold text-3xl tracking-tighter mb-6 hover:opacity-80 transition-opacity">
                        <div className="w-12 h-12 bg-brand text-black rounded-xl flex items-center justify-center font-mono text-2xl shadow-[0_0_15px_rgba(250,205,5,0.4)]">20</div>
                        <span>HOURS</span>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-zinc-500">Continue your learning journey</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 flex items-center justify-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1.5 text-zinc-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-100 focus:border-black focus:outline-none transition-colors bg-zinc-50 focus:bg-white"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-bold text-zinc-700">Password</label>
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-100 focus:border-black focus:outline-none transition-colors bg-zinc-50 focus:bg-white"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-brand text-black py-3.5 rounded-xl font-bold text-lg hover:bg-yellow-400 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-yellow-400/20 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Signing In...
                            </div>
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-zinc-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-black font-bold hover:underline decoration-brand decoration-2 underline-offset-2">
                        Start your journey
                    </Link>
                </div>
            </motion.div>

            {/* Footer-like element */}
            <div className="absolute bottom-6 text-xs text-zinc-400">
                &copy; 2026 First 20 Hours
            </div>
        </div>
    );
};

export default Login;
