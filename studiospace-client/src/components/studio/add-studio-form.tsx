"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, X } from "lucide-react";

import { useAuth } from "@/components/auth/auth-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  ApiError,
  createStudio,
  updateStudio,
  type CreatedStudio,
  type MyStudio,
  type NewStudioInput,
} from "@/lib/api";
import { studioCategories } from "@/lib/studios";

const emptyForm = {
  name: "",
  category: "",
  tagline: "",
  description: "",
  location: "",
  pricePerHour: "",
  rating: "0",
  reviews: "0",
  image: "",
  gallery: "",
  hero: false,
};

type FormState = typeof emptyForm;

const galleryPlaceholder = [
  "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
].join("\n");

/**
 * Login-gated form that mirrors the Studio model and POSTs to the backend.
 * The slug is generated server-side from the studio name. Pass `initial` to
 * switch into edit mode — the form prefills and PUTs instead of creating.
 */
export function AddStudioForm({ initial }: { initial?: MyStudio }) {
  const { token, logout } = useAuth();
  const router = useRouter();

  const isEdit = Boolean(initial);
  const nextPath = initial ? `/account/studios/edit/${initial.id}` : "/studios/new";

  const [form, setForm] = useState<FormState>(() =>
    initial
      ? {
          name: initial.name,
          category: initial.category,
          tagline: initial.tagline,
          description: initial.description,
          location: initial.location,
          pricePerHour: String(initial.pricePerHour),
          rating: String(initial.rating),
          reviews: String(initial.reviews),
          image: initial.image,
          gallery: initial.gallery.join("\n"),
          hero: initial.hero ?? false,
        }
      : emptyForm,
  );
  const [amenities, setAmenities] = useState<string[]>(
    () => initial?.amenities ?? [],
  );
  const [amenityDraft, setAmenityDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<CreatedStudio | null>(null);
  const [pending, setPending] = useState(false);

  function setField<Key extends keyof FormState>(
    key: Key,
    value: FormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function addAmenity() {
    const value = amenityDraft.trim();
    if (!value || amenities.includes(value)) {
      setAmenityDraft("");
      return;
    }
    setAmenities((current) => [...current, value]);
    setAmenityDraft("");
  }

  function removeAmenity(value: string) {
    setAmenities((current) => current.filter((item) => item !== value));
  }

  function handleAmenityKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addAmenity();
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setAmenities([]);
    setAmenityDraft("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (amenities.length === 0) {
      setError("Add at least one amenity.");
      return;
    }

    if (!token) {
      router.replace(`/login?next=${nextPath}`);
      return;
    }

    const input: NewStudioInput = {
      name: form.name.trim(),
      category: form.category,
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      pricePerHour: Number(form.pricePerHour),
      rating: form.rating === "" ? 0 : Number(form.rating),
      reviews: form.reviews === "" ? 0 : Number(form.reviews),
      amenities,
      image: form.image.trim(),
      gallery: form.gallery
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
      hero: form.hero,
    };

    setPending(true);
    try {
      if (initial) {
        // The slug is left untouched server-side, so existing links survive.
        const updated = await updateStudio(initial.id, input, token);
        setSaved(updated);
      } else {
        const created = await createStudio(input, token);
        resetForm();
        setSaved(created);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // Token expired or revoked — the guard sends them back through login.
        logout();
        router.replace(`/login?next=${nextPath}`);
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">
          {initial ? `Edit “${initial.name}”` : "Add New Studio"}
        </h1>
        <p className="text-muted-foreground">
          {isEdit
            ? "Update the listing below — the URL stays the same so existing links keep working."
            : "Fill in the details below — the studio is saved to the StudioSpace backend. The URL is generated automatically from the name."}
        </p>
      </div>

      {saved && (
        <Alert>
          <AlertTitle>{isEdit ? "Studio updated" : "Studio added"}</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              &ldquo;{saved.name}&rdquo; is live with the slug{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                {saved.slug}
              </code>
              .
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/studios/${saved.slug}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                View listing
              </Link>
              {isEdit ? (
                <Link
                  href="/account/studios"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Back to my studios
                </Link>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setSaved(null)}>
                  Add another studio
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Could not save the studio</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="studio-name">Name</Label>
              <Input
                id="studio-name"
                placeholder="The White Room"
                required
                value={form.name}
                onChange={(event) => setField("name", event.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="studio-category">Category</Label>
                <NativeSelect
                  id="studio-category"
                  className="w-full"
                  required
                  value={form.category}
                  onChange={(event) =>
                    setField("category", event.target.value)
                  }
                >
                  <NativeSelectOption value="" disabled>
                    Choose a category
                  </NativeSelectOption>
                  {studioCategories.map((category) => (
                    <NativeSelectOption key={category} value={category}>
                      {category}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studio-location">Location</Label>
                <Input
                  id="studio-location"
                  placeholder="DUMBO, Brooklyn"
                  required
                  value={form.location}
                  onChange={(event) => setField("location", event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studio-tagline">Tagline</Label>
              <Input
                id="studio-tagline"
                placeholder="120m² cyclorama with full blackout"
                required
                value={form.tagline}
                onChange={(event) => setField("tagline", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studio-description">Description</Label>
              <Textarea
                id="studio-description"
                rows={5}
                placeholder="Describe the space, the gear included, and what it is best suited for…"
                required
                value={form.description}
                onChange={(event) =>
                  setField("description", event.target.value)
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="studio-price">Price per hour ($)</Label>
                <Input
                  id="studio-price"
                  type="number"
                  min={1}
                  step="0.5"
                  placeholder="85"
                  required
                  value={form.pricePerHour}
                  onChange={(event) =>
                    setField("pricePerHour", event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studio-rating">Rating (0–5)</Label>
                <Input
                  id="studio-rating"
                  type="number"
                  min={0}
                  max={5}
                  step="0.1"
                  required
                  value={form.rating}
                  onChange={(event) => setField("rating", event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studio-reviews">Reviews</Label>
                <Input
                  id="studio-reviews"
                  type="number"
                  min={0}
                  step={1}
                  required
                  value={form.reviews}
                  onChange={(event) => setField("reviews", event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studio-image">Cover image URL</Label>
              <Input
                id="studio-image"
                type="url"
                placeholder="https://images.unsplash.com/photo-…"
                required
                value={form.image}
                onChange={(event) => setField("image", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studio-gallery">
                Gallery{" "}
                <span className="font-normal text-muted-foreground">
                  (one image URL per line, optional)
                </span>
              </Label>
              <Textarea
                id="studio-gallery"
                rows={3}
                placeholder={galleryPlaceholder}
                value={form.gallery}
                onChange={(event) => setField("gallery", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studio-amenity">Amenities</Label>
              <div className="flex gap-2">
                <Input
                  id="studio-amenity"
                  placeholder="e.g. Cyclorama — 120m²"
                  value={amenityDraft}
                  onChange={(event) => setAmenityDraft(event.target.value)}
                  onKeyDown={handleAmenityKeyDown}
                />
                <Button type="button" variant="outline" onClick={addAmenity}>
                  <Plus aria-hidden />
                  Add
                </Button>
              </div>
              {amenities.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="flex items-center gap-1 rounded-md border border-border bg-muted/40 py-1 pl-2.5 pr-1 text-sm"
                    >
                      {amenity}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-5 text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${amenity}`}
                        onClick={() => removeAmenity(amenity)}
                      >
                        <X aria-hidden />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="studio-hero"
                checked={form.hero}
                onCheckedChange={(checked) => setField("hero", checked)}
              />
              <Label htmlFor="studio-hero" className="cursor-pointer">
                Feature this studio on the homepage hero
              </Label>
            </div>

            <Button type="submit" disabled={pending}>
              {pending && <Spinner aria-hidden />}
              {isEdit ? "Save changes" : "Save studio"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
