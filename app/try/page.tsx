"use client";
import { useState } from "react";

const OFFLINE: Record<string, string> = {
  "salah": "Salah is the 5 daily prayers: Fajr (2 rakahs), Dhuhr (4), Asr (4), Maghrib (3), Isha (4). Pray facing the Qibla, with wudu, starting with Takbir - Allahu Akbar.",
  "wudu": "Wudu steps: 1) Intention 2) Wash hands 3x 3) Rinse mouth 3x 4) Nose 3x 5) Face 3x 6) Arms to elbows 3x 7) Wipe head 8) Ears 9) Feet to ankles 3x.",
  "fasting": "Fasting in Ramadan: No food, drink, or intimacy from Fajr (dawn) to Maghrib (sunset). Suhoor before dawn, Iftar at sunset. Exemptions for sick, traveller, pregnant, etc.",
  "quran": "The Quran has 114 Surahs. First Surah is Al-Fatiha. Longest is Al-Baqarah. Start reading with Bismillah. Read with Tajweed and reflection.",
  "prophet": "Prophet Muhammad (peace be upon him) was born in Makkah in 570 CE. He received revelation at age 40 in Cave Hira. He migrated to Madinah in 622 CE.",
  "zakat": "Zakat is 2.5% of savings held for 1 lunar year above Nisab. It is given to the poor, needy, and other categories in Surah Tawbah 9:60.",
  "hajj": "Hajj is the pilgrimage to Makkah in Dhul-Hijjah. Pillars: Ihram, Arafah, Tawaf, Sa'i, Mina, Muzdalifah. It is obligatory once for those who can afford it.",
};

function offlineAnswer(q: string) {
  const lower = q.toLowerCase();
  for (const key in OFFLINE) {
    if (lower.includes(key)) return OFFLINE[key];
  }
  if (lower.includes("pray")) return OFFLINE["salah"];
  if (lower.includes("ablution")) return OFFLINE["wudu"];
  if (lower.includes("ramadan")) return OFFLINE["fasting"];
  return "Offline Mode: I have built-in answers for Salah, Wudu, Fasting, Quran, Prophet, Zakat, Hajj. Try one of those words. When you are online, I will try to search for more.";
}

export default function Try() {
  const [q, setQ] = useState("");
  const [ans, setAns] = useState("");
  const [mode, setMode] = useState("Ready");
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (!q.trim()) return;
    setLoading(true);
    const online = typeof navigator !== "undefined" ? navigator.onLine : true;
    if (!online) {
      setMode("🔴 OFFLINE - Built-in Answer");
      setAns(offlineAnswer(q));
      setLoading(false);
      return;
    }
    try {
      setMode("🟢 ONLINE - Searching...");
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.extract) {
          setAns(data.extract + "\n\n(Source: Wikipedia - Online)");
          setLoading(false);
          return;
        }
      }
      throw new Error("no result");
    } catch {
      setMode("🟡 ONLINE failed - Using OFFLINE");
      setAns(offlineAnswer(q));
    }
    setLoading(false);
  }

  return (
    <main style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <a href="/" style={{ opacity: 0.7 }}>← Back</a>
      <h1 style={{ fontSize: 32 }}>🕌 Mimbar AI</h1>
      <p style={{ background: "#1e293b", padding: 10, borderRadius: 10 }}>{mode}</p>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="Ask: How do I pray? What is Zakat?" style={{ flex: 1, padding: 14, borderRadius: 12, border: "none", fontSize: 16 }} />
        <button onClick={ask} style={{ background: "#22c55e", border: "none", padding: "0 20px", borderRadius: 12, fontWeight: "bold" }}>{loading ? "..." : "Ask"}</button>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
        {["How do I pray Salah?", "What is Wudu?", "What is Zakat?", "Who is Prophet Muhammad?"].map((s) => (
          <button key={s} onClick={() => { setQ(s); }} style={{ background: "#334155", color: "white", border: "none", padding: "8px 12px", borderRadius: 20 }}>{s}</button>
        ))}
      </div>
      {ans && <div style={{ marginTop: 20, background: "#1e293b", padding: 20, borderRadius: 16, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{ans}</div>}
      <p style={{ opacity: 0.6, fontSize: 13, marginTop: 20 }}>Works ONLINE with search + OFFLINE with built-in answers. No credits needed.</p>
    </main>
  );
}
