import Provider from "@/lib/Provider";
import "./globals.css";
import React from "react";
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <title>Your Target List</title>
      <meta name="description" content="Organize and track your tasks easily with our powerful todo list app. Add and manage daily, weekly, or monthly goals, and monitor your progress in real-time. Customize your workflow with Kanban and List views, and stay on top of your productivity. Perfect for personal use, project management, and team collaboration." />
      <link rel="icon" href="/favicon.ico" />
      <body
        className={`antialiased`}
      >
        <Provider>
          {children}
          <Toaster/>
        </Provider>
      </body>
    </html>
  );
}
