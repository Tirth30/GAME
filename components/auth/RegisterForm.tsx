"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter(); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); const data = Object.fromEntries(new FormData(event.currentTarget)); const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const result = await response.json(); if (!response.ok) { setError(result.error); setLoading(false); return; } router.push("/dashboard"); router.refresh(); }
  return <form className="form-stack" onSubmit={submit}><label>Name<input name="name" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label><div className="form-grid"><label>Password<input name="password" type="password" autoComplete="new-password" minLength={8} required /></label><label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required /></label></div>{error && <p className="form-error">{error}</p>}<button className="primary-button" disabled={loading}>{loading ? "Creating account..." : "Create account"}<span>↗</span></button></form>;
}
