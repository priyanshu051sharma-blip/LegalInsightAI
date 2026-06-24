import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/utils/store";
import { useRouter } from "next/router";

const features = [
  { icon: "🔍", title: "AI Document Analysis", desc: "Extract obligations, parties, deadlines and clauses from any legal document instantly.", color: "from-blue-500 to-blue-600" },
  { icon: "⚖️", title: "Case Research", desc: "Surface relevant case law, precedents and legal citations automatically.", color: "from-violet-500 to-violet-600" },
  { icon: "🛡️", title: "Risk Detection", desc: "Get a 0-100 risk score with clause-level breakdown.", color: "from-red-500 to-red-600" },
  { icon: "✅", title: "Compliance Check", desc: "Verify GDPR, HIPAA, CCPA, SOX compliance with remediation steps.", color: "from-emerald-500 to-emerald-600" },
  { icon: "💬", title: "Legal Q&A", desc: "Ask any question about your document and get precise AI answers.", color: "from-amber-500 to-amber-600" },
  { icon: "📊", title: "PDF Reports", desc: "Generate professional legal analysis reports for clients.", color: "from-cyan-500 to-cyan-600" },
];

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white text-sm">⚖️</div>
            <span className={`font-bold text-lg ${scrolled ? "text-gray-900" : "text-white"}`}>LegalAI</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button onClick={() => router.push("/dashboard")} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">Dashboard →</button>
            ) : (
              <>
                <Link href="/login" className={`text-sm font-medium transition ${scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"}`}>Sign In</Link>
                <Link href="/register" className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-blue-50 to-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-fadeIn"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl animate-fadeIn" style={{ animationDelay: '100ms' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-semibold mb-6 animate-fadeIn">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              Powered by Gemini 2.0 AI
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6 animate-fadeIn">
              Analyze Legal Docs in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Seconds</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed animate-fadeIn">
              AI-powered platform for law firms — analyze contracts, detect risks, verify compliance, and conduct legal research in one place.
            </p>
            <div className="flex flex-wrap gap-4 animate-fadeIn">
              <Link href="/register" className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition shadow-lg transform hover:-translate-y-0.5">Start for Free →</Link>
              <Link href="/login" className="px-8 py-3.5 bg-white border border-gray-200 text-blue-700 rounded-xl font-bold hover:bg-gray-50 transition">Sign In</Link>
            </div>
            <div className="flex flex-wrap gap-5 mt-8">
              {["No credit card required", "Free 14-day trial", "Cancel anytime"].map(item => (
                <span key={item} className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden md:block animate-fadeIn">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-lg">📄</div>
                <div>
                  <p className="text-white font-semibold text-sm">Employment_Contract.pdf</p>
                  <p className="text-slate-400 text-xs">Analysis complete · 2.4MB</p>
                </div>
                <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-semibold">Analyzed</span>
              </div>
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <div className="flex justify-between mb-1"><span className="text-red-400 text-xs font-bold">⚠ HIGH RISK</span><span className="text-red-300 text-xs font-bold">78/100</span></div>
                  <p className="text-gray-700 text-xs">Unlimited liability clause — no cap on damages</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <div className="flex justify-between mb-1"><span className="text-amber-400 text-xs font-bold">⚡ COMPLIANCE</span><span className="text-amber-300 text-xs font-bold">GDPR: Partial</span></div>
                  <p className="text-gray-700 text-xs">Data retention policy missing — Art. 5(1)(e)</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <span className="text-emerald-600 text-xs font-bold">✓ KEY TERMS EXTRACTED</span>
                  <p className="text-gray-700 text-xs mt-1">Non-compete: 2yr · Severance: 3mo · IP: full transfer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[["10,000+","Documents Analyzed"],["98%","Accuracy Rate"],["60s","Avg Analysis Time"],["50+","Compliance Checks"]].map(([v,l],i) => (
            <div key={i}><p className="text-4xl font-black text-gray-900">{v}</p><p className="text-gray-500 text-sm mt-1">{l}</p></div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Everything you need</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Six AI agents working together for complete legal document intelligence.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition group animate-fadeIn" style={{ animationDelay: `${i * 80}ms` }}>
                <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform`}>{f.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-white to-blue-50 animate-fadeIn">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-5">Ready to transform your legal workflow?</h2>
          <p className="text-gray-600 text-lg mb-10">Join legal professionals saving 10+ hours per week on document review.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="px-10 py-4 bg-white text-blue-700 rounded-xl font-black text-lg hover:bg-blue-50 transition shadow-xl">Get Started Free →</Link>
            <Link href="/login" className="px-10 py-4 border-2 border-white/40 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition">Sign In</Link>
          </div>
        </div>
      </section>
      {/* Why we use this + Terms */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Why we use this</h3>
            <p className="text-gray-600">LegalInsightAI helps legal teams reduce time spent on manual contract review, improve risk detection consistency, and provide clear remediation steps. By combining extraction, compliance checks, and research into a single workflow, teams can focus on higher-value legal judgment while routine analysis is automated.</p>
            <ul className="text-gray-600 mt-4 list-disc list-inside space-y-2">
              <li>Accelerate document review and reduce turnaround times.</li>
              <li>Standardize risk scoring and compliance checks across the team.</li>
              <li>Provide easy-to-share reports for stakeholders and clients.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Terms &amp; Conditions — Why we collect data</h3>
            <p className="text-gray-600">We process uploaded documents to provide analysis, extract terms, and generate reports. Documents and derived metadata are stored to enable features such as history, search, and analytics. Sensitive data is handled according to your deployment's data protection configuration. By using the service, you agree to the processing of documents for analysis purposes.</p>
            <p className="text-gray-600 mt-3"><strong>Retention:</strong> You may delete documents from the platform; systems may retain anonymized metadata for analytics unless explicitly disabled. For production deployments, configure retention policies and encryption at rest.</p>
          </div>
        </div>
      </section>

      <footer className="bg-white text-gray-600 py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2"><div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">⚖️</div><span className="text-gray-900 font-bold">LegalAI</span></div>
          <p className="text-sm">© 2026 LegalAI. AI-Powered Legal Document Analysis.</p>
          <div className="flex gap-6 text-sm"><a href="#" className="hover:text-gray-900">Privacy</a><a href="#" className="hover:text-gray-900">Terms</a></div>
        </div>
      </footer>
    </div>
  );
}
