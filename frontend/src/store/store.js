import { create } from 'zustand';
import api from '../lib/axios';

const useStore = create((set) => ({
    user: null,
    isAuthenticated: !!localStorage.getItem('token'),
    activeSkill: null,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await api.post('/auth/token', formData);
            const { access_token } = response.data;

            localStorage.setItem('token', access_token);
            set({ isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.detail || 'Login failed', isLoading: false });
            return false;
        }
    },

    signup: async (email, username, password) => {
        set({ isLoading: true, error: null });
        try {
            await api.post('/auth/signup', { email, username, password });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.detail || 'Signup failed', isLoading: false });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false, activeSkill: null });
    },

    fetchActiveSkill: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/skills/active');
            set({ activeSkill: response.data, isLoading: false });
        } catch (error) {
            set({ activeSkill: null, isLoading: false });
        }
    },

    // New action to fetch all skills
    fetchUserSkills: async () => {
        set({ isLoading: true });
        try {
            // We'll return the raw data object { active: [], completed: [], future: [] }
            const response = await api.get('/skills');
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({ isLoading: false });
            return null;
        }
    }
}));

export default useStore;
