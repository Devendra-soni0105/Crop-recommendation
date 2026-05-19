"use client";

import Head from "next/head";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
          {/* Decorative background blurs */}
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>
          <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 mb-8">
              <span className="flex w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Smart Agriculture Powered by AI
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Data-Driven <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
                Crop Recommendations
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Empowering modern farmers with Machine Learning. KrishiSmart analyzes your soil composition and environmental conditions to suggest the most profitable and suitable crops.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                <Link 
                  href="/predict" 
                  className="px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-xl shadow-emerald-500/30 transition-all transform hover:-translate-y-1"
                >
                  Dashboard & Predictions
                </Link>
              ) : (
                <Link 
                  href="/login" 
                  className="px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-xl shadow-emerald-500/30 transition-all transform hover:-translate-y-1"
                >
                  Join Now & Start Predicting
                </Link>
              )}
              <a 
                href="#how-it-works" 
                className="px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-lg border border-slate-200 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-50 border-t border-slate-100" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Why Choose KrishiSmart?</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Our predictive model takes the guesswork out of farming by relying on concrete data and advanced algorithms.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Holistic Analysis</h3>
                <p className="text-slate-600 leading-relaxed">
                  We evaluate 7 critical factors including Nitrogen, Phosphorous, Potassium (NPK), pH levels, temperature, humidity, and rainfall to ensure accurate recommendations.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-6">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">High Accuracy</h3>
                <p className="text-slate-600 leading-relaxed">
                  Powered by trained Machine Learning models (like Random Forest and Decision Trees) that have learned from vast agricultural datasets to predict outcomes precisely.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Maximize Profit</h3>
                <p className="text-slate-600 leading-relaxed">
                  Avoid the financial risk of planting the wrong crop. Maximize your yield and ROI by aligning your farming choices with scientific evidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">How It Works</h2>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">1</div>
                    <div>
                      <h4 className="text-xl font-semibold text-slate-900 mb-2">Collect Soil Data</h4>
                      <p className="text-slate-600">Gather the NPK values and pH level from your soil test report.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">2</div>
                    <div>
                      <h4 className="text-xl font-semibold text-slate-900 mb-2">Check Weather Conditions</h4>
                      <p className="text-slate-600">Input the average temperature, humidity, and rainfall for your specific region and planting season.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">3</div>
                    <div>
                      <h4 className="text-xl font-semibold text-slate-900 mb-2">Get AI Recommendation</h4>
                      <p className="text-slate-600">Our Machine Learning model processes these inputs and suggests the best crop, ensuring a high probability of success.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 w-full">
                <div className="bg-gradient-to-tr from-emerald-100 to-teal-50 rounded-3xl p-8 shadow-inner border border-emerald-100/50">
                  <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-sm">
                    <div className="space-y-4">
                      <div className="h-4 bg-slate-200 rounded-full w-3/4"></div>
                      <div className="h-4 bg-slate-200 rounded-full w-1/2"></div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="h-10 bg-emerald-50 rounded-lg"></div>
                        <div className="h-10 bg-emerald-50 rounded-lg"></div>
                      </div>
                      <div className="h-12 bg-emerald-500 rounded-lg mt-4 w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-slate-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 -z-0"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6">Ready to optimize your farming?</h2>
            <p className="text-slate-300 text-lg mb-10">Join forward-thinking farmers who are leveraging technology to make better decisions.</p>
            <Link 
              href="/predict" 
              className="inline-block px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-lg shadow-lg transition-transform transform hover:-translate-y-1"
            >
              Get Your First Recommendation
            </Link>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center">
        <p className="text-slate-500 text-sm">© {new Date().getFullYear()} KrishiSmart. Built for a smarter agricultural future.</p>
      </footer>
    </div>
  );
}
