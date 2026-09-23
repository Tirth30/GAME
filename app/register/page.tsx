import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function RegisterPage() {
  return <main className="auth-shell"><header className="auth-topbar"><a className="brand" href="/register"><span className="brand-mark">af</span><span>Anonymous Feedback</span></a><ThemeToggle /></header><section className="auth-panel"><p className="eyebrow">Anonymous Feedback</p><h1>Start a better conversation.</h1><p className="muted">Create your private account to give and receive honest feedback.</p><RegisterForm /><p className="switch">Already have an account? <Link href="/login">Sign in</Link></p></section><aside className="auth-aside auth-aside-photo"><span>01</span><h2>Honesty is easier when kindness holds the microphone.</h2><p>Your identity never travels with your message.</p><div className="photo-credit">No awkward eye contact required.</div></aside></main>;
}
