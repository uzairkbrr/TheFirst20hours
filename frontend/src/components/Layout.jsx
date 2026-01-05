import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Home, PlusCircle } from 'lucide-react';
import useStore from '../store/store';

const Layout = () => {
    const { logout, fetchActiveSkill, activeSkill, isLoading } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchActiveSkill();
    }, []);

    // Redirect to setup if no active skill and not loading
    useEffect(() => {
        if (!isLoading && activeSkill === null) {
            // Check if we are already on setup page? No, Layout wraps setup page too?
            // Wait, Layout wraps Dashboard, Setup, etc.
            // If we are on Dashboard and no active skill, redirect or show "Start New Skill"
            // But Setup page allows creating skill.
        }
    }, [activeSkill, isLoading]);

    return (
        <div className="min-h-screen bg-background text-primary font-sans flex flex-col">
            <header className="border-b border-zinc-200 bg-surface px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/app')}>
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">20</div>
                    <h1 className="text-xl font-bold tracking-tight">First 20 Hours</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={logout} className="text-sm font-medium text-zinc-500 hover:text-black flex items-center gap-2">
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
