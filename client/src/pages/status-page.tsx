import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

function usePerformanceMetrics() {
  const [fps, setFps] = useState(0);
  const [cpuLoadSim, setCpuLoadSim] = useState(0);
  const last = useRef<number | null>(null);
  const frames = useRef(0);

  useEffect(() => {
    let rafId: number;
    const loop = (ts: number) => {
      frames.current += 1;
      if (last.current === null) last.current = ts;
      const delta = ts - last.current!;
      if (delta >= 1000) {
        setFps(frames.current);
        frames.current = 0;
        last.current = ts;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    const interval = setInterval(() => {
      // Simulated CPU load (random for demo purposes)
      setCpuLoadSim(Math.round(30 + Math.random() * 50));
    }, 2000);
    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(interval);
    };
  }, []);

  return { fps, cpuLoadSim };
}

function readLocalJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function StatusPage() {
  const { fps, cpuLoadSim } = usePerformanceMetrics();
  const featureUsage = readLocalJSON<Record<string, number>>("featureUsage", {});
  const userActivityEvents = Number(localStorage.getItem("userActivityEvents") || "0");
  const sessionDurationMs = Number(localStorage.getItem("sessionDurationMs") || "0");

  const errorCount = Number(localStorage.getItem("globalErrorCount") || "0");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Status</h2>
        <p className="text-sm text-neutral-500">Live overview of performance, reliability, and usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Approximate UI frame rate and simulated CPU load</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-600">Frame rate</span>
                  <span className="text-sm font-semibold">{fps} fps</span>
                </div>
                <Progress value={Math.min(100, Math.round((fps / 60) * 100))} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-600">CPU load (simulated)</span>
                  <span className="text-sm font-semibold">{cpuLoadSim}%</span>
                </div>
                <Progress value={cpuLoadSim} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Rates</CardTitle>
            <CardDescription>Captured client-side errors (session)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Errors</span>
                <span className="text-lg font-semibold">{errorCount}</span>
              </div>
              <Progress value={Math.min(100, errorCount)} />
              <p className="text-xs text-neutral-500">Hook into API/logging to provide real error rates.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Events and session duration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Activity events</span>
                <span className="text-lg font-semibold">{userActivityEvents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Session duration</span>
                <span className="text-lg font-semibold">{Math.round(sessionDurationMs / 1000)}s</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Feature Usage</CardTitle>
          <CardDescription>Page visits tracked locally</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.keys(featureUsage).length === 0 ? (
              <p className="text-sm text-neutral-500">No feature usage recorded yet.</p>
            ) : (
              Object.entries(featureUsage).map(([path, count]) => (
                <div key={path} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">{path}</span>
                  <span className="text-sm font-semibold">{count}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}