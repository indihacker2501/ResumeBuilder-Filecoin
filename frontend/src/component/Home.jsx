import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }}
      className="flex items-center justify-center min-h-[80vh] bg-gradient-to-b from-indigo-50 to-white px-8"
    >
      <div className="flex flex-nowrap items-center max-w-6xl w-full gap-16">
        {/* Left Section: Text and Button */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-1/2 text-left"
        >
          <h1 className="text-5xl font-bold text-indigo-600 mb-6">
            Create Your Blockchain-Verified Resume
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Build a professional resume that's verified on the blockchain. Stand out from the crowd
            with a tamper-proof digital identity.
          </p>
          <motion.button
            onClick={() => navigate('/create')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-indigo-600 border-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            <FileText size={24} />
            Create My Resume
          </motion.button>
        </motion.div>

        {/* Right Section: Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-1/2 flex justify-end"
        >
          <img
            src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=2000"
            alt="Professional workspace"
            className="rounded-lg shadow-xl max-w-full"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
