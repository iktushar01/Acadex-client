"use client";

import React, { useState } from "react";
import {
  Terminal,
  Database,
  Server,
  Layout,
  Copy,
  Check,
  ExternalLink,
  Code2,
  AlertCircle,
  GitBranch,
  Zap,
  Shield,
  Mail,
  Cloud,
  Key,
  ChevronDown,
  ChevronUp,
  Globe,
  MessageSquare,
  Bot,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

const CopyButton = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copied!`, {
      description: "Paste it into your .env file and fill in your own values.",
      duration: 2500,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
        bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground border border-border"
    >
      {copied ? (
        <><Check className="size-3 text-primary" /> Copied</>
      ) : (
        <><Copy className="size-3" /> Copy</>
      )}
    </button>
  );
};

const CodeBlock = ({ code, label, lang = "bash" }: { code: string; label: string; lang?: string }) => (
  <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm">
    <div className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-muted/50">
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-destructive/40" />
        <span className="size-2.5 rounded-full bg-primary/40" />
        <span className="size-2.5 rounded-full bg-primary/70" />
        <span className="ml-3 text-xs font-mono text-muted-foreground">{lang}</span>
      </div>
      <CopyButton text={code} label={label} />
    </div>
    <pre className="px-5 py-4 overflow-x-auto text-sm font-mono leading-relaxed text-foreground">
      <code>{code}</code>
    </pre>
  </div>
);

type EnvVar = { key: string; value: string; comment?: string };

const EnvLine = ({ v }: { v: EnvVar }) => {
  const isPlaceholder = v.value.startsWith("your_") || v.value.includes("your_") || v.value === "";
  return (
    <div>
      <span className="text-primary font-semibold">{v.key}</span>
      <span className="text-muted-foreground">=</span>
      <span className={isPlaceholder ? "text-muted-foreground italic" : "text-foreground/80"}>
        {v.value}
      </span>
    </div>
  );
};

const EnvBlock = ({ vars, label }: { vars: EnvVar[]; label: string }) => {
  const fullText = vars
    .map((v) => (v.comment ? `\n# ${v.comment}\n${v.key}=${v.value}` : `${v.key}=${v.value}`))
    .join("\n")
    .trim();

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-destructive/40" />
          <span className="size-2.5 rounded-full bg-primary/40" />
          <span className="size-2.5 rounded-full bg-primary/70" />
          <span className="ml-3 text-xs font-mono text-muted-foreground">.env</span>
        </div>
        <CopyButton text={fullText} label={label} />
      </div>
      <div className="px-5 py-4 overflow-x-auto font-mono text-xs leading-7 max-h-72 overflow-y-auto">
        {vars.map((v, i) =>
          v.comment ? (
            <React.Fragment key={i}>
              {i !== 0 && <div className="h-1.5" />}
              <div className="text-muted-foreground/60"># {v.comment}</div>
              <EnvLine v={v} />
            </React.Fragment>
          ) : (
            <EnvLine key={i} v={v} />
          )
        )}
      </div>
    </div>
  );
};

const EnvGroupAccordion = ({
  icon, title, vars, label,
}: {
  icon: React.ReactNode;
  title: string;
  vars: EnvVar[];
  label: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-card hover:bg-muted/60 transition-colors"
      >
        <div className="flex items-center gap-3 font-semibold text-foreground text-sm">
          <span className="text-primary">{icon}</span>
          {title}
        </div>
        {open
          ? <ChevronUp className="size-4 text-muted-foreground" />
          : <ChevronDown className="size-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="p-4 border-t border-border bg-muted/20">
          <EnvBlock vars={vars} label={label} />
        </div>
      )}
    </div>
  );
};

const StepBadge = ({ n }: { n: number }) => (
  <div className="shrink-0 size-8 rounded-xl flex items-center justify-center text-sm font-black bg-primary/10 text-primary border border-primary/20">
    {n}
  </div>
);

const SectionHeader = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">{icon}</div>
    <div>
      <h2 className="text-2xl font-black tracking-tight text-foreground">{title}</h2>
      <p className="text-muted-foreground text-sm mt-0.5">{sub}</p>
    </div>
  </div>
);

function CopyAllBackendEnv({ groups }: { groups: { vars: EnvVar[]; title: string }[] }) {
  const [copied, setCopied] = useState(false);
  const fullText = groups
    .map((g) =>
      g.vars
        .map((v) => (v.comment ? `\n# ${v.comment}\n${v.key}=${v.value}` : `${v.key}=${v.value}`))
        .join("\n")
        .trim()
    )
    .join("\n\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success("Full backend .env copied!", {
      description: "Fill in your own values before running the server.",
      duration: 2500,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all
        bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40"
    >
      {copied
        ? <><Check className="size-4" /> All Variables Copied!</>
        : <><Copy className="size-4" /> Copy Full Backend .env</>}
    </button>
  );
}

