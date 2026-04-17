import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductLandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlist = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #f0f7f1 0%, #e8f3ea 30%, #fff 70%, #f5f9f5 100%)' }}>
      {/* Nav */}
      <header className="w-full py-5 px-6 md:px-12 flex items-center justify-between">
        <div className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--accent, #2f7a47)' }}>
          CoreFlow
        </div>
        <button
          onClick={() => navigate('/cf/auth/login')}
          className="text-sm font-semibold px-5 py-2 rounded-lg transition"
          style={{ color: 'var(--accent, #2f7a47)', border: '1.5px solid var(--accent, #2f7a47)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent, #2f7a47)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent, #2f7a47)'; }}
        >
          Login
        </button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center py-20">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-8"
            style={{ background: 'rgba(47,122,71,0.08)', color: 'var(--accent, #2f7a47)' }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent, #2f7a47)' }} />
            Under Active Development
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: '#1a2e1a' }}>
            Business Management,{' '}
            <span style={{ color: 'var(--accent, #2f7a47)' }}>Simplified.</span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: '#5a6b5a' }}>
            Invoicing, inventory, payments, and customer management — all in one place.
            CoreFlow is being built for businesses that want clarity without complexity.
          </p>

          {/* Waitlist form */}
          {submitted ? (
            <div
              className="inline-flex items-center gap-3 rounded-xl px-8 py-5"
              style={{ background: 'rgba(47,122,71,0.06)', border: '1px solid rgba(47,122,71,0.15)' }}
            >
              <svg className="w-6 h-6" style={{ color: 'var(--accent, #2f7a47)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-base font-semibold" style={{ color: 'var(--accent, #2f7a47)' }}>
                You're on the list! We'll reach out soon.
              </span>
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                className="flex-1 w-full rounded-xl px-5 py-3.5 text-sm border outline-none transition"
                style={{
                  borderColor: '#d0ddd2',
                  background: '#fff',
                  color: '#1a2e1a',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent, #2f7a47)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47,122,71,0.1)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#d0ddd2'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <button
                type="submit"
                className="w-full sm:w-auto rounded-xl px-7 py-3.5 text-sm font-bold text-white transition shrink-0"
                style={{ background: 'var(--accent, #2f7a47)' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                Join Waitlist
              </button>
            </form>
          )}

          <p className="text-xs mt-5" style={{ color: '#8a9b8a' }}>
            No spam, ever. We'll only email you when CoreFlow is ready.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-14">
            {['Invoicing', 'Purchase Orders', 'Inventory', 'Payments', 'Customer Management', 'Reports'].map((f) => (
              <span
                key={f}
                className="rounded-full px-4 py-2 text-xs font-medium"
                style={{ background: 'rgba(47,122,71,0.06)', color: '#3d6b4a', border: '1px solid rgba(47,122,71,0.1)' }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs" style={{ color: '#8a9b8a' }}>
          &copy; {new Date().getFullYear()} CoreFlow by Astraval. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default ProductLandingPage;
