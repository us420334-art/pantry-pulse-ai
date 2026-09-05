import React, { useState, useEffect } from 'react';
import API from '../api';

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [recipe, setRecipe] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchItems = async () => {
        try {
            setError('');
            const { data } = await API.get('/pantry');
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch items error:", err);
            setError(err.response?.data?.message || 'Failed to fetch pantry items.');
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
            
            // Instantly append new item to screen
            if (data && (data._id || data.id)) {
                setItems((prev) => [...prev, data]);
            } else {
                // Fallback fetch if server doesn't return full object
                fetchItems();
            }
            
            setName('');
            setQuantity('');
        } catch (err) {
            console.error("Add item error:", err);
            setError(err.response?.data?.message || err.message || 'Failed to add item to database.');
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            setError('');
            await API.delete(`/pantry/${id}`);
            setItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
        } catch (err) {
            console.error("Delete item error:", err);
            setError(err.response?.data?.message || 'Failed to delete item.');
        }
    };

    const handleGenerateRecipe = async () => {
        setLoading(true);
        setRecipe('');
        setError('');
        try {
            const { data } = await API.post('/ai/generate-recipe');
            setRecipe(data.recipe);
        } catch (err) {
            console.error("Recipe generation error:", err);
            setError(err.response?.data?.message || 'Failed to generate recipe.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 to-teal-700 p-6 rounded-2xl text-white shadow-lg">
                <div>
                    <h1 className="text-3xl font-bold">Pantry Overview</h1>
                    <p className="text-emerald-100 text-sm mt-1">Manage ingredients & transform them into AI recipes</p>
                </div>
                <button
                    onClick={handleGenerateRecipe}
                    disabled={loading || items.length === 0}
                    className="bg-white text-emerald-800 hover:bg-emerald-50 px-5 py-3 rounded-xl font-bold shadow transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <span className="animate-pulse">✨ Cooking up recipe...</span>
                    ) : (
                        <span>✨ Generate AI Recipe</span>
                    )}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="font-bold ml-4">✕</button>
                </div>
            )}

            {/* Add Item Form Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Add New Ingredient</h2>
                <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                        <input
                            type="text"
                            placeholder="Ingredient Name (e.g. Tomatoes, Eggs)"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="sm:col-span-4">
                        <input
                            type="text"
                            placeholder="Qty (e.g. 500g, 3 pcs)"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <button
                            type="submit"
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-sm"
                        >
                            Add Item
                        </button>
                    </div>
                </form>
            </div>

            {/* Pantry List Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Current Ingredients ({items.length})</h2>
                {items.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                        Your pantry is empty. Add a few ingredients above to get started!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {items.map((item, index) => (
                            <div
                                key={item._id || item.id || index}
                                className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl"
                            >
                                <div>
                                    <span className="font-semibold text-slate-700">{item.name}</span>
                                    {item.quantity && <span className="text-xs text-slate-500 ml-2">({item.quantity})</span>}
                                </div>
                                <button
                                    onClick={() => handleDeleteItem(item._id || item.id)}
                                    className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* AI Recipe Section */}
            {recipe && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">🍳</span>
                        <h2 className="text-xl font-bold text-amber-900">AI Suggested Recipe</h2>
                    </div>
                    <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm bg-white/70 p-4 rounded-xl border border-amber-100">
                        {recipe}
                    </div>
                </div>
            )}
        </div>
    );
}