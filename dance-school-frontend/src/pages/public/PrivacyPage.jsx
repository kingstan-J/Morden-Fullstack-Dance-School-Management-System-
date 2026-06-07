import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const PrivacyPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-white mb-8">Privacy <span className="gradient-text">Policy</span></h1>
      <div className="glass-card p-8 space-y-6 text-gray-300">
        {[
          { title: '1. Information We Collect', text: 'We collect personal information including name, email address, phone number, and payment details when you register or use our services.' },
          { title: '2. How We Use Your Information', text: 'Your information is used to manage your enrollment, process payments, communicate updates, and improve our services.' },
          { title: '3. Data Security', text: 'We implement industry-standard security measures to protect your personal data. Passwords are encrypted using bcrypt.' },
          { title: '4. Data Sharing', text: 'We do not sell or share your personal data with third parties except as required by law or to provide our services.' },
          { title: '5. Your Rights', text: 'You have the right to access, update, or delete your personal information at any time through your account settings.' },
          { title: '6. Cookies', text: 'Our platform uses essential cookies for authentication and session management. No tracking cookies are used.' },
          { title: '7. Contact Us', text: 'For privacy concerns, contact us at privacy@drizzledance.com.' },
        ].map(({ title, text }) => (
          <div key={title}>
            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
            <p>{text}</p>
          </div>
        ))}
        <p className="text-gray-500 text-sm">Last updated: January 2024</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default PrivacyPage;
