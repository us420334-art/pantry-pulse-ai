import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await API.post('/auth/login', { email, password });

            // Save token explicitly to localStorage
            if (data.token) {
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                setError('Authentication token missing from response.');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-800">Welcome Back</h2>
                    <p className="text-slate-500 text-sm mt-2">Sign in to manage your smart pantry</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition duration-200"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}