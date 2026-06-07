import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone, FiMusic } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import api from '../../utils/api';

const AuthPage = () => {
  const { token: resetToken } = useParams();
  const [mode, setMode] = useState(resetToken ? 'reset' : 'login');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login, register: registerUser, loading } = useAuthStore();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({ name: '', email: '', password: '', phone: '', role: 'student', specialization: '' });

  const danceStyles = ['Bharatanatyam', 'Contemporary', 'Hip Hop', 'Salsa', 'Jazz', 'Kathak', 'Ballet', 'Bollywood'];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginData.email || !loginData.password) return setError('Please enter email and password');
    try {
      const user = await login(loginData.email, loginData.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(`/${user.role}`);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!regData.name || !regData.email || !regData.password) return setError('Please fill all required fields');
    if (regData.password.length < 6) return setError('Password must be at least 6 characters');
    if (regData.role === 'trainer' && !regData.specialization) return setError('Please select a dance style you teach');
    try {
      const user = await registerUser(regData);
      toast.success(`Welcome to Drizzle Dance, ${user.name}!`);
      navigate(`/${user.role}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError('');
    const email = e.target.email.value;
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email');
      setMode('login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset link';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;
    if (password !== confirm) return setError('Passwords do not match');
    try {
      await api.put(`/auth/reset-password/${resetToken}`, { password });
      toast.success('Password reset successfully! Please login.');
      navigate('/auth');
    } catch (err) {
      const msg = err.response?.data?.message || 'Reset failed or link expired';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-[#0f0a1e]">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <FiMusic className="text-white" size={20} />
            </div>
            <span className="font-bold text-2xl gradient-text">Drizzle Dance</span>
          </Link>
        </div>

        <div className="glass-card p-8">
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">{error}</p>
          )}

          {mode === 'login' && (
            <>
              <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
              <p className="text-gray-400 text-sm mb-6">Sign in to your account</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="input-field pl-9"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="input-field pl-9 pr-9"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <button type="button" onClick={() => { setMode('forgot'); setError(''); }} className="text-purple-400 text-sm hover:text-purple-300">Forgot password?</button>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              <p className="text-center text-gray-400 text-sm mt-4">
                No account? <button onClick={() => { setMode('register'); setError(''); }} className="text-purple-400 hover:text-purple-300">Sign up</button>
              </p>

            </>
          )}

          {mode === 'register' && (
            <>
              <h2 className="text-2xl font-bold text-white mb-1">Join Drizzle Dance</h2>
              <p className="text-gray-400 text-sm mb-6">Create your account</p>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      className="input-field pl-9"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      className="input-field pl-9"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Phone</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                      className="input-field pl-9"
                      placeholder="10-digit phone"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      className="input-field pl-9 pr-9"
                      placeholder="Min 6 characters"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => setRegData({ ...regData, role: 'student', specialization: '' })}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        regData.role === 'student' ? 'border-purple-500 bg-purple-500/20 text-purple-300' : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}>🎓 Student</button>
                    <button type="button" onClick={() => setRegData({ ...regData, role: 'trainer' })}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        regData.role === 'trainer' ? 'border-pink-500 bg-pink-500/20 text-pink-300' : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}>🎤 Trainer</button>
                  </div>
                </div>
                {regData.role === 'trainer' && (
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Dance Style You Teach</label>
                    <div className="grid grid-cols-2 gap-2">
                      {danceStyles.map(style => (
                        <button key={style} type="button" onClick={() => setRegData({ ...regData, specialization: style })}
                          className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                            regData.specialization === style ? 'border-pink-500 bg-pink-500/20 text-pink-300' : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                          }`}>{style}</button>
                      ))}
                    </div>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
              <p className="text-center text-gray-400 text-sm mt-4">
                Have an account? <button onClick={() => { setMode('login'); setError(''); }} className="text-purple-400 hover:text-purple-300">Sign in</button>
              </p>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <h2 className="text-2xl font-bold text-white mb-1">Reset Password</h2>
              <p className="text-gray-400 text-sm mb-6">Enter your email to receive a reset link</p>
              <form onSubmit={handleForgot} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input name="email" type="email" className="input-field pl-9" placeholder="your@email.com" required />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full">Send Reset Link</button>
              </form>
              <p className="text-center text-gray-400 text-sm mt-4">
                <button onClick={() => { setMode('login'); setError(''); }} className="text-purple-400 hover:text-purple-300">Back to login</button>
              </p>
            </>
          )}

          {mode === 'reset' && (
            <>
              <h2 className="text-2xl font-bold text-white mb-1">Set New Password</h2>
              <p className="text-gray-400 text-sm mb-6">Enter your new password below</p>
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">New Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input name="password" type={showPass ? 'text' : 'password'} className="input-field pl-9 pr-9" placeholder="Min 6 characters" required minLength={6} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input name="confirm" type="password" className="input-field pl-9" placeholder="Confirm password" required minLength={6} />
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full">Reset Password</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
