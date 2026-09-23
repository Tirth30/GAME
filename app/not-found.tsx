import Link from "next/link";
export default function NotFound() { return <main className="simple-page"><p className="eyebrow">404</p><h1>That page wandered off.</h1><Link className="text-link" href="/dashboard">Return to your workspace</Link></main>; }
