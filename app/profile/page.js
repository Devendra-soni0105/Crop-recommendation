"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

import Navbar from "../../components/Navbar";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [personalDetails, setPersonalDetails] = useState({
    fullName: "",
    email: "",
    location: "",
    farmSize: "",
  });

  const [soilDetails, setSoilDetails] = useState({
    nitrogen: "",
    phosphorous: "",
    potassium: "",
    ph: "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch profile data
  useEffect(() => {
    async function fetchProfile() {
      if (session?.user) {
        try {
          const res = await fetch('/api/user/profile');
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              setPersonalDetails(prev => ({
                fullName: data.user.name || session.user.name || "",
                email: data.user.email || session.user.email || "",
                location: data.user.location || "",
                farmSize: data.user.farmSize || "",
              }));
              
              if (data.user.soilDetails) {
                setSoilDetails({
                  nitrogen: data.user.soilDetails.nitrogen || "",
                  phosphorous: data.user.soilDetails.phosphorous || "",
                  potassium: data.user.soilDetails.potassium || "",
                  ph: data.user.soilDetails.ph || "",
                });
              }
            }
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoadingProfile(false);
        }
      }
    }
    
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [session, status]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSoilChange = (e) => {
    const { name, value } = e.target;
    setSoilDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location: personalDetails.location,
          farmSize: personalDetails.farmSize ? Number(personalDetails.farmSize) : null,
          soilDetails: {
            nitrogen: soilDetails.nitrogen ? Number(soilDetails.nitrogen) : null,
            phosphorous: soilDetails.phosphorous ? Number(soilDetails.phosphorous) : null,
            potassium: soilDetails.potassium ? Number(soilDetails.potassium) : null,
            ph: soilDetails.ph ? Number(soilDetails.ph) : null,
          }
        })
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || (status === "authenticated" && loadingProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <Head>
        <title>Farmer Profile | KrishiSmart</title>
      </Head>

      <Navbar />

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row items-center gap-6">
          {session?.user?.image ? (
            <img src={session.user.image.replace('=s96-c', '=s200-c')} alt="Profile" className="w-20 h-20 rounded-full shadow-md border-4 border-white" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl shadow-md border-4 border-white">
              {personalDetails.fullName ? personalDetails.fullName.charAt(0).toUpperCase() : "👤"}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {session?.user?.name ? `Welcome, ${session.user.name}` : "Your Profile"}
            </h1>
            <p className="text-slate-500">
              {session?.user?.email ? session.user.email : "Manage your personal information and default farm soil details."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Personal Details Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Personal Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input required type="text" name="fullName" value={personalDetails.fullName} onChange={handlePersonalChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="e.g. Ramesh Kumar" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address (Identifier)</label>
                <input required type="email" name="email" value={personalDetails.email} onChange={handlePersonalChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="e.g. ramesh@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Farm Location (City/State)</label>
                <input type="text" name="location" value={personalDetails.location} onChange={handlePersonalChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="e.g. Punjab, India" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Farm Size (Acres)</label>
                <input type="number" step="0.1" name="farmSize" value={personalDetails.farmSize} onChange={handlePersonalChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none" placeholder="e.g. 5.5" />
              </div>
            </div>
          </div>

          {/* Soil Details Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
             {/* Decorative blob */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-emerald-50 blur-3xl opacity-60 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-6 relative">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Default Soil Profile</h2>
            </div>
            
            <p className="text-sm text-slate-500 mb-6 relative">Set your baseline soil parameters. If you test your soil regularly, enter the latest readings here. We will use these as defaults for future predictions.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nitrogen (N)</label>
                <input type="number" name="nitrogen" value={soilDetails.nitrogen} onChange={handleSoilChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="e.g. 90" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phosphorous (P)</label>
                <input type="number" name="phosphorous" value={soilDetails.phosphorous} onChange={handleSoilChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="e.g. 42" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Potassium (K)</label>
                <input type="number" name="potassium" value={soilDetails.potassium} onChange={handleSoilChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="e.g. 43" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Average pH Level</label>
                <input type="number" step="0.1" name="ph" value={soilDetails.ph} onChange={handleSoilChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none" placeholder="e.g. 6.5" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={saving}
              className="py-4 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2 min-w-[200px]"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : "Save Profile"}
            </button>
          </div>

          {/* Success Message */}
          <div className={`transition-all duration-500 overflow-hidden ${saved ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-xl flex items-center gap-3">
              <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Profile saved successfully! We'll use this data for your future predictions.</span>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
