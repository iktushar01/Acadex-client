import { Shield, Lock, Eye, Share2, UserCheck, RefreshCcw, Mail, Clock } from "lucide-react";

const PrivacyPolicyPage = () => {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden bg-orange-500/5 py-16 md:py-24 border-b border-border/50">
        <div className="container max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-wider mb-6">
            <Shield className="h-3.5 w-3.5" />
            Trust & Safety
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Privacy Policy
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground font-medium">
            <Clock className="h-4 w-4" />
            Last updated: {lastUpdated}
          </div>
        </div>
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 h-96 w-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-4xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-12">
          
          {/* --- MAIN CONTENT --- */}
          <div className="space-y-12">
            <section className="prose prose-orange dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Welcome to <span className="font-bold text-foreground underline decoration-orange-500/30 decoration-2 underline-offset-4">Acadex</span>. 
                Your privacy is our priority. This policy outlines how we handle your data with transparency 
                and high-level security as you use our smart note-sharing platform.
              </p>
            </section>

            {/* 1. Information We Collect */}
            <section id="collect" className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Eye className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">1. Information We Collect</h2>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <ul className="grid gap-4 list-none p-0">
                  {[
                    { title: "Account Data", desc: "Name, email, and profile preferences." },
                    { title: "Academic Content", desc: "Uploaded notes, classroom files, and resources." },
                    { title: "Usage Insights", desc: "Metadata on how you interact with our tools." }
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                      <div>
                        <span className="font-bold block">{item.title}</span>
                        <span className="text-muted-foreground text-sm">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 2. Usage */}
            <section id="usage">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
                  <RefreshCcw className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">2. How We Use Data</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-11">
                We use your information to personalize your learning experience, facilitate 
                classroom management, and ensure seamless synchronization of your notes 
                across all your devices.
              </p>
            </section>

            {/* 3. Security */}
            <section id="security">
              <div className="bg-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="h-6 w-6" />
                    <h2 className="text-2xl font-bold">3. Data Security</h2>
                  </div>
                  <p className="text-orange-50 leading-relaxed">
                    We implement modern industry-standard encryption to protect your data. 
                    From SSL certificates to secure database practices, we treat your 
                    academic work as sensitive assets.
                  </p>
                </div>
                <Shield className="absolute -bottom-10 -right-10 h-40 w-40 text-white/10 rotate-12" />
              </div>
            </section>

            {/* 4. Rights & Contact */}
            <section id="rights" className="grid sm:grid-cols-2 gap-6">
               <div className="p-6 border border-border rounded-2xl">
                  <div className="flex items-center gap-2 mb-3 text-orange-600">
                    <UserCheck className="h-5 w-5" />
                    <h3 className="font-bold">Your Rights</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You have full control. Request a data export or account deletion anytime 
                    through your settings dashboard.
                  </p>
               </div>
               <div className="p-6 border border-border rounded-2xl bg-muted/30">
                  <div className="flex items-center gap-2 mb-3 text-orange-600">
                    <Mail className="h-5 w-5" />
                    <h3 className="font-bold">Contact Us</h3>
                  </div>
                  <p className="text-sm font-medium">support@acadex.com</p>
                  <p className="text-xs text-muted-foreground mt-1">24/7 Academic Support</p>
               </div>
            </section>
          </div>

          {/* --- SIDE NAVIGATION (Visible on Desktop) --- */}
          <aside className="hidden md:block sticky top-28 self-start space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">
              On this page
            </h4>
            <nav className="flex flex-col gap-1">
              {['Collection', 'Usage', 'Security', 'Rights'].map((nav) => (
                <a
                  key={nav}
                  href={`#${nav.toLowerCase()}`}
                  className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-orange-500/5 hover:text-orange-600 transition-colors"
                >
                  {nav}
                </a>
              ))}
            </nav>
          </aside>
          
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;