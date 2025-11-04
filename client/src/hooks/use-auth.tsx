import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { User as SelectUser } from "@shared/schema";
import { queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { validateEmail, validateUsername, validatePhone } from "@/lib/validators";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, { email?: string; username?: string; password: string }>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, { email?: string; phone?: string; password: string; username?: string; name?: string; role?: SelectUser["role"] }>;
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
        phone: row.phone,
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
    mutationFn: async ({ email, username, password }: { email?: string; username?: string; password: string }) => {
      if (!supabase) throw new Error("Supabase is not configured");
      let signInEmail = email;
      if (!signInEmail && username) {
        const { data: userRows, error: findErr } = await supabase
          .from("users")
          .select("email")
          .eq("username", username)
          .limit(1);
        if (findErr) throw new Error(findErr.message);
        signInEmail = userRows?.[0]?.email;
      }
      if (!signInEmail) throw new Error("Provide email or username to login");
      const { data, error } = await supabase.auth.signInWithPassword({ email: signInEmail, password });
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
        phone: row.phone,
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
    mutationFn: async ({ email, phone, password, username, name, role }: { email?: string; phone?: string; password: string; username?: string; name?: string; role?: SelectUser["role"] }) => {
      if (!supabase) throw new Error("Supabase is not configured");
      // Client-side validation
      if (email && !validateEmail(email)) {
        throw new Error("Invalid email format");
      }
      if (phone && !validatePhone(phone)) {
        throw new Error("Invalid phone number. Use E.164 format, e.g., +15551234567");
      }
      if (username && !validateUsername(username)) {
        throw new Error("Invalid username (3–24 letters, numbers or underscores)");
      }
      if (!email && !phone) {
        throw new Error("Provide either email or phone to register");
      }

      // Duplicate detection (best effort; DB constraints enforce definitively)
      const filters: string[] = [];
      if (email) filters.push(`email.eq.${email}`);
      if (username) filters.push(`username.eq.${username}`);
      if (phone) filters.push(`phone.eq.${phone}`);
      if (filters.length > 0) {
        const { data: dupRows, error: dupErr } = await supabase
          .from("users")
          .select("id,email,username,phone")
          .or(filters.join(","))
          .limit(1);
        if (!dupErr && dupRows && dupRows.length > 0) {
          const conflict = dupRows[0];
          const conflicts: string[] = [];
          if (email && conflict.email === email) conflicts.push("email");
          if (username && conflict.username === username) conflicts.push("username");
          if (phone && conflict.phone === phone) conflicts.push("phone");
          throw new Error(`Account already exists for: ${conflicts.join(", ")}`);
        }
      }

      // Supabase Auth sign up
      let authRes;
      if (email) {
        authRes = await supabase.auth.signUp({ email, password, options: { data: { name, role: role || "caller" } } });
      } else {
        authRes = await supabase.auth.signUp({ phone: phone!, password });
      }
      if (authRes.error) throw new Error(authRes.error.message);
      const uid = authRes.data.user?.id;
      if (!uid) throw new Error("No user id returned from Supabase SignUp");
      // Prefer secure RPC to create user profile with auth.uid(), include phone
      const fallbackUsername = username || (email ? email.split("@")[0] : undefined) || (phone ? phone.replace("+", "user") : "user");
      const { error: rpcError } = await supabase.rpc("register_user", {
        p_username: fallbackUsername,
        p_email: email ?? null,
        p_phone: phone ?? null,
        p_name: name ?? null,
        p_role: role || "caller",
      });
      if (rpcError) {
        // Fallback: direct insert; requires appropriate RLS policies
        const { error: insertErr } = await supabase.from("users").insert({
          auth_user_id: uid,
          username: fallbackUsername,
          email: email ?? null,
          phone: phone ?? null,
          password,
          name: name ?? null,
          role: role || "caller",
        });
        if (insertErr) throw new Error(rpcError.message);
      }
      // Fetch created profile
      const { data: rows, error: userErr } = await supabase.from("users").select("*").eq("auth_user_id", uid).limit(1);
      if (userErr) throw new Error(userErr.message);
      const row = rows?.[0];
      const mapped: SelectUser = {
        id: row.id,
        username: row.username,
        email: row.email,
        phone: row.phone,
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
