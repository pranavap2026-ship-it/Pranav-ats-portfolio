'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

import { API } from '@/lib/api';

type FormState = {
  type: 'idle' | 'loading' | 'ok' | 'err';
  msg?: string;
};

export default function ContactForm() {
  const [state, setState] = useState<FormState>({
    type: 'idle',
  });

  const formRef = useRef<HTMLFormElement>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Prevent duplicate submissions.
    if (state.type === 'loading') return;

    const form = e.currentTarget;

    if (!form.reportValidity()) return;

    setState({ type: 'loading' });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const formData = new FormData(form);

      const payload = {
        name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        subject: String(formData.get('subject') || '').trim(),
        message: String(formData.get('message') || '').trim(),
        website: String(formData.get('website') || '').trim(),
      };

      const response = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            (response.status === 429
              ? 'Too many attempts. Please try again later.'
              : 'Unable to send your message. Please try again.')
        );
      }

      form.reset();

      setState({
        type: 'ok',
        msg: 'Message sent successfully! I will reply by email soon.',
      });
    } catch (error) {
      let message = 'Could not send your message. Please try again.';

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          message = 'The request timed out. Please check your connection and try again.';
        } else if (error.message) {
          message = error.message;
        }
      }

      setState({
        type: 'err',
        msg: message,
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className="card space-y-4 p-5"
      aria-label="Contact form"
    >
      {/* Name and Email */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Name
          <input
            type="text"
            name="name"
            placeholder="Your name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            className="input mt-1"
            disabled={state.type === 'loading'}
          />
        </label>

        <label className="block text-sm font-medium">
          Email
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            maxLength={254}
            autoComplete="email"
            className="input mt-1"
            disabled={state.type === 'loading'}
          />
        </label>
      </div>

      {/* Subject */}
      <label className="block text-sm font-medium">
        Subject
        <input
          type="text"
          name="subject"
          placeholder="What would you like to discuss?"
          required
          minLength={2}
          maxLength={150}
          className="input mt-1"
          disabled={state.type === 'loading'}
        />
      </label>

      {/* Message */}
      <label className="block text-sm font-medium">
        Message
        <textarea
          name="message"
          placeholder="Tell me about your project or enquiry..."
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          className="input mt-1 resize-y"
          disabled={state.type === 'loading'}
        />
      </label>

      {/* Honeypot spam protection */}
      <div
        className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label>
          Leave this field empty
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={state.type === 'loading'}
        className="btn-primary inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.type === 'loading' ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={16} />
            Send message
          </>
        )}
      </button>

      {/* Feedback */}
      {state.msg && (
        <div
          role={state.type === 'err' ? 'alert' : 'status'}
          aria-live="polite"
          className={`flex items-start gap-2 rounded-lg p-3 text-sm ${
            state.type === 'ok'
              ? 'bg-green-500/10 text-green-600'
              : 'bg-red-500/10 text-red-600'
          }`}
        >
          {state.type === 'ok' ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
          )}

          <p>{state.msg}</p>
        </div>
      )}

      <p className="text-xs text-zinc-500">
        Your information will only be used to respond to your enquiry.
      </p>
    </form>
  );
}