import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: 42, marginBottom: 8 }}>🕌 Mimbar</h1>
      <p style={{ opacity: 0.8, fontSize: 18 }}>AI Islamic Learning — Ask, Read, Listen. Online & Offline.</p>
      <div style={{ marginTop: 32, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/try" style={{ background: "#22c55e", color: "black", padding: "14px 22px", borderRadius: 12, fontWeight: "bold", textDecoration: "none" }}>
          Try Mimbar AI →
        </Link>
      </div>
      <div style={{ marginTop: 40, textAlign: "left", background: "#1e293b", padding: 20, borderRadius: 16 }}>
        <h3>What you can do:</h3>
        <p>✅ Ask any Islamic question</p>
        <p>✅ Works ONLINE with AI</p>
        <p>✅ Works OFFLINE with built-in answers</p>
        <p>✅ Read Quran, Hadith, Seerah</p>
      </div>
    </main>
  );
}
