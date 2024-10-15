// src/app/contact/page.tsx
'use client';

import { useState } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to a server
    console.log('Form submitted:', { name, email, message })
    // Reset form fields
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Contact Me</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            placeholder="Your name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            placeholder="Your email"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-300 mb-2">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            rows={4}
            placeholder="Your message"
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500">
          Send Message
        </button>
      </form>
    </div>
  )
}