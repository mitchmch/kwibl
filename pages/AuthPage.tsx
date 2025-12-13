import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Icons } from '../components/Icons';

export const AuthPage = () => {
  const { login, register, isLoading } = useApp();
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'LOGIN') {
        const success = await login(email, password);
        if (!success) {
          setError('Invalid email or password.');
        }
      } else {
        if (!name || !email || !password) {
          setError('Please fill in all fields.');
          return;
        }
        if (role === UserRole.BUSINESS && !companyName) {
            setError('Business accounts require a company name.');
            return;
        }
        await register({ name, email, password, role, companyName });
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'LOGIN' ? 'REGISTER' : 'LOGIN');
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setCompanyName('');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            {mode === 'LOGIN' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {mode === 'LOGIN' ? 'Enter your credentials to access your account' : 'Join the kwibl community today'}
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center">
              <Icons.AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'REGISTER' && (
              <>
                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.CUSTOMER)}
                    className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                      role === UserRole.CUSTOMER
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.BUSINESS)}
                    className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                      role === UserRole.BUSINESS
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Business
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                {role === UserRole.BUSINESS && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                        <input
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="Acme Inc."
                        />
                    </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center"
            >
              {isLoading ? (
                  <Icons.Activity className="w-5 h-5 animate-spin" />
              ) : (
                 mode === 'LOGIN' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
           <p className="text-sm text-slate-600">
             {mode === 'LOGIN' ? "Don't have an account?" : "Already have an account?"}
             <button 
                onClick={toggleMode}
                className="ml-2 font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
             >
                 {mode === 'LOGIN' ? 'Sign up' : 'Log in'}
             </button>
           </p>
        </div>
      </div>
    </div>
  );
};