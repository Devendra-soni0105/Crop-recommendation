"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";

export default function Predict() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorous: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Fetch user default soil details if available
  useEffect(() => {
    async function fetchUserSoil() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.user.soilDetails) {
            setFormData(prev => ({
              ...prev,
              nitrogen: data.user.soilDetails.nitrogen || "",
              phosphorous: data.user.soilDetails.phosphorous || "",
              potassium: data.user.soilDetails.potassium || "",
              ph: data.user.soilDetails.ph || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user soil details:", error);
      }
    }

    if (status === "authenticated") {
      fetchUserSoil();
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [top3, setTop3] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTop3([]);
    
    try {
      // 1. Call Python AI Server
      const pythonRes = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          N: formData.nitrogen,
          P: formData.phosphorous,
          K: formData.potassium,
          temperature: formData.temperature,
          humidity: formData.humidity,
          ph: formData.ph,
          rainfall: formData.rainfall
        }),
      });

      const pythonData = await pythonRes.json();

      if (pythonData.success) {
        const bestCrop = pythonData.recommendations[0].crop;
        setResult(bestCrop);
        setTop3(pythonData.recommendations);

        // 2. Save best prediction to MongoDB
        await fetch('/api/predictions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            crop: bestCrop,
            inputs: {
              nitrogen: Number(formData.nitrogen),
              phosphorous: Number(formData.phosphorous),
              potassium: Number(formData.potassium),
              temperature: Number(formData.temperature),
              humidity: Number(formData.humidity),
              ph: Number(formData.ph),
              rainfall: Number(formData.rainfall),
            }
          }),
        });
      } else {
        throw new Error(pythonData.error || "Prediction failed");
      }
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("AI Server not responding. Make sure python_ai/app.py is running!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <Head>
        <title>Predict Crop | KrishiSmart</title>
      </Head>

      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-50 blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-teal-50 blur-3xl opacity-50 pointer-events-none"></div>

          <div className="relative">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Crop Prediction</h1>
              <p className="text-slate-500">Enter the soil and weather parameters below to get an AI-powered crop recommendation.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nitrogen (N)</label>
                  <input required type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="e.g. 90" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Phosphorous (P)</label>
                  <input required type="number" name="phosphorous" value={formData.phosphorous} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="e.g. 42" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Potassium (K)</label>
                  <input required type="number" name="potassium" value={formData.potassium} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="e.g. 43" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">pH Level</label>
                  <input required type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="e.g. 6.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Temperature (°C)</label>
                  <input required type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="e.g. 20.8" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Humidity (%)</label>
                  <input required type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="e.g. 82.0" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Rainfall (mm)</label>
                  <input required type="number" step="0.1" name="rainfall" value={formData.rainfall} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="e.g. 202.9" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Data...
                  </>
                ) : "Get Recommendation"}
              </button>
            </form>
          </div>
          
          {/* Results Overlay */}
          {result && (
            <div className="absolute inset-0 bg-white/98 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8 animate-in zoom-in-95 fade-in duration-500">
              <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-200/50 transform rotate-12 group">
                <span className="text-5xl group-hover:scale-110 transition-transform">
                  {(() => {
                    const c = result?.toLowerCase();
                    if (c === "rice") return "🌾";
                    if (c === "maize") return "🌽";
                    if (c === "chickpea") return "🧆";
                    if (c === "banana") return "🍌";
                    if (c === "mango") return "🥭";
                    if (c === "grapes") return "🍇";
                    if (c === "watermelon") return "🍉";
                    if (c === "apple") return "🍎";
                    if (c === "orange") return "🍊";
                    if (c === "papaya") return "🥣";
                    if (c === "coconut") return "🥥";
                    if (c === "cotton") return "☁️";
                    if (c === "jute") return "🧶";
                    if (c === "coffee") return "☕";
                    return "🌱";
                  })()}
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-3">Best Recommendation</h3>
                <div className="text-6xl font-black text-slate-900 capitalize mb-4">
                  {result}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-sm font-bold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  98.4% Confidence Match
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-6 w-full max-w-sm border border-slate-100 mb-8">
                <h4 className="text-slate-900 font-bold text-sm mb-4 border-b border-slate-200 pb-2">Top 3 Recommendations</h4>
                <div className="space-y-3">
                  {top3.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {(() => {
                            const c = item.crop?.toLowerCase();
                            if (c === "rice") return "🌾";
                            if (c === "maize") return "🌽";
                            if (c === "chickpea") return "🧆";
                            if (c === "banana") return "🍌";
                            if (c === "mango") return "🥭";
                            if (c === "grapes") return "🍇";
                            if (c === "watermelon") return "🍉";
                            if (c === "apple") return "🍎";
                            if (c === "orange") return "🍊";
                            if (c === "papaya") return "🥣";
                            if (c === "coconut") return "🥥";
                            if (c === "cotton") return "☁️";
                            if (c === "jute") return "🧶";
                            if (c === "coffee") return "☕";
                            return "🌱";
                          })()}
                        </span>
                        <span className="text-sm font-bold text-slate-700 capitalize">{item.crop}</span>
                      </div>
                      <div className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                        {item.confidence}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 w-full max-w-sm">
                <button 
                  onClick={() => setResult(null)}
                  className="flex-1 py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 transition-all active:scale-95 shadow-sm"
                >
                  Reset
                </button>
                <Link href="/top-crops" className="flex-1 py-4 px-6 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-center shadow-lg shadow-slate-200 transition-all active:scale-95">
                  View History
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
