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
            setError(err.response?.data?.message || 'Failed to sync pantry items. Please log in again.');
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
            setError(err.response?.data?.message || 'Failed to add ingredient.');
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            setError('');
            await API.delete(`/pantry/${id}`);
            setItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
        } catch (err) {
            console.error("Delete item error:", err);
            setError(err.response?.data?.message || 'Failed to delete ingredient.');
        }
    };

    const handleGenerateRecipe = async () => {
        if (items.length === 0) {
            setError('Please add at least one ingredient to your pantry first.');
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
            setError(err.response?.data?.message || 'Failed to generate recipe from AI service.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
            {/* Top Bar */}
            <nav className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">🥗</span>
                        <span className="font-bold text-lg text-white">Pantry Pulse AI</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-xs font-semibold px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 pt-8 space-y-8">
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 via-slate-900 to-teal-900/40 border border-slate-800 p-8 shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2">
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                                ✨ Gemini AI Integration
                            </span>
                            <h1 className="text-3xl font-extrabold text-white">Smart Kitchen Manager</h1>
                            <p className="text-slate-400 text-sm">Organize your ingredients and produce custom AI recipes in seconds.</p>
                        </div>

                        <button
                            onClick={handleGenerateRecipe}
                            disabled={loading || items.length === 0}
                            className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                        >
                            {loading ? (
                                <span className="animate-pulse">⚡ Crafting Recipe...</span>
                            ) : (
                                <span>✨ Generate AI Recipe</span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl text-sm flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="font-bold hover:text-white ml-4">✕</button>
                    </div>
                )}

                {/* Two-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Form Column */}
                    <div className="md:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-4">
                        <h2 className="text-lg font-bold text-white">Add Pantry Ingredient</h2>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Item Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Tomatoes, Eggs, Cheese"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quantity</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 500g, 3 pcs"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 outline-none text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition text-sm"
                            >
                                + Add Ingredient
                            </button>
                        </form>
                    </div>

                    {/* Inventory Column */}
                    <div className="md:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">Current Inventory</h2>
                            <span className="px-3 py-1 bg-slate-800 text-emerald-400 text-xs font-bold rounded-full border border-slate-700">
                                {items.length} items
                            </span>
                        </div>

                        {items.length === 0 ? (
                            <div className="border border-dashed border-slate-800 rounded-2xl py-12 text-center text-slate-500 text-sm">
                                Your pantry is currently empty.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {items.map((item, index) => (
                                    <div
                                        key={item._id || item.id || index}
                                        className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-2xl"
                                    >
                                        <div className="truncate pr-2">
                                            <p className="font-semibold text-slate-200 text-sm truncate">{item.name}</p>
                                            {item.quantity && <p className="text-xs text-slate-500">{item.quantity}</p>}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteItem(item._id || item.id)}
                                            className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded bg-red-500/10 border border-red-500/20 transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Output Section */}
                {recipe && (
                    <div className="bg-slate-900 border border-emerald-500/30 p-6 rounded-3xl shadow-2xl space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🍳</span>
                            <h2 className="text-xl font-bold text-white">AI Recipe Suggestion</h2>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                            {recipe}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}