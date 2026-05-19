"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Navbar from "../../components/Navbar";

export default function Weather() {
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Suggestions effect (debounced)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/api/weather/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Suggestions error:", err);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const [profileLocation, setProfileLocation] = useState(null);

  // Fetch user location first
  useEffect(() => {
    async function fetchUserLocation() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.user.location) {
            setLocation(data.user.location);
            setProfileLocation(data.user.location);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      }
      setLocation("Punjab, India"); // Fallback if no MongoDB location found
    }
    fetchUserLocation();
  }, []);

  const resetToDefault = () => {
    if (profileLocation) {
      setLocation(profileLocation);
    }
  };

  // Fetch real weather data when location changes and refresh every 1 minute
  useEffect(() => {
    async function fetchWeather(isBackground = false) {
      if (!location) return;
      if (!isBackground) setLoading(true);
      try {
        const res = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
        const data = await res.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setWeatherData(data);
          setError(null);
        }
      } catch (err) {
        setError("Failed to load weather data");
      } finally {
        if (!isBackground) setLoading(false);
      }
    }
    
    fetchWeather();

    const intervalId = setInterval(() => {
      fetchWeather(true); // Background fetch
    }, 60000); // 1 minute

    return () => clearInterval(intervalId);
  }, [location]);

  const handleSearch = (locName) => {
    if (!locName.trim()) return;
    setSuggestions([]);
    setLocation(locName);
    setSearchQuery("");
  };

  const saveAsDefault = async () => {
    try {
      setSearching(true);
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: location }),
      });

      if (res.ok) {
        setProfileLocation(location);
        alert("Location saved as default farm!");
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSearching(false);
    }
  };

  const getWeatherImage = (condition) => {
    const text = condition?.toLowerCase() || "";
    if (text.includes("sun") || text.includes("clear")) return "/weather/sunny.png";
    if (text.includes("cloud") || text.includes("overcast")) return "/weather/cloudy.png";
    if (text.includes("rain") || text.includes("drizzle") || text.includes("shower")) return "/weather/rainy.png";
    return "/weather/misty.png";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold animate-pulse">Fetching Weather Data...</p>
          </div>
        </div>
      </div>
    );
  }

  const current = weatherData?.current;
  const forecast = weatherData?.forecast?.forecastday;
  const bgImage = getWeatherImage(current?.condition?.text);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <Head>
        <title>Weather Updates | KrishiSmart</title>
      </Head>

      <Navbar />

      <main className="pt-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-10 flex flex-col lg:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">Weather Dashboard</h1>
            <p className="text-slate-500 font-medium">{currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })} • <span className="text-emerald-600 font-bold">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto relative">
            <div className="relative w-full sm:w-80 group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery);
                  }
                }}
                placeholder="Search city/location..." 
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold shadow-sm text-sm"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              
              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                  {suggestions.map((s) => (
                    <button 
                      key={s.id}
                      onClick={() => handleSearch(`${s.name}, ${s.region}, ${s.country}`)}
                      className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors flex flex-col gap-0.5 border-b border-slate-50 last:border-0"
                    >
                      <span className="text-sm font-bold text-slate-900">{s.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.region}, {s.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 w-full sm:w-auto">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 truncate max-w-[150px]">
                    {weatherData?.location ? `${weatherData.location.name}, ${weatherData.location.region || weatherData.location.country}` : location}
                  </span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(location);
                      alert("Location copied!");
                    }}
                    className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 rounded-lg transition-all"
                    title="Copy Location"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                  </button>
                  {location === profileLocation && (
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">My Farm</span>
                  )}
                </div>
                {location !== profileLocation && profileLocation && (
                  <div className="flex gap-2">
                    <button 
                      onClick={resetToDefault}
                      className="text-[10px] text-slate-400 font-bold hover:underline"
                    >
                      Reset
                    </button>
                    <span className="text-slate-200 text-[10px]">•</span>
                    <button 
                      onClick={saveAsDefault}
                      className="text-[10px] text-emerald-600 font-bold hover:underline"
                    >
                      Set as Default
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-16 text-center">
             <span className="text-6xl mb-6 block">⛈️</span>
             <p className="text-red-900 text-xl font-black mb-2">Weather Data Offline</p>
             <p className="text-red-600/70 font-medium">We couldn't reach the weather servers. Check your API key or connection.</p>
          </div>
        ) : (
          <>
            {/* Main Weather Card */}
            <div className="relative rounded-[3rem] p-10 shadow-2xl mb-12 overflow-hidden min-h-[400px] flex items-end">
              <img src={bgImage} alt="Weather background" className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
              
              <div className="relative z-10 w-full flex flex-col md:flex-row items-end justify-between gap-10 text-white">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <span className="text-8xl font-black leading-none drop-shadow-2xl">{Math.round(current?.temp_c)}°</span>
                    <div className="flex flex-col">
                       <span className="text-2xl font-bold text-blue-200 uppercase tracking-widest">{current?.condition?.text}</span>
                       <span className="text-sm font-bold opacity-90">
                         {weatherData?.location ? `${weatherData.location.name}, ${weatherData.location.region || weatherData.location.country}` : location}
                       </span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                     <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-xl text-xs font-bold border border-white/20">High: {Math.round(forecast?.[0]?.day?.maxtemp_c)}°</span>
                     <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-xl text-xs font-bold border border-white/20">Low: {Math.round(forecast?.[0]?.day?.mintemp_c)}°</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl border border-white/20 w-full md:w-auto min-w-[340px] shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-400/20 flex items-center justify-center">💧</div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-blue-200">Humidity</span>
                      <span className="text-xl font-black">{current?.humidity}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-400/20 flex items-center justify-center">💨</div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-blue-200">Wind</span>
                      <span className="text-xl font-black">{current?.wind_kph} <span className="text-[10px]">km/h</span></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">☀️</div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-blue-200">UV Index</span>
                      <span className="text-xl font-black">{current?.uv}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-400/20 flex items-center justify-center">🌧️</div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-blue-200">Rainfall</span>
                      <span className="text-xl font-black">{forecast?.[0]?.day?.totalprecip_mm || 0} <span className="text-[10px]">mm</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-black text-slate-900">Weekly Outlook</h2>
              <div className="h-px flex-1 bg-slate-200 mx-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {forecast?.map((day) => (
                <div key={day.date} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all group hover:-translate-y-2 flex flex-col items-center text-center">
                  <div className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-6">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                  </div>
                  <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    <img src={day.day.condition.icon.replace('64x64', '128x128')} alt="weather" className="w-20 h-20 drop-shadow-lg" />
                  </div>
                  <div className="mb-6">
                    <div className="text-4xl font-black text-slate-900 mb-1">{Math.round(day.day.avgtemp_c)}°C</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{day.day.condition.text}</div>
                  </div>
                  <div className="w-full pt-6 border-t border-slate-50 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-400 uppercase">Rain Chance</span>
                      <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">{day.day.daily_chance_of_rain}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-400 uppercase">Avg Humidity</span>
                      <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">{day.day.avghumidity}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>


          </>
        )}
      </main>
    </div>
  );
}
