import "./globals.css";

export const metadata = {
  title: "Mimbar - AI Islamic Learning",
  description: "Learn Islam with AI. Ask, read, and listen.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0f172a", color: "white" }}>
        {children}
      </body>
    </html>
  );
}
