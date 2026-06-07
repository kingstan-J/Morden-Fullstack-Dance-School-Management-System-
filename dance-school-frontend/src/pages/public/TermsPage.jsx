import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const TermsPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-white mb-8">Terms & <span className="gradient-text">Conditions</span></h1>
      <div className="glass-card p-8 space-y-6 text-gray-300">
        {[
          { title: '1. Enrollment', text: 'Students may enroll in one course at a time. Enrollment is confirmed only after fee payment.' },
          { title: '2. Fee Payment', text: 'Fees must be paid monthly. Late payments may result in suspension of access.' },
          { title: '3. Attendance', text: 'Students are expected to maintain a minimum 75% attendance. Certificates are issued only to eligible students.' },
          { title: '4. Certificates', text: 'Completion certificates are issued by trainers upon successful course completion and admin approval.' },
          { title: '5. Code of Conduct', text: 'All students and trainers must maintain respectful behavior. Misconduct may result in termination.' },
          { title: '6. Refund Policy', text: 'Refunds are processed within 7 working days for eligible cancellations made before the course begins.' },
          { title: '7. Intellectual Property', text: 'All course materials are property of Drizzle Dance Academy and may not be shared externally.' },
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

export default TermsPage;
