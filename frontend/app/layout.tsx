import Provider from "@/lib/Provider";
import "./globals.css";
import React from "react";
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head>
        <title>AI Kanban Todo Board – Automatic Workspace Generation & Productivity</title>
        <meta name="description" content="Boost your productivity with our AI-powered Kanban Todo Board. Automatically generate workspaces, organize and track your tasks, and manage goals with advanced AI features. Perfect for personal, project, and team management." />
        <meta name="keywords" content="AI Kanban, Todo Board, Automatic Workspace Generation, Task Management, Productivity, Project Management, Team Collaboration, Artificial Intelligence, Workflow Automation, Goal Tracking" />
        <meta name="author" content="Purushotam Jeswani" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://kanbantodo.purushotamjeswani.in/" />
        <meta name="google-site-verification" content="Hyq7_rXCrzF3ib_AhDf781L1pYQmFT7oZilFhKZVWCY" />
        <link rel="icon" href="/favicon.ico" />
        {/* Open Graph tags */}
        <meta property="og:title" content="AI Kanban Todo Board – Automatic Workspace Generation & Productivity" />
        <meta property="og:description" content="Experience next-level productivity with AI-powered automatic workspace generation. Organize, track, and manage your tasks and goals efficiently." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kanbantodo.purushotamjeswani.in/" />
        <meta property="og:image" content="https://kanbantodo.purushotamjeswani.in/og-image.png" />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Kanban Todo Board – Automatic Workspace Generation" />
        <meta name="twitter:description" content="Boost productivity with AI-powered Kanban board and automatic workspace generation." />
        <meta name="twitter:image" content="https://kanbantodo.purushotamjeswani.in/og-image.png" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
        {/* Structured Data for Rich Results */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "AI Kanban Todo Board",
            "url": "https://kanbantodo.purushotamjeswani.in/",
            "description": "AI-powered Kanban Todo Board with automatic workspace generation for efficient task and project management.",
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "All",
            "author": {
              "@type": "Person",
              "name": "Purushotam Jeswani"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "AI-powered workspace generation",
              "Kanban and List views",
              "Task and goal tracking",
              "Real-time collaboration",
              "Customizable workflows"
            ]
          })
        }} />
      </head>
      <body
        className={`antialiased`}
      >
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
