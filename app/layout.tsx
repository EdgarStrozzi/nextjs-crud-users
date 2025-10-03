import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users CRUD • Next.js + MongoDB",
  description: "Simple CRUD with Mongoose + Tailwind"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-white/10">
          <div className="container py-5 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Users CRUD</h1>
            <a
              className="btn-ghost"
              href="https://github.com/your-username/nextjs-crud-users"
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="container py-8 text-sm text-white/60">
          Built with Next.js 14, Tailwind, and MongoDB (Mongoose)
        </footer>
      </body>
    </html>
  );
}
