"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

export type ContactFormData = {
  contact_type: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
};

export type EventContactFormData = {
  event_type: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
};

export async function submitGeneralContact(data: ContactFormData): Promise<any> {
  const response = await fetch(`${API_BASE}/contact/contact-us`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to submit contact form");
  }

  const result = await response.json();
  return result;
}

export async function submitEventContact(data: EventContactFormData): Promise<any> {
  const response = await fetch(`${API_BASE}/contact/contact-us-for-event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to submit event contact form");
  }

  const result = await response.json();
  return result;
}
