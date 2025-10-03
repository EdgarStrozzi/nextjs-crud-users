// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { ToastProvider } from "../components/Toast";

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
          <ToastProvider>
            <main className="max-w-5xl mx-auto p-6">{children}</main>
          </ToastProvider>
          <footer className="border-t border-white/10 mt-12">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between py-6 px-4 text-sm text-white/60">
              <p>
                Built with <span className="font-medium text-white">Next.js 14</span>, 
                <span className="font-medium text-white"> Tailwind CSS</span>, and 
                <span className="font-medium text-white"> MongoDB</span>.
              </p>
              <div className="flex gap-4 mt-3 md:mt-0">
                <a
                  href="https://github.com/EdgarStrozzi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="mailto:edgar22481@outlook.com"
                  className="hover:text-white transition-colors"
                >
                  Email
                </a>
                <a
                  href="https://www.linkedin.com/in/edgar-strozzi-057948329"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </footer>
      </body>
    </html>
  );
}