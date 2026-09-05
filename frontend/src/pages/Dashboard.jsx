import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [recipe, setRecipe] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const fetchItems = async () => {
        try {
            setError('');
            const { data } = await API.get('/pantry');
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch items error:", err);
            setError(err.response?.data?.message || 'Failed to sync pantry state.');
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setError('');
        try {
            const { data } = await API.post('/pantry', { name, quantity });
            if (data && (data._id || data.id)) {
                setItems((prev) => [...prev, data]);
            } else {
                fetchItems();
            }
            setName('');
            setQuantity('');
        } catch (err) {
            console.error("Add item error:", err);
            setError(err.response?.data?.message || 'Failed to add pantry item.');
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            setError('');
            await API.delete(`/pantry/${id}`);
            setItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
        } catch (err) {
            console.error("Delete item error:", err);
            setError(err.response?.data?.message || 'Failed to remove pantry item.');
        }
    };

    const handleGenerateRecipe = async () => {
        if (items.length === 0) {
            setError('Please add at least one ingredient to your pantry before requesting an AI recipe.');
            return;
        }

        setLoading(true);
        setRecipe('');
        setError('');

        try {
            const { data } = await API.post('/ai/generate-recipe');
            if (typeof data === 'string') {
                setRecipe(data);
            } else if (data && data.recipe) {
                setRecipe(data.recipe);
            } else {
                setRecipe(JSON.stringify(data, null, 2));
            }
        } catch (err) {
            console.error("Recipe error:", err);
            setError(err.response?.data?.message || 'Failed to execute Gemini API pipeline.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
            {/* Top Navigation */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-lg">🥗</span>
                        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            Pantry Pulse AI
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 hover:text-white text-slate-300 transition"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 pt-8 space-y-8">
                {/* Hero Feature Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/60 via-slate-900 to-teal-950/60 border border-slate-800 p-8 shadow-2xl">
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                                ✨ Powered by Gemini AI
                            </span>
                            <h1 className="text-3xl font-extrabold tracking-tight text-white">Smart Inventory & AI Kitchen Assistant</h1>
                            <p className="text-slate-400 text-sm max-w-xl">
                                Track your ingredients in real-time and construct instant recipes using generative artificial intelligence.
                            </p>
                        </div>

                        <button
                            onClick={handleGenerateRecipe}
                            disabled={loading || items.length === 0}
                            className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold px-6 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap text-sm"
                        >
                            {loading ? (
                                <span className="animate-pulse">⚡ Synthesizing Recipe...</span>
                            ) : (
                                <span>✨ Generate AI Recipe</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-2xl text-sm flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="font-bold ml-4 hover:text-white">✕</button>
                    </div>
                )}

                {/* Grid Layout: Input Form + Inventory */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Input Card */}
                    <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-white">Add Pantry Item</h2>
                            <p className="text-xs text-slate-400">Insert available ingredients for processing</p>
                        </div>

                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Item Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Tomatoes, Chicken, Garlic"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quantity / Notes</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 500g, 3 units"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/20 font-semibold py-3 rounded-xl transition text-sm"
                            >
                                + Add Ingredient
                            </button>
                        </form>
                    </div>

                    {/* Inventory List Card */}
                    <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-white">Current Inventory</h2>
                                <p className="text-xs text-slate-400">Stored items available for AI prompt context</p>
                            </div>
                            <span className="px-3 py-1 bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-bold rounded-full">
                                {items.length} items
                            </span>
                        </div>

                        {items.length === 0 ? (
                            <div className="border border-dashed border-slate-800 rounded-2xl py-12 text-center text-slate-500 text-sm">
                                Your pantry is currently empty.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
                                {items.map((item, index) => (
                                    <div
                                        key={item._id || item.id || index}
                                        className="flex items-center justify-between p-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl group hover:border-slate-700 transition"
                                    >
                                        <div className="truncate pr-2">
                                            <p className="font-semibold text-slate-200 text-sm truncate">{item.name}</p>
                                            {item.quantity && <p className="text-xs text-slate-500">{item.quantity}</p>}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteItem(item._id || item.id)}
                                            className="opacity-60 group-hover:opacity-100 text-xs text-red-400 hover:bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Output Terminal Card */}
                {recipe && (
                    <div className="bg-slate-900/90 border border-emerald-500/30 p-8 rounded-3xl shadow-2xl space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                        
                        <div className="flex items-center gap-3">
                            <span className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">🍳</span>
                            <h2 className="text-xl font-bold text-white tracking-tight">AI Generated Recipe Proposal</h2>
                        </div>

                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                            {recipe}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}