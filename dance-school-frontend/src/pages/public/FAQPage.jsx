import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const faqs = [
  { q: 'What age groups do you accept?', a: 'We accept students from age 5 and above. We have specialized batches for kids, teens, and adults.' },
  { q: 'Can I enroll in multiple courses?', a: 'Each student can be enrolled in one course at a time to ensure dedicated learning and personal attention from the trainer.' },
  { q: 'How do I pay course fees?', a: 'Fees can be paid online through our portal, via bank transfer, or in cash at the academy. Monthly payment options are available.' },
  { q: 'Do you provide certificates?', a: 'Yes! Upon successful completion of a course, you receive a digital certificate issued by your trainer and the academy.' },
  { q: 'What is the batch size?', a: 'We maintain small batches of 15-25 students to ensure personalized attention and quality training.' },
  { q: 'Can I change my enrolled course?', a: 'Course changes are possible at the end of a term. Please contact the admin or your trainer for assistance.' },
  { q: 'Do you offer trial classes?', a: 'Yes, we offer one free trial class for new students. Contact us to schedule your trial.' },
  { q: 'What should I wear to class?', a: 'Comfortable, flexible clothing is recommended. Specific requirements vary by dance style — your trainer will advise you.' },
];

const FAQPage = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-20 max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Frequently Asked <span className="gradient-text">Questions</span></h1>
          <p className="text-gray-400">Everything you need to know about Drizzle Dance Academy.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-medium text-white">{faq.q}</span>
                {open === i ? <FiChevronUp className="text-purple-400 shrink-0" /> : <FiChevronDown className="text-gray-400 shrink-0" />}
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-gray-400 text-sm border-t border-white/10 pt-4">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;
