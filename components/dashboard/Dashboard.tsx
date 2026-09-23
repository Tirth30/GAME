"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { MyFeedback } from "./MyFeedback";
import { GiveFeedback } from "./GiveFeedback";
import { QuoteCard } from "@/components/shared/QuoteCard";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

type SafeUser = Omit<User, "passwordHash">;
export function Dashboard({ user }: { user: SafeUser }) {
  const router = useRouter(); const [tab, setTab] = useState<"mine" | "give">("mine");
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); router.refresh(); }
  return <main className="dashboard-shell"><header className="topbar"><a className="brand" href="/dashboard"><span className="brand-mark">af</span><span>Anonymous Feedback</span></a><div className="account"><span className="user-name">{user.name.split(" ")[0]}</span><ThemeToggle /><button className="logout-button" onClick={logout}>Log out</button></div></header><section className="dashboard-content"><div className="intro"><div><p className="eyebrow">Private workspace</p><h1>A little clarity goes a long way.</h1></div><div className="intro-side"><p className="intro-note">Thoughtful notes, shared without the awkwardness.</p><QuoteCard /></div></div><nav className="tabs" aria-label="Feedback sections"><button className={tab === "mine" ? "active" : ""} onClick={() => setTab("mine")}>My Feedback</button><button className={tab === "give" ? "active" : ""} onClick={() => setTab("give")}>Give Feedback</button></nav>{tab === "mine" ? <MyFeedback /> : <GiveFeedback />}</section></main>;
}
