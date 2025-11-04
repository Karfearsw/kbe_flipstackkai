import React from "react";
import { supabase } from "@/lib/supabase";

type Note = { id: number; title: string };

export default function NotesPage() {
  const [notes, setNotes] = React.useState<Note[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function fetchNotes() {
      try {
        if (!supabase) throw new Error("Supabase not configured");
        const { data, error } = await supabase.from("notes").select();
        if (error) throw error;
        if (!cancelled) setNotes(data as Note[]);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load notes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchNotes();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <div className="p-4">Loading notes…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Supabase Notes</h1>
      <pre className="rounded bg-muted p-4 text-sm overflow-auto">
        {JSON.stringify(notes, null, 2)}
      </pre>
    </div>
  );
}