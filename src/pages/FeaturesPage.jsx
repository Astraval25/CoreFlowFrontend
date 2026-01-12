const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-blue-600">CoreFlow</div>
            <nav className="flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="/features" className="text-blue-600 font-medium">Features</a>
              <a href="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
              <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Powerful Features for Your Business</h1>
          <p className="text-xl text-gray-600">Everything you need to manage and grow your business efficiently</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Smart Invoicing</h3>
                <p className="text-gray-600 mb-4">Create professional invoices with automated calculations, tax handling, and payment tracking. Send invoices via email and get paid faster.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Customizable invoice templates</li>
                  <li>• Automated payment reminders</li>
                  <li>• Multi-currency support</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Inventory Management</h3>
                <p className="text-gray-600 mb-4">Track stock levels in real-time, manage suppliers, and automate reorder points to never run out of inventory.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Real-time stock tracking</li>
                  <li>• Low stock alerts</li>
                  <li>• Supplier management</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Customer Management</h3>
                <p className="text-gray-600 mb-4">Maintain detailed customer profiles, track interactions, and build stronger relationships with your clients.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete customer profiles</li>
                  <li>• Interaction history</li>
                  <li>• Customer segmentation</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Financial Reports</h3>
                <p className="text-gray-600 mb-4">Get comprehensive insights with real-time financial reports, profit & loss statements, and cash flow analysis.</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Real-time dashboards</li>
                  <li>• P&L statements</li>
                  <li>• Cash flow reports</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;