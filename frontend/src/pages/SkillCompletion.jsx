import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const SkillCompletion = () => {
    const { activeSkill } = useStore();
    const navigate = useNavigate();

    return (
        <div className="text-center py-20">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
                <Trophy size={48} />
            </motion.div>
            <h1 className="text-3xl font-bold mb-4">20 Hours completed!</h1>
            <p className="text-secondary mb-8">You have reached the 20-hour milestone for {activeSkill?.name}.</p>
            <button
                onClick={() => navigate('/app')}
                className="bg-black text-white px-8 py-3 rounded-xl font-bold"
            >
                Start New Skill
            </button>
        </div>
    );
};
export default SkillCompletion;