export default function DevelopersPage() {
  const clientRepo = "https://github.com/iktushar01/Acadex-client.git";
  const serverRepo = "https://github.com/iktushar01/Acadex-server.git";
  const liveClient = "https://acadex-client.vercel.app";
  const liveApi = "https://acadex-server.vercel.app/api/v1";

  const cloneClientCmd = `git clone ${clientRepo}\ncd Acadex-client\npnpm install\npnpm dev`;
  const cloneServerCmd = `git clone ${serverRepo}\ncd Acadex-server\npnpm install\npnpm exec prisma generate\npnpm exec prisma db push\npnpm dev`;

  const frontendEnvVars: EnvVar[] = [
    { key: "NEXT_PUBLIC_API_BASE_URL", value: "http://localhost:5000/api/v1", comment: "Backend API base URL" },
    { key: "NEXT_PUBLIC_BASE_URL", value: "http://localhost:3000", comment: "Frontend origin" },
    { key: "ACCESS_TOKEN_SECRET", value: "your_access_token_secret", comment: "Must match server ACCESS_TOKEN_SECRET" },
    { key: "NEXT_PUBLIC_PUSHER_KEY", value: "your_pusher_key", comment: "Real-time classroom chat (optional locally)" },
    { key: "NEXT_PUBLIC_PUSHER_CLUSTER", value: "ap2" },
  ];

  const backendEnvGroups: { icon: React.ReactNode; title: string; label: string; vars: EnvVar[] }[] = [
    {
      icon: <Server className="size-4" />,
      title: "Server",
      label: "Server ENV",
      vars: [
        { key: "PORT", value: "5000", comment: "Server" },
        { key: "NODE_ENV", value: "development" },
        { key: "FRONTEND_URL", value: "http://localhost:3000" },
      ],
    },
    {
      icon: <Database className="size-4" />,
      title: "Database (Neon PostgreSQL)",
      label: "Database ENV",
      vars: [
        { key: "DATABASE_URL", value: "your_neon_pooler_url", comment: "Use Neon pooled URL (-pooler) on Vercel" },
      ],
    },
    {
      icon: <Shield className="size-4" />,
      title: "Authentication (Better Auth + JWT)",
      label: "Auth ENV",
      vars: [
        { key: "BETTER_AUTH_SECRET", value: "your_better_auth_secret", comment: "Better Auth" },
        { key: "BETTER_AUTH_URL", value: "http://localhost:5000" },
        { key: "ACCESS_TOKEN_SECRET", value: "your_access_token_secret", comment: "JWT" },
        { key: "REFRESH_TOKEN_SECRET", value: "your_refresh_token_secret" },
        { key: "ACCESS_TOKEN_EXPIRES_IN", value: "1d" },
        { key: "REFRESH_TOKEN_EXPIRES_IN", value: "7d" },
        { key: "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN", value: "1d" },
        { key: "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE", value: "1d" },
        { key: "EXPIRE_OTP_TIME", value: "15m" },
      ],
    },
    {
      icon: <Mail className="size-4" />,
      title: "Email (Gmail SMTP)",
      label: "Email ENV",
      vars: [
        { key: "EMAIL_HOST", value: "smtp.gmail.com", comment: "Email" },
        { key: "EMAIL_PORT", value: "587" },
        { key: "EMAIL_SECURE", value: "false" },
        { key: "EMAIL_USER", value: "your_email@gmail.com" },
        { key: "EMAIL_PASSWORD", value: "your_email_app_password" },
        { key: "EMAIL_FROM", value: '"Acadex <your_email@gmail.com>"' },
      ],
    },
    {
      icon: <Globe className="size-4" />,
      title: "Google OAuth",
      label: "Google OAuth ENV",
      vars: [
        { key: "GOOGLE_CLIENT_ID", value: "your_google_client_id", comment: "Google OAuth" },
        { key: "GOOGLE_CLIENT_SECRET", value: "your_google_client_secret" },
        { key: "GOOGLE_CALLBACK_URL", value: "http://localhost:5000/api/auth/callback/google" },
      ],
    },
    {
      icon: <Cloud className="size-4" />,
      title: "Storage (Cloudinary & ImgBB)",
      label: "Storage ENV",
      vars: [
        { key: "CLOUDINARY_CLOUD_NAME", value: "your_cloudinary_cloud_name", comment: "Cloudinary" },
        { key: "CLOUDINARY_API_KEY", value: "your_cloudinary_api_key" },
        { key: "CLOUDINARY_API_SECRET", value: "your_cloudinary_api_secret" },
        { key: "IMGBB_API_KEY", value: "your_imgbb_api_key", comment: "ImgBB" },
      ],
    },
    {
      icon: <MessageSquare className="size-4" />,
      title: "Real-time Chat (Pusher)",
      label: "Pusher ENV",
      vars: [
        { key: "PUSHER_APP_ID", value: "your_pusher_app_id", comment: "Pusher" },
        { key: "PUSHER_KEY", value: "your_pusher_key" },
        { key: "PUSHER_SECRET", value: "your_pusher_secret" },
        { key: "PUSHER_CLUSTER", value: "ap2" },
      ],
    },
    {
      icon: <Bot className="size-4" />,
      title: "Study Assistant (OpenRouter + pgvector)",
      label: "Chatbot ENV",
      vars: [
        { key: "OPENROUTER_API_KEY", value: "your_openrouter_api_key", comment: "AI assistant" },
        { key: "OPENROUTER_BASE_URL", value: "https://openrouter.ai/api/v1" },
        { key: "OPENROUTER_EMBEDDING_MODEL", value: "nvidia/llama-nemotron-embed-vl-1b-v2:free" },
        { key: "OPENROUTER_LLM_MODEL", value: "nvidia/nemotron-3-super-120b-a12b:free" },
        { key: "CHATBOT_EMBEDDING_DIMENSION", value: "2048" },
        { key: "CHATBOT_TOP_K", value: "8" },
        { key: "CHATBOT_RATE_LIMIT_MAX", value: "25" },
      ],
    },
    {
      icon: <CreditCard className="size-4" />,
      title: "Support Payments (Stripe)",
      label: "Stripe ENV",
      vars: [
        { key: "STRIPE_SECRET_KEY", value: "sk_test_your_stripe_secret_key", comment: "Optional — support page" },
        { key: "STRIPE_WEBHOOK_SECRET", value: "whsec_your_stripe_webhook_secret" },
      ],
    },
  ];

  const techBadges = [
    "Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "Shadcn UI",
    "Express 5", "Prisma 7", "PostgreSQL", "pgvector", "Better Auth",
    "Pusher", "OpenRouter", "Cloudinary", "Stripe",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">

      <div className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.9 0.02 85) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-20 right-1/3 size-[480px] rounded-full bg-primary/6 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            <Code2 className="size-3" /> Open Source · MIT License
          </div>

          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none mb-5">
            Build with <span className="text-primary">Acadex</span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed mb-8">
            A full-stack classroom platform for note sharing, live group chat, CR-led moderation,
            and an AI study assistant grounded in your class materials. Clone both repos, configure
            your environment, and run locally — or explore the live deployment.
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {techBadges.map((b) => (
              <span key={b} className="px-3 py-1 rounded-full text-xs font-semibold border border-border bg-muted text-muted-foreground">
                {b}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <a href={clientRepo} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm transition-all hover:opacity-90 shadow-md">
              <Layout className="size-4" /> Client Repo <ExternalLink className="size-3 opacity-70" />
            </a>
            <a href={serverRepo} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-secondary text-secondary-foreground font-bold text-sm transition-all hover:bg-muted border border-border">
              <Server className="size-4" /> Server Repo <ExternalLink className="size-3 opacity-70" />
            </a>
            <a href={liveClient} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border font-bold text-sm transition-all hover:border-primary/40">
              <Globe className="size-4" /> Live App <ExternalLink className="size-3 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 space-y-20">

        <section>
          <SectionHeader
            icon={<Layout className="size-5" />}
            title="Frontend Setup"
            sub="Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Shadcn UI"
          />
          <div className="space-y-7">

            <div className="flex gap-4 items-start">
              <StepBadge n={1} />
              <div className="flex-1 space-y-3">
                <p className="font-bold text-foreground flex items-center gap-2 text-sm">
                  <Terminal className="size-4 text-primary" /> Clone & Install
                </p>
                <CodeBlock code={cloneClientCmd} label="Frontend Clone Command" />
                <p className="text-xs text-muted-foreground">
                  Requires Node.js 20+. <code className="font-mono">npm install</code> works if you prefer npm over pnpm.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <StepBadge n={2} />
              <div className="flex-1 space-y-3">
                <p className="font-bold text-foreground flex items-center gap-2 text-sm">
                  <AlertCircle className="size-4 text-primary" /> Create{" "}
                  <code className="px-1.5 py-0.5 rounded bg-muted text-primary text-xs font-mono border border-border">.env.local</code>
                </p>
                <EnvBlock vars={frontendEnvVars} label="Frontend .env.local" />
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <StepBadge n={3} />
              <div className="flex-1 space-y-3">
                <p className="font-bold text-foreground flex items-center gap-2 text-sm">
                  <Zap className="size-4 text-primary" /> Run Dev Server
                </p>
                <CodeBlock code="pnpm dev" label="Frontend Dev" />
                <p className="text-xs text-muted-foreground">
                  App running at <span className="text-primary font-mono">http://localhost:3000</span>
                </p>
              </div>
            </div>

          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <SectionHeader
            icon={<Database className="size-5" />}
            title="Backend Setup"
            sub="Express 5 · Prisma 7 · PostgreSQL (Neon) · Better Auth · Pusher · pgvector"
          />
          <div className="space-y-7">

            <div className="flex gap-4 items-start">
              <StepBadge n={1} />
              <div className="flex-1 space-y-3">
                <p className="font-bold text-foreground flex items-center gap-2 text-sm">
                  <GitBranch className="size-4 text-primary" /> Clone, Install & Generate Prisma Client
                </p>
                <CodeBlock code={cloneServerCmd} label="Server Clone Command" />
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <StepBadge n={2} />
              <div className="flex-1 space-y-3">
                <p className="font-bold text-foreground flex items-center gap-2 text-sm">
                  <Key className="size-4 text-primary" /> Configure{" "}
                  <code className="px-1.5 py-0.5 rounded bg-muted text-primary text-xs font-mono border border-border">.env</code>
                  <span className="text-muted-foreground font-normal">— expand each group to copy</span>
                </p>

                <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
                  <AlertCircle className="size-4 text-primary mt-0.5 shrink-0" />
                  <span>
                    Values shown as <span className="font-mono text-primary/80 italic">your_*</span> are placeholders.
                    Pusher and OpenRouter are required for group chat and the study assistant.
                    On Vercel, use Neon&apos;s <span className="font-mono">-pooler</span> connection string and deploy both repos to the <span className="font-mono">sin1</span> region for best latency with ap-southeast-1 databases.
                  </span>
                </div>

                <div className="space-y-2">
                  {backendEnvGroups.map((g) => (
                    <EnvGroupAccordion key={g.title} {...g} />
                  ))}
                </div>
                <CopyAllBackendEnv groups={backendEnvGroups} />
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <StepBadge n={3} />
              <div className="flex-1 space-y-3">
                <p className="font-bold text-foreground flex items-center gap-2 text-sm">
                  <Zap className="size-4 text-primary" /> Start the Server
                </p>
                <CodeBlock code="pnpm dev" label="Backend Dev" />
                <p className="text-xs text-muted-foreground">
                  API available at <span className="text-primary font-mono">http://localhost:5000/api/v1</span>
                </p>
              </div>
            </div>

          </div>
        </section>

        <div className="border-t border-border" />

        <section>
          <h3 className="text-xl font-black mb-5 text-foreground">Quick Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <Globe className="size-4" />, title: "Local Frontend", value: "http://localhost:3000" },
              { icon: <Server className="size-4" />, title: "Local Backend", value: "http://localhost:5000" },
              { icon: <Database className="size-4" />, title: "API Base", value: "/api/v1" },
              { icon: <Globe className="size-4" />, title: "Live Frontend", value: "acadex-client.vercel.app" },
              { icon: <Server className="size-4" />, title: "Live API", value: "acadex-server.vercel.app/api/v1" },
              { icon: <MessageSquare className="size-4" />, title: "Key Features", value: "Notes · Chat · AI · Tools" },
            ].map((item) => (
              <div key={item.title}
                className="rounded-xl border border-border bg-card p-5 flex items-center gap-4 hover:border-primary/40 hover:bg-accent transition-colors">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">{item.icon}</div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wide">{item.title}</p>
                  <code className="text-sm font-mono text-foreground break-all">{item.value}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-muted/30 p-6">
          <h3 className="text-lg font-black mb-3 text-foreground">Architecture at a glance</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong className="text-foreground">Auth:</strong> Better Auth + JWT in httpOnly cookies on the client domain; browser calls use a token bridge (<code className="font-mono text-xs">/api/auth/token</code>) for direct API access.</li>
            <li>• <strong className="text-foreground">Notes:</strong> Upload → CR approval → classroom visibility with folders, subjects, comments, and favorites.</li>
            <li>• <strong className="text-foreground">Chat:</strong> Membership-gated group messages via REST + Pusher real-time events.</li>
            <li>• <strong className="text-foreground">Study assistant:</strong> RAG over indexed note chunks using pgvector embeddings and OpenRouter models.</li>
            <li>• <strong className="text-foreground">Docs:</strong> See <code className="font-mono text-xs">DOCUMENTATION.md</code> in each repo for full product and API details.</li>
          </ul>
        </section>

        <footer className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            Licensed under <span className="text-primary font-bold">MIT</span>. Fork it. Ship it. Own it.
          </p>
          <div className="flex gap-6">
            <a href={clientRepo} target="_blank" rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-semibold">
              Client Repo <ExternalLink className="size-3" />
            </a>
            <a href={serverRepo} target="_blank" rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 font-semibold">
              Server Repo <ExternalLink className="size-3" />
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
}
