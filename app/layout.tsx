// app/layout.tsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "User CRUD",
  description: "Next.js CRUD Demo with MongoDB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-900 text-white">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 backdrop-blur bg-neutral-900/70 border-b border-white/10">
          <div className="max-w-5xl mx-auto flex items-center justify-between p-4">
            {/* Left: Title */}
            <h1 className="text-xl font-bold tracking-wide">
              User CRUD
            </h1>

            {/* GitHub + Add User */}
            <div className="flex gap-3">
              <a
                href="https://github.com/EdgarStrozzi/nextjs-crud-users"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                GitHub
              </a>
              <a href="#add-user-form" className="btn-primary">
                + Add User
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}