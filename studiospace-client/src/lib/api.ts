import { studioCategories, type Studio, type StudioCategory } from "@/lib/studios";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      "Cannot reach the server — is the backend running on port 5000?",
      0,
    );
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export interface AuthSession {
  token: string;
  user: { id: string; name: string; email: string };
}

export function loginUser(email: string, password: string) {
  return request<AuthSession>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function registerUser(name: string, email: string, password: string) {
  return request<AuthSession>("/api/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
}

/** Verifies the Google ID token server-side; works for sign-up and sign-in. */
export function loginWithGoogle(credential: string) {
  return request<AuthSession>("/api/auth/google", {
    method: "POST",
    body: { credential },
  });
}

export interface NewStudioInput {
  name: string;
  category: string;
  tagline: string;
  description: string;
  location: string;
  pricePerHour: number;
  rating: number;
  reviews: number;
  amenities: string[];
  image: string;
  gallery: string[];
  hero: boolean;
}

export interface CreatedStudio extends NewStudioInput {
  id: string;
  slug: string;
}

export interface MyStudio extends CreatedStudio {
  createdAt?: string;
}

/** Maps a backend listing onto the client's Studio shape, if possible. */
export function myStudioToStudio(doc: MyStudio): Studio | null {
  if (!studioCategories.includes(doc.category as StudioCategory)) return null;
  return { ...doc, category: doc.category as StudioCategory };
}

export function createStudio(input: NewStudioInput, token: string) {
  return request<CreatedStudio>("/api/studios", {
    method: "POST",
    body: input,
    token,
  });
}

export function getMyStudios(token: string) {
  return request<MyStudio[]>("/api/studios/mine", { token });
}

export function deleteStudio(id: string, token: string) {
  return request<{ deleted: boolean }>(`/api/studios/${id}`, {
    method: "DELETE",
    token,
  });
}

export function updateStudio(
  id: string,
  input: NewStudioInput,
  token: string,
) {
  return request<CreatedStudio>(`/api/studios/${id}`, {
    method: "PUT",
    body: input,
    token,
  });
}

/** Public lookup for studios created through the API (not in the seed data). */
export function fetchStudioBySlug(slug: string) {
  return request<MyStudio>(`/api/studios/${encodeURIComponent(slug)}`);
}

export interface BookingInput {
  studioSlug: string;
  studioName: string;
  studioImage: string;
  pricePerHour: number;
  /** Calendar date, YYYY-MM-DD. */
  date: string;
  /** Whole hours, 1–12. */
  hours: number;
}

export interface Booking extends BookingInput {
  id: string;
  userId: string;
  userEmail: string | null;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export function createBooking(input: BookingInput, token: string) {
  return request<Booking>("/api/bookings", {
    method: "POST",
    body: input,
    token,
  });
}

export function getMyBookings(token: string) {
  return request<Booking[]>("/api/bookings/mine", { token });
}

/** Cancels a booking (status becomes "cancelled"; the record is kept). */
export function cancelBooking(id: string, token: string) {
  return request<Booking>(`/api/bookings/${id}/cancel`, {
    method: "POST",
    token,
  });
}
