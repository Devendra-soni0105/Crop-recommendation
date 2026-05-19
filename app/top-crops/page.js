"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function TopCrops() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const res = await fetch('/api/predictions');
        if (res.ok) {
          const data = await res.json();
          setPredictions(data.predictions || []);
        }
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPredictions();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this prediction?")) return;

    try {
      const res = await fetch(`/api/predictions?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPredictions(prev => prev.filter(p => p._id !== id));
      } else {
        alert("Failed to delete prediction");
      }
    } catch (error) {
      console.error("Error deleting prediction:", error);
    }
  };

  // Helper to format date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Head>
        <title>My Predictions | KrishiSmart</title>
      </Head>

      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">My Predictions</h1>
            <p className="text-slate-500">History of crop recommendations generated for your farm.</p>
          </div>
          <Link href="/predict" className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md transition-colors w-max">
            New Prediction
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : predictions.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              🌱
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No predictions yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">You haven't made any crop predictions yet. Run your first prediction to see it listed here.</p>
            <Link href="/predict" className="inline-block px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors">
              Go to Predict Crop
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {predictions.map((pred) => (
              <div key={pred._id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                  {/* Result Section */}
                  <div className="flex-shrink-0 text-center w-full md:w-48 bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Predicted Crop</div>
                    <div className="text-4xl mb-2">🌾</div>
                    <div className="text-2xl font-black text-emerald-900 capitalize">{pred.crop}</div>
                  </div>
                  
                  {/* Details Section */}
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900">Input Parameters</h3>
                        <div className="text-sm text-slate-500">{formatDate(pred.createdAt)}</div>
                      </div>
                      <button 
                        onClick={() => handleDelete(pred._id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Prediction"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-medium mb-1">Nitrogen (N)</div>
                        <div className="font-semibold text-slate-700">{pred.inputs.nitrogen ?? '-'}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-medium mb-1">Phosphorous (P)</div>
                        <div className="font-semibold text-slate-700">{pred.inputs.phosphorous ?? '-'}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-medium mb-1">Potassium (K)</div>
                        <div className="font-semibold text-slate-700">{pred.inputs.potassium ?? '-'}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-medium mb-1">pH Level</div>
                        <div className="font-semibold text-slate-700">{pred.inputs.ph ?? '-'}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-medium mb-1">Temperature</div>
                        <div className="font-semibold text-slate-700">{pred.inputs.temperature !== undefined ? `${pred.inputs.temperature}°C` : '-'}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-medium mb-1">Humidity</div>
                        <div className="font-semibold text-slate-700">{pred.inputs.humidity !== undefined ? `${pred.inputs.humidity}%` : '-'}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-medium mb-1">Rainfall</div>
                        <div className="font-semibold text-slate-700">{pred.inputs.rainfall !== undefined ? `${pred.inputs.rainfall} mm` : '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
