import { useState } from 'react'
import Reveal from '@/components/Reveal'
import Eyebrow from '@/components/Eyebrow'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-8xl px-6 py-32 md:px-10">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        <Reveal>
          <Eyebrow>Get in Touch</Eyebrow>
          <h1 className="mt-3 font-display text-4xl text-ivory-100 md:text-5xl">Contact</h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory-100/60">
            For bespoke enquiries, wholesale, press or general questions — reach out below.
          </p>

          <div className="mt-12 space-y-8">
            <div>
              <p className="label-eyebrow text-ivory-100/50">Atelier</p>
              <p className="mt-2 text-sm text-ivory-100/70">[PLACEHOLDER — address to confirm]</p>
            </div>
            <div>
              <p className="label-eyebrow text-ivory-100/50">Email</p>
              <p className="mt-2 text-sm text-ivory-100/70">[PLACEHOLDER — contact email]</p>
            </div>
            <div>
              <p className="label-eyebrow text-ivory-100/50">Hours</p>
              <p className="mt-2 text-sm text-ivory-100/70">[PLACEHOLDER — hours by appointment]</p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          {submitted ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center border border-ivory-100/10 px-8 text-center">
              <p className="font-display text-2xl text-gold-300">Message received.</p>
              <p className="mt-3 max-w-xs text-sm text-ivory-100/60">
                Thank you for reaching out — this form is not yet connected to a live inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="label-eyebrow text-ivory-100/50">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="mt-2 w-full border-b border-ivory-100/30 bg-transparent py-3 text-ivory-100 placeholder:text-ivory-100/30 focus:border-gold-300 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="label-eyebrow text-ivory-100/50">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-2 w-full border-b border-ivory-100/30 bg-transparent py-3 text-ivory-100 placeholder:text-ivory-100/30 focus:border-gold-300 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="message" className="label-eyebrow text-ivory-100/50">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="mt-2 w-full resize-none border-b border-ivory-100/30 bg-transparent py-3 text-ivory-100 placeholder:text-ivory-100/30 focus:border-gold-300 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="border border-ivory-100 px-10 py-3 text-sm uppercase tracking-widest2 text-ivory-100 transition-colors duration-300 hover:bg-ivory-100 hover:text-ink-950"
              >
                Send
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  )
}
