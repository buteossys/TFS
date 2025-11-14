"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function Contact() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => router.push('/'), 2000); // Redirect to home after 2 seconds
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen relative">
      <Navbar />
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/backgrounds/contact1.jpeg)' }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 mt-16">
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-white mb-8 text-center font-[var(--font-caveat)]">
            Contact Us
          </h1>

          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-500/20 backdrop-blur-sm text-white rounded">
              Message sent successfully! Redirecting...
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm text-white rounded">
              Failed to send message. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white mb-2 font-[var(--font-caveat)] text-xl">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white mb-2 font-[var(--font-caveat)] text-xl">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-white mb-2 font-[var(--font-caveat)] text-xl">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="(123) 456-7890"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-white mb-2 font-[var(--font-caveat)] text-xl">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-white mb-2 font-[var(--font-caveat)] text-xl">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 rounded bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Your message here..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded bg-white/90 hover:bg-white text-gray-900 font-semibold transition-colors duration-200 font-[var(--font-caveat)] text-xl disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 