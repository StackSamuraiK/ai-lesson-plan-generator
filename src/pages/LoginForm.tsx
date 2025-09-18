import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Lock, ArrowRight } from 'lucide-react';

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'demouser' && password === 'demopass') {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/planner');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Enhanced card with subtle animations */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-black/5 p-8 rounded-2xl relative group">
          {/* Subtle hover glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          
          <div className="relative">
            {/* Enhanced header section */}
            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
                <div className="relative rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 border border-blue-200/20 backdrop-blur-sm">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                  Welcome back
                </h2>
                <p className="text-slate-500 leading-relaxed">
                  Sign in to your account to continue your journey
                </p>
              </div>
            </div>

            {/* Enhanced error display */}
            {error && (
              <div className="mb-6 p-4 text-sm text-red-600 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl text-center animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Enhanced form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Email</span>
                </label>
                <div className="relative group/input">
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="demouser"
                    required
                    className="h-12 px-4 text-slate-800 placeholder:text-slate-400 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover/input:border-slate-300"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Password</span>
                </label>
                <div className="relative group/input">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="h-12 px-4 text-slate-800 placeholder:text-slate-400 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover/input:border-slate-300"
                  />
                </div>
              </div>
              
              {/* Enhanced button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 group/button border-0"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </form>

            {/* Enhanced demo credentials display */}
            <div className="mt-8 p-4 bg-slate-50/80 backdrop-blur-sm border border-slate-200/50 rounded-xl">
              <div className="text-center">
                <p className="text-xs font-medium text-slate-500 mb-2">Demo Credentials</p>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="bg-white/80 px-3 py-2 rounded-lg border border-slate-200/50">
                    <span className="text-slate-600 font-mono">demouser</span>
                  </div>
                  <div className="text-slate-400">/</div>
                  <div className="bg-white/80 px-3 py-2 rounded-lg border border-slate-200/50">
                    <span className="text-slate-600 font-mono">demopass</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Subtle footer text */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Secure • Privacy Protected • Demo Environment
          </p>
        </div>
      </div>
    </div>
  );
}