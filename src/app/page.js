"use client";

import { useState } from "react";
import TaskForm from "@/components/todo/TaskForm";
import TaskList from "@/components/todo/TaskList";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TEXTS } from "@/lib/texts";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <main className="min-h-screen p-6 max-w-2xl mx-auto">
      <header className="text-center mb-8 relative">
        <div className="absolute top-2 right-2">
          <ThemeToggle />
        </div>
        <h1 className="text-5xl font-black mb-2 title-gradient tracking-tight font-inter">
          {TEXTS.APP.TITLE}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium font-inter">
          {TEXTS.APP.DESCRIPTION}
        </p>
      </header>
      <TaskForm onCreated={handleTaskCreated} />
      <TaskList refreshKey={refreshKey} />
    </main>
  );
}
