import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
            {/* Navigation Header */}
            <nav className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-lg">🥗</span>
                        <span className="font-bold text-lg text-white tracking-wide">Pantry Pulse AI</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-xs font-semibold px-4 py-2 rounded-xl text-slate-300 hover:text-white transition"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative overflow-hidden pt-20 pb-16 px-6">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                        ⚡ Powered by Gemini AI
                    </span>
                    
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
                        Turn Your Ingredients Into <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                            Delicious AI-Crafted Meals
                        </span>
                    </h1>
                    
                    <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Stop wasting food. Track your pantry items in real-time and let intelligent AI generate custom, step-by-step recipes tailored strictly to what you have on hand.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition duration-200"
                        >
                            Start Cooking for Free
                        </Link>
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-sm transition"
                        >
                            View Existing Pantry
                        </Link>
                    </div>
                </div>
            </header>

            {/* Feature Cards Grid */}
            <section className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-800/60">
                <div className="text-center space-y-2 mb-12">
                    <h2 className="text-2xl font-bold text-white">Smart Features for Smart Kitchens</h2>
                    <p className="text-slate-400 text-sm">Everything you need to minimize food waste and save cooking time.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">
                            📦
                        </div>
                        <h3 className="text-lg font-bold text-white">Real-Time Inventory</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Log ingredients, manage quantities, and organize your kitchen pantry items seamlessly from any device.
                        </p>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 text-xl">
                            🧠
                        </div>
                        <h3 className="text-lg font-bold text-white">Instant AI Generation</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Leverage Gemini AI to analyze your stored items and generate complete, customized recipes instantly.
                        </p>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">
                            ♻️
                        </div>
                        <h3 className="text-lg font-bold text-white">Zero Food Waste</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Utilize leftover ingredients before they expire by converting random pantry items into full meals.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="max-w-4xl mx-auto px-6 py-16 border-t border-slate-800/60">
                <div className="bg-gradient-to-r from-emerald-900/30 via-slate-900 to-teal-900/30 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-white">How Pantry Pulse Works</h2>
                        <p className="text-slate-400 text-sm">Three simple steps to your next meal.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div className="space-y-2">
                            <span className="text-emerald-400 font-extrabold text-lg">01</span>
                            <h4 className="font-bold text-white text-sm">Add Ingredients</h4>
                            <p className="text-slate-400 text-xs">Enter item names and quantities into your digital inventory.</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-teal-400 font-extrabold text-lg">02</span>
                            <h4 className="font-bold text-white text-sm">Trigger AI Engine</h4>
                            <p className="text-slate-400 text-xs">Click one button to send your ingredients list to Gemini AI.</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-emerald-400 font-extrabold text-lg">03</span>
                            <h4 className="font-bold text-white text-sm">Cook & Enjoy</h4>
                            <p className="text-slate-400 text-xs">Follow step-by-step recipe instructions generated instantly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800/60 py-8 text-center text-xs text-slate-500">
                <p>© 2026 Pantry Pulse AI. All rights reserved.</p>
            </footer>
        </div>
    );
}