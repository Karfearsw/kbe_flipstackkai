import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { User as SelectUser } from "@shared/schema";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, { email: string; password: string }>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, { email: string; password: string; username?: string; name?: string; role?: SelectUser["role"] }>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { data: user, error, isLoading } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["supabase:user"],
    queryFn: async () => {
      if (!supabase) return undefined;
      const { data: authUser } = await supabase.auth.getUser();
      const uid = authUser.user?.id;
      if (!uid) return undefined;
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", uid)
        .limit(1);
      if (error) throw new Error(error.message);
      const row = data?.[0];
      if (!row) return undefined;
      // Map snake_case to app shape
      const mapped: SelectUser = {
        id: row.id,
        username: row.username,
        email: row.email,
        password: row.password,
        name: row.name,
        role: row.role,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
      return mapped;
    },
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      if (!supabase) throw new Error("Supabase is not configured");
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      // After login, fetch the app user row
      const uid = data.user?.id;
      if (!uid) throw new Error("No user id returned from Supabase Auth");
      const { data: rows, error: userErr } = await supabase.from("users").select("*").eq("auth_user_id", uid).limit(1);
      if (userErr) throw new Error(userErr.message);
      const row = rows?.[0];
      if (!row) throw new Error("User profile not found. Complete registration.");
      const mapped: SelectUser = {
        id: row.id,
        username: row.username,
        email: row.email,
        password: row.password,
        name: row.name,
        role: row.role,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
      return mapped;
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["supabase:user"], user);
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ email, password, username, name, role }: { email: string; password: string; username?: string; name?: string; role?: SelectUser["role"] }) => {
      if (!supabase) throw new Error("Supabase is not configured");
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name, role: role || "caller" } } });
      if (error) throw new Error(error.message);
      const uid = data.user?.id;
      if (!uid) throw new Error("No user id returned from Supabase SignUp");
      // Prefer secure RPC to create user profile with auth.uid()
      const { error: rpcError } = await supabase.rpc("register_user", { p_username: username || email.split("@")[0], p_email: email, p_name: name || null, p_role: role || "caller" });
      if (rpcError) throw new Error(rpcError.message);
      // Fetch created profile
      const { data: rows, error: userErr } = await supabase.from("users").select("*").eq("auth_user_id", uid).limit(1);
      if (userErr) throw new Error(userErr.message);
      const row = rows?.[0];
      const mapped: SelectUser = {
        id: row.id,
        username: row.username,
        email: row.email,
        password: row.password,
        name: row.name,
        role: row.role,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
      return mapped;
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["supabase:user"], user);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (!supabase) return;
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.setQueryData(["supabase:user"], null);
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
