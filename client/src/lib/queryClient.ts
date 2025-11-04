import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { supabase } from "./supabase";

// Map DB snake_case rows to app camelCase shapes
function mapLeadRow(row: any) {
  if (!row) return row;
  return {
    id: row.id,
    leadId: row.lead_id,
    propertyAddress: row.property_address,
    city: row.city,
    state: row.state,
    zip: row.zip,
    ownerName: row.owner_name,
    ownerPhone: row.owner_phone,
    ownerEmail: row.owner_email,
    status: row.status,
    motivationLevel: row.motivation_level,
    propertyType: row.property_type,
    source: row.lead_source,
    notes: row.notes,
    arv: row.arv,
    repairCost: row.repair_cost,
    estimatedValue: row.estimated_value,
    assignedToUserId: row.assigned_to_user_id,
    latitude: row.latitude,
    longitude: row.longitude,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUserRow(row: any) {
  if (!row) return row;
  return {
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
}

function mapActivityRow(row: any) {
  if (!row) return row;
  return {
    id: row.id,
    userId: row.user_id,
    actionType: row.action_type,
    targetType: row.target_type,
    targetId: row.target_id,
    description: row.description,
    createdAt: row.created_at,
  };
}

function mapCallRow(row: any) {
  if (!row) return row;
  return {
    id: row.id,
    userId: row.user_id,
    leadId: row.lead_id,
    callTime: row.call_timestamp,
    duration: row.duration_seconds,
    outcome: row.outcome,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

function mapScheduledCallRow(row: any) {
  if (!row) return row;
  return {
    id: row.id,
    assignedCallerId: row.assigned_caller_id,
    leadId: row.lead_id,
    scheduledTime: row.scheduled_time,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildLeadFilters(query: any) {
  let q = supabase!.from("leads").select("*");
  if (query?.status && Array.isArray(query.status) && query.status.length) {
    q = q.in("status", query.status);
  }
  if (query?.search && typeof query.search === "string" && query.search.trim()) {
    const s = query.search.trim();
    // Search owner_name, property_address, city, state
    q = q.or(
      `owner_name.ilike.%${s}%,property_address.ilike.%${s}%,city.ilike.%${s}%,state.ilike.%${s}%`
    );
  }
  if (query?.assignedToUserId !== undefined && query.assignedToUserId !== null) {
    q = q.eq("assigned_to_user_id", query.assignedToUserId);
  }
  // Sorting
  const sortBy = query?.sortBy === "updatedAt" ? "updated_at" : "created_at";
  const ascending = query?.sortOrder === "asc";
  q = q.order(sortBy, { ascending });
  return q;
}

// We need to declare the useErrorGuidance hook here, but not import it directly
// to avoid circular dependencies, as it's imported in components that use this file
declare function useErrorHandlers(): {
  mapNetworkError: (error: any) => void;
  handleQueryError: (error: any, context?: string) => void;
};

// This is used internally by the throwIfResNotOk function
// to map HTTP status codes to error types for better error handling
export function mapHttpStatusToErrorType(status: number) {
  switch (status) {
    case 401:
      return { type: "authentication", severity: "medium" as const };
    case 403:
      return { type: "permission", severity: "medium" as const };
    case 404:
      return { type: "notFound", severity: "low" as const };
    case 422:
      return { type: "validation", severity: "low" as const };
    case 429:
      return { type: "network", severity: "medium" as const }; // Rate limiting
    case 500:
    case 502:
    case 503:
    case 504:
      return { type: "server", severity: "high" as const };
    default:
      if (status >= 400 && status < 500) {
        return { type: "validation", severity: "medium" as const };
      }
      if (status >= 500) {
        return { type: "server", severity: "high" as const };
      }
      return { type: "unknown", severity: "medium" as const };
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    const error = new Error(`${res.status}: ${text}`);
    
    // Add metadata to the error object for better error handling
    (error as any).status = res.status;
    (error as any).statusText = res.statusText;
    (error as any).url = res.url;
    (error as any).errorType = mapHttpStatusToErrorType(res.status).type;
    (error as any).severity = mapHttpStatusToErrorType(res.status).severity;
    
    throw error;
  }
}

/**
 * Enhanced API request function with better error handling
 * @param method HTTP method (GET, POST, etc.)
 * @param url API endpoint URL
 * @param data Optional request body
 * @param options Additional options
 * @returns Response object
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options?: {
    /**
     * Context for the request, useful for error reporting
     */
    context?: string;
    /**
     * Additional headers to include
     */
    headers?: Record<string, string>;
    /**
     * Custom timeout in milliseconds (defaults to 30000)
     */
    timeout?: number;
  }
): Promise<Response> {
  // If Supabase is configured, route certain /api/* operations to Supabase directly
  if (supabase && url.startsWith("/api/")) {
    try {
      // Leads
      if (method === "POST" && url === "/api/leads") {
        const body = (data || {}) as any;
        const leadId = body.leadId || `LD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
        const insert = {
          lead_id: leadId,
          property_address: body.propertyAddress,
          city: body.city,
          state: body.state,
          zip: body.zip,
          owner_name: body.ownerName,
          owner_phone: body.ownerPhone,
          owner_email: body.ownerEmail,
          status: body.status,
          motivation_level: body.motivationLevel,
          property_type: body.propertyType,
          lead_source: body.source,
          notes: body.notes,
          arv: body.arv,
          repair_cost: body.repairCost,
          estimated_value: body.estimatedValue,
          latitude: body.latitude,
          longitude: body.longitude,
          assigned_to_user_id: body.assignedToUserId,
        };
        const { data: rows, error } = await supabase.from("leads").insert(insert).select("*").limit(1);
        if (error) {
          return new Response(error.message, { status: 400 });
        }
        const mapped = rows?.[0] ? mapLeadRow(rows[0]) : null;
        return new Response(JSON.stringify(mapped), { status: 200, headers: { "Content-Type": "application/json" } });
      }
      if (method === "PUT" && url.startsWith("/api/leads/")) {
        const id = Number(url.split("/").pop());
        const body = (data || {}) as any;
        const update: any = {};
        if (body.propertyAddress !== undefined) update.property_address = body.propertyAddress;
        if (body.city !== undefined) update.city = body.city;
        if (body.state !== undefined) update.state = body.state;
        if (body.zip !== undefined) update.zip = body.zip;
        if (body.ownerName !== undefined) update.owner_name = body.ownerName;
        if (body.ownerPhone !== undefined) update.owner_phone = body.ownerPhone;
        if (body.ownerEmail !== undefined) update.owner_email = body.ownerEmail;
        if (body.status !== undefined) update.status = body.status;
        if (body.motivationLevel !== undefined) update.motivation_level = body.motivationLevel;
        if (body.propertyType !== undefined) update.property_type = body.propertyType;
        if (body.source !== undefined) update.lead_source = body.source;
        if (body.notes !== undefined) update.notes = body.notes;
        if (body.arv !== undefined) update.arv = body.arv;
        if (body.repairCost !== undefined) update.repair_cost = body.repairCost;
        if (body.estimatedValue !== undefined) update.estimated_value = body.estimatedValue;
        if (body.latitude !== undefined) update.latitude = body.latitude;
        if (body.longitude !== undefined) update.longitude = body.longitude;
        if (body.assignedToUserId !== undefined) update.assigned_to_user_id = body.assignedToUserId;
        const { data: rows, error } = await supabase.from("leads").update(update).eq("id", id).select("*").limit(1);
        if (error) {
          return new Response(error.message, { status: 400 });
        }
        const mapped = rows?.[0] ? mapLeadRow(rows[0]) : null;
        return new Response(JSON.stringify(mapped), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // Scheduled calls
      if (method === "POST" && url === "/api/scheduled-calls") {
        const body = (data || {}) as any;
        const insert = {
          lead_id: body.leadId,
          assigned_caller_id: body.assignedCallerId,
          scheduled_time: body.scheduledTime,
          status: body.status,
          notes: body.notes,
        };
        const { data: rows, error } = await supabase.from("scheduled_calls").insert(insert).select("*").limit(1);
        if (error) {
          return new Response(error.message, { status: 400 });
        }
        const mapped = rows?.[0] ? mapScheduledCallRow(rows[0]) : null;
        return new Response(JSON.stringify(mapped), { status: 200, headers: { "Content-Type": "application/json" } });
      }

      // Calls
      if (method === "POST" && url === "/api/calls") {
        const body = (data || {}) as any;
        const insert = {
          user_id: body.userId,
          lead_id: body.leadId,
          call_timestamp: body.callTime,
          duration_seconds: body.duration,
          outcome: body.outcome,
          notes: body.notes,
        };
        const { data: rows, error } = await supabase.from("calls").insert(insert).select("*").limit(1);
        if (error) {
          return new Response(error.message, { status: 400 });
        }
        const mapped = rows?.[0] ? mapCallRow(rows[0]) : null;
        return new Response(JSON.stringify(mapped), { status: 200, headers: { "Content-Type": "application/json" } });
      }
    } catch (e: any) {
      const message = e?.message || "Supabase request failed";
      return new Response(message, { status: 500 });
    }
    // Fallback to network for other endpoints (e.g., auth, Twilio)
  }

  // Build absolute URL if a base is provided, otherwise use relative (same origin)
  function buildUrl(input: string) {
    const isAbsolute = /^https?:\/\//i.test(input);
    if (isAbsolute) return input;
    const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
    return base ? `${base}${input}` : input;
  }

  // Create an AbortController to handle timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, options?.timeout || 30000);
  
  try {
    const fullUrl = buildUrl(url);
    const res = await fetch(fullUrl, {
      method,
      headers: {
        ...(data ? { "Content-Type": "application/json" } : {}),
        ...(options?.headers || {})
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
      signal: controller.signal
    });
    
    // Add context to error if provided
    if (options?.context) {
      (res as any).context = options.context;
    }
    
    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    // Add context to the error if it was aborted due to timeout
    if (error instanceof DOMException && error.name === 'AbortError') {
      const timeoutError = new Error(`Request timeout: ${url}`);
      (timeoutError as any).errorType = 'network';
      (timeoutError as any).severity = 'medium';
      (timeoutError as any).context = options?.context;
      throw timeoutError;
    }
    
    // Add context to other errors if provided
    if (options?.context && error instanceof Error) {
      (error as any).context = options.context;
    }
    
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Enhanced query function creator for React Query
 * @param options Configuration options
 * @returns Query function for React Query
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
  /**
   * Context for the request, useful for error reporting
   */
  context?: string;
  /**
   * Timeout in milliseconds (defaults to 30000)
   */
  timeout?: number;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior, context, timeout }) =>
  async ({ queryKey }) => {
    // If Supabase is configured and the queryKey matches our common data endpoints, fetch via Supabase
    if (supabase && typeof queryKey[0] === "string" && (queryKey[0] as string).startsWith("/api/")) {
      const endpoint = queryKey[0] as string;
      try {
        if (endpoint === "/api/leads") {
          const filters = (queryKey[1] as any) || {};
          const q = buildLeadFilters(filters);
          const { data, error } = await q;
          if (error) throw new Error(error.message);
          return (data || []).map(mapLeadRow) as any;
        }
        if (endpoint === "/api/team") {
          const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
          if (error) throw new Error(error.message);
          return (data || []).map(mapUserRow) as any;
        }
        if (endpoint === "/api/activities") {
          const { data, error } = await supabase.from("activities").select("*").order("created_at", { ascending: false });
          if (error) throw new Error(error.message);
          return (data || []).map(mapActivityRow) as any;
        }
        if (endpoint === "/api/calls") {
          const { data, error } = await supabase.from("calls").select("*").order("created_at", { ascending: false });
          if (error) throw new Error(error.message);
          return (data || []).map(mapCallRow) as any;
        }
        if (endpoint === "/api/scheduled-calls") {
          const { data, error } = await supabase.from("scheduled_calls").select("*").order("scheduled_time", { ascending: true });
          if (error) throw new Error(error.message);
          return (data || []).map(mapScheduledCallRow) as any;
        }
        // Fallback: continue to network for endpoints we didn't map (e.g., auth, Twilio)
      } catch (err) {
        // Respect on401 behavior only for network; Supabase errors will be thrown
        throw err;
      }
    }

    // Create an AbortController to handle timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout || 30000);
    
    try {
      const url = queryKey[0] as string;
      const isAbsolute = /^https?:\/\//i.test(url);
      const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
      const fullUrl = isAbsolute ? url : (base ? `${base}${url}` : url);
      const res = await fetch(fullUrl, {
        credentials: "include",
        signal: controller.signal
      });
      
      // Add context to the response if provided
      if (context) {
        (res as any).context = context;
      }
      
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }
      
      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      // Handle timeout errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        const timeoutError = new Error(`Request timeout: ${queryKey[0]}`);
        (timeoutError as any).errorType = 'network';
        (timeoutError as any).severity = 'medium';
        (timeoutError as any).context = context;
        throw timeoutError;
      }
      
      // Add context to other errors if provided
      if (context && error instanceof Error) {
        (error as any).context = context;
      }
      
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

// Enhanced global error handler
function globalErrorHandler(error: any) {
  console.error("API Error:", error);
  
  // Log to monitoring/analytics systems in production
  if (process.env.NODE_ENV === "production") {
    // This is where we'd send errors to monitoring services
    // like Sentry, LogRocket, etc.
  }
  
  return error;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ 
        on401: "throw", 
        context: "Global Query",
        timeout: 30000
      }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
