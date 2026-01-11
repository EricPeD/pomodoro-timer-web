"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ======================================================
   CONFIGURACIÓN
====================================================== */

const INITIAL_DURATIONS = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const MODE_COLORS = {
  work: "#2e7d32",
  short: "#0288d1",
  long: "#6a1b9a",
};

/* ======================================================
   UTILIDADES
====================================================== */

function formatTimeHMS(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

/* ======================================================
   APP
====================================================== */

export default function PomodoroApp() {
  /* ---------------- TIMER ---------------- */

  const [mode, setMode] = useState("work");
  const [durations, setDurations] = useState(INITIAL_DURATIONS);
  const [secondsLeft, setSecondsLeft] = useState(
    INITIAL_DURATIONS.work
  );
  const [isRunning, setIsRunning] = useState(false);

  /* ---------------- LAYOUT ---------------- */

  const [layout, setLayout] = useState("right");

  /* ---------------- THEME ---------------- */

  const [darkMode, setDarkMode] = useState(false);

  /* ---------------- TASKS ---------------- */

  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");

  /* ---------------- REFS ---------------- */

  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const inputRef = useRef(null);

  /* ======================================================
     EFECTOS
  ====================================================== */

  useEffect(() => {
    audioRef.current = new Audio("/bell.mp3");
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleCycleEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(durations[mode]);
    }
  }, [durations, mode, isRunning]);

  /* ======================================================
     CICLOS
  ====================================================== */

  function handleCycleEnd() {
    setIsRunning(false);
    audioRef.current && audioRef.current.play();
    setTimeout(
      () => setMode((m) => (m === "work" ? "short" : "work")),
      300
    );
  }

  /* ======================================================
     CONTROLES TIMER
  ====================================================== */

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(durations[mode]);
  };

  /* ======================================================
     TASKS
  ====================================================== */

  function addTask() {
    const text = newTaskText.trim();
    if (!text) return;

    setTasks((prev) => [
      ...prev,
      {
        id: generateId(),
        text,
        completed: false,
        createdAt: Date.now(),
      },
    ]);

    setNewTaskText("");
    inputRef.current?.focus();
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  /* ======================================================
     PROGRESO
  ====================================================== */

  const progress = useMemo(
    () => 1 - secondsLeft / durations[mode],
    [secondsLeft, durations, mode]
  );

  /* ======================================================
     TIMER UI
  ====================================================== */

  function TimerSection() {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;

    return (
      <div className="flex flex-col items-center gap-12">
        <div
          className="relative w-[460px] h-[460px] rounded-full flex items-center justify-center border-[14px]"
          style={{ borderColor: MODE_COLORS[mode] }}
        >
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={MODE_COLORS[mode]}
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={
                circumference * (1 - progress)
              }
              strokeLinecap="round"
            />
          </svg>

          <div
            className="text-[6rem] font-extralight tracking-[0.15em]"
            style={{ color: MODE_COLORS[mode] }}
          >
            {formatTimeHMS(secondsLeft)}
          </div>
        </div>

        <div className="flex gap-6">
          <button
            onClick={resetTimer}
            className="px-8 py-3 rounded-full border"
          >
            Reset
          </button>

          {!isRunning ? (
            <button
              onClick={startTimer}
              className="px-10 py-3 rounded-full text-white"
              style={{ background: MODE_COLORS[mode] }}
            >
              Start
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="px-10 py-3 rounded-full text-white"
              style={{ background: MODE_COLORS[mode] }}
            >
              Pause
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ======================================================
     TASKS UI
  ====================================================== */

  function TasksSection() {
    return (
      <div className="w-full max-w-sm mx-auto">
        <h2 className="mb-4 text-sm uppercase tracking-widest opacity-60">
          Tasks
        </h2>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex justify-between items-center px-4 py-3 rounded-xl border ${
                task.completed
                  ? "opacity-60 line-through"
                  : ""
              }`}
            >
              <div
                className="flex gap-3 items-center cursor-pointer"
                onClick={() => toggleTask(task.id)}
              >
                <div className="w-5 h-5 border rounded flex items-center justify-center">
                  {task.completed && "✓"}
                </div>
                <span>{task.text}</span>
              </div>

              <button onClick={() => deleteTask(task.id)}>
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            ref={inputRef}
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Nueva tarea..."
            className="flex-1 px-4 py-2 rounded border outline-none"
          />
          <button
            onClick={addTask}
            disabled={!newTaskText.trim()}
            className="px-4 rounded bg-black text-white disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>
    );
  }

  /* ======================================================
     LAYOUT
  ====================================================== */

  const isColumn = layout === "column";

  const contentClass = isColumn
    ? "flex flex-col gap-20 items-center"
    : "grid md:grid-cols-2 gap-20 items-center";

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <main
      className={`min-h-screen transition-colors ${
        darkMode
          ? "bg-[#0f0f0f] text-white"
          : "bg-[#fafafa] text-black"
      }`}
    >
      {/* TOP BAR */}
      <div className="w-full flex justify-end pt-6 pr-8">
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="text-xl"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="flex justify-center p-8">
        <div className="max-w-6xl w-full flex flex-col items-center gap-20">
          {/* DURATIONS */}
          <div className="grid grid-cols-3 gap-16">
            {Object.keys(durations).map((key) => (
              <div key={key} className="text-center">
                <input
                  type="number"
                  min="1"
                  value={Math.floor(durations[key] / 60)}
                  onChange={(e) =>
                    setDurations((d) => ({
                      ...d,
                      [key]: Number(e.target.value) * 60,
                    }))
                  }
                  className="w-24 text-4xl text-center bg-transparent border-b outline-none"
                />
                <div className="text-xs uppercase opacity-60 mt-2">
                  {key}
                </div>
              </div>
            ))}
          </div>

          {/* MAIN */}
          <div className={`w-full ${contentClass}`}>
            {(layout === "left" || isColumn) && <TasksSection />}
            <TimerSection />
            {layout === "right" && !isColumn && <TasksSection />}
          </div>

          {/* LAYOUT SELECTOR BOTTOM */}
          <div className="flex gap-10 mt-10">
            {["right", "left", "column"].map((l) => (
              <button
                key={l}
                onClick={() => setLayout(l)}
                className={`uppercase text-sm tracking-widest ${
                  layout === l ? "opacity-100" : "opacity-40"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
