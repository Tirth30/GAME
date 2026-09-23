"use client";

import { useEffect, useState } from "react";

const quotes = [
  { text: "Feedback is just a high-five wearing sensible shoes.", source: "Tiny wisdom" },
  { text: "Say the useful thing. Future-you will be weirdly grateful.", source: "A note from future-you" },
  { text: "Kind honesty: less awkward than guessing, more helpful than nodding.", source: "The office oracle" },
  { text: "Every great teammate has room to grow and at least one excellent snack opinion.", source: "Probably true" },
];

export function QuoteCard({ compact = false }: { compact?: boolean }) {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <aside className={`quote-card${compact ? " quote-card-compact" : ""}`}>
      <span className="quote-mark">“</span>
      <p>{quote.text}</p>
      <small>{quote.source} <span aria-hidden="true">✦</span></small>
    </aside>
  );
}
