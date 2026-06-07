import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Get In <span className="gradient-text">Touch</span></h1>
          <p className="text-gray-400">Have questions? We'd love to hear from you.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="space-y-6 mb-8">
              {[
                { icon: FiMail, label: 'Email', value: 'info@drizzledance.com' },
                { icon: FiPhone, label: 'Phone', value: '+91 98765 43210' },
                { icon: FiMapPin, label: 'Address', value: '42, Dance Avenue, T. Nagar, Chennai - 600017' },
              ].map(({ icon: Icon, label, value }, i) => (
                <div key={i} className="flex items-start gap-4 glass-card p-4">
                  <div className="p-2 rounded-lg bg-purple-500/10"><Icon className="text-purple-400" size={20} /></div>
                  <div><p className="text-gray-400 text-sm">{label}</p><p className="text-white font-medium">{value}</p></div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Name</label>
                <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" required />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email</label>
                <input className="input-field" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" required />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Subject</label>
              <input className="input-field" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="How can we help?" required />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Message</label>
              <textarea className="input-field min-h-32 resize-none" value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Your message..." required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              <FiSend size={16} /> {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
