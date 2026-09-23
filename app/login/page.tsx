import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function LoginPage() {
  return <main className="auth-shell"><header className="auth-topbar"><a className="brand" href="/login"><span className="brand-mark">af</span><span>Anonymous Feedback</span></a><ThemeToggle /></header><section className="auth-panel"><p className="eyebrow">A quieter kind of honesty</p><h1>Welcome back.</h1><p className="muted">Sign in to see the thoughtful feedback waiting for you.</p><LoginForm /><p className="switch">New here? <Link href="/register">Create an account</Link></p></section><aside className="auth-aside auth-aside-photo"><span>01</span><h2>Sometimes the kindest sentence is the honest one.</h2><p>Feedback stays anonymous, focused and private.</p><div className="photo-credit">Good conversations start small.</div></aside></main>;
}
