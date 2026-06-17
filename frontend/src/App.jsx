import { useState, useEffect } from 'react';
import { Sprout, ShoppingBag, LogOut, LayoutDashboard, TrendingUp, Leaf, ArrowRight } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import FarmerDashboard from './pages/FarmerDashboard';
import ConsumerHome from './pages/ConsumerHome';
import MyOrders from './pages/MyOrders';

function AppInner() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState('home');

  // Redirect based on role when user logs in/out
  useEffect(() => {
    if (!user) { setPage('home'); return; }
    if (user.role === 'farmer') setPage('dashboard');
    if (user.role === 'consumer') setPage('shop');
  }, [user]);

  if (page === 'auth') return <AuthPage onSuccess={() => {}} />;

  // Farmer sees their own layout
  if (user?.role === 'farmer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-xl"><Sprout className="text-white" size={22} /></div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-none">Farm2You</h1>
                <p className="text-xs text-green-600 font-medium">Farmer Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-400">Farmer Account</p>
              </div>
              <button onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut size={15} /> <span className="hidden sm:block">Sign Out</span>
              </button>
            </div>
          </div>
        </header>
        <FarmerDashboard />
      </div>
    );
  }

  // Consumer sees shop layout
  if (user?.role === 'consumer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 p-2 rounded-xl"><Sprout className="text-white" size={22} /></div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-none">Farm2You</h1>
                <p className="text-xs text-gray-400">Farm to table, no middlemen</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setPage(page === 'orders' ? 'shop' : 'orders')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${page === 'orders' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                <ShoppingBag size={15} /> My Orders
              </button>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-400">Consumer</p>
              </div>
              <button onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut size={15} />
              </button>
            </div>
          </div>
        </header>
        {page === 'orders' ? <MyOrders /> : <ConsumerHome />}
      </div>
    );
  }

  // Landing page for guests
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b sticky top-0 bg-white z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 p-2 rounded-xl"><Sprout className="text-white" size={22} /></div>
            <span className="text-xl font-bold text-gray-900">Farm2You</span>
          </div>
          <button onClick={() => setPage('auth')}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white text-black bg-opacity-20 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Leaf size={16} /> No middlemen. No markup.
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Fresh from the farm,<br />straight to your door
          </h1>
          <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
            Farm2You connects farmers directly with consumers — better prices for farmers, fresher produce for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setPage('auth')}
              className="bg-white text-green-700 font-bold px-8 py-3.5 rounded-xl hover:bg-green-700 hover:text-white hover:border-2 transition-colors flex items-center justify-center gap-2">
              Shop Fresh Produce <ArrowRight size={18} />
            </button>
            <button onClick={() => setPage('auth')}
              className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white hover:text-green-700 hover:bg-opacity-10 transition-colors">
              Sell Your Produce
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Consumer flow */}
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-blue-100 p-2.5 rounded-xl"><ShoppingBag className="text-blue-600" size={22} /></div>
                <h3 className="text-lg font-bold text-gray-900">For Consumers</h3>
              </div>
              <div className="space-y-4">
                {[
                  ['1', 'Sign up as a Consumer', 'Create your free account in seconds'],
                  ['2', 'Browse fresh produce', 'Explore listings from local farmers'],
                  ['3', 'Place your order', 'Order directly, no middlemen involved'],
                  ['4', 'Track delivery', 'Get updates as the farmer confirms and delivers'],
                ].map(([num, title, desc]) => (
                  <div key={num} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{num}</div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setPage('auth')}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                Start Shopping
              </button>
            </div>

            {/* Farmer flow */}
            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-green-100 p-2.5 rounded-xl"><TrendingUp className="text-green-600" size={22} /></div>
                <h3 className="text-lg font-bold text-gray-900">For Farmers</h3>
              </div>
              <div className="space-y-4">
                {[
                  ['1', 'Sign up as a Farmer', 'Create your free farmer account'],
                  ['2', 'List your produce', 'Add items with price, quantity and details'],
                  ['3', 'Receive orders', 'Get notified when consumers place orders'],
                  ['4', 'Confirm and deliver', 'Manage delivery and mark orders complete'],
                ].map(([num, title, desc]) => (
                  <div key={num} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{num}</div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setPage('auth')}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
                Start Selling
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[['🌾', 'Direct from Farmers', 'No commission cuts'],
            ['💰', 'Fair Prices', 'For both sides'],
            ['🚚', 'Fresh Delivery', 'Farm to doorstep']].map(([icon, title, desc]) => (
            <div key={title}>
              <div className="text-3xl mb-2">{icon}</div>
              <p className="font-bold text-gray-900 text-sm">{title}</p>
              <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600 py-14 px-4 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
        <p className="text-green-100 mb-6 text-sm">Join Farm2You today — free for farmers and consumers alike.</p>
        <button onClick={() => setPage('auth')}
          className="bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors">
          Create Free Account
        </button>
      </section>

      <footer className="bg-gray-900 text-white py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sprout size={18} /><span className="font-bold">Farm2You</span>
        </div>
        <p className="text-gray-400 text-sm">© 2026 Farm2You. Empowering farmers, serving consumers directly.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
