import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FiTarget, FiHeart, FiStar, FiUsers } from 'react-icons/fi';

const AboutPage = () => {
  const team = [
    { name: 'Meera Krishnan', role: 'Founder & Director', exp: '20+ years', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
    { name: 'Priya Sharma', role: 'Bharatanatyam Trainer', exp: '8 years', image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80' },
    { name: 'Rahul Verma', role: 'Contemporary Trainer', exp: '5 years', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
    { name: 'Aisha Khan', role: 'Hip Hop Trainer', exp: '6 years', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">About <span className="gradient-text">Drizzle Dance</span></h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">Founded in 2016, Drizzle Dance Academy has been transforming lives through the art of dance. We believe every person has a dancer within.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-4"><FiTarget className="text-purple-400" size={24} /><h2 className="text-2xl font-bold text-white">Our Mission</h2></div>
            <p className="text-gray-300">To make world-class dance education accessible to everyone, nurturing talent and passion while building confidence and discipline through artistic expression.</p>
          </div>
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-4"><FiHeart className="text-pink-400" size={24} /><h2 className="text-2xl font-bold text-white">Our Values</h2></div>
            <ul className="space-y-2 text-gray-300">
              {['Passion for the art of dance', 'Excellence in teaching', 'Inclusive and welcoming community', 'Continuous growth and learning'].map((v, i) => (
                <li key={i} className="flex items-center gap-2"><span className="text-purple-400">✓</span>{v}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Meet Our <span className="gradient-text">Team</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <div key={i} className="glass-card p-6 text-center hover:border-purple-500/40 transition-all flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-purple-500/30">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-white">{m.name}</h3>
                <p className="text-purple-400 text-sm">{m.role}</p>
                <p className="text-gray-500 text-xs mt-1">{m.exp} experience</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
