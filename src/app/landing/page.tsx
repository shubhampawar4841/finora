'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useClerk, SignInButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronRight, BarChart2, MessageCircle, Users, Database, Bot } from 'lucide-react'

export default function LandingPage() {
  const { user } = useUser()
  const [email, setEmail] = useState('')
  const { openSignIn } = useClerk()

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <BarChart2 className="h-8 w-8" />
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button 
            variant="outline" 
            onClick={() => user ? window.location.href = '/dashboard' : openSignIn()}
          >
            {user ? 'Open Dashboard' : 'Sign In'}
          </Button>
        </motion.div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row items-center justify-center p-4 space-y-8 md:space-y-0 md:space-x-8">
        <motion.div
          className="max-w-md space-y-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h1 className="text-4xl font-bold">Empower Your Financial Analysis with Fino AI</h1>
          <p className="text-lg">The all-in-one tool for research analysts and investment advisors.</p>
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={() => alert('Joined waitlist!')}>
              Join Waitlist
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <FeatureIcon icon={MessageCircle} text="Send trade calls to multiple messaging networks" />
          <FeatureIcon icon={Users} text="Track subscribers and send batch calls" />
          <FeatureIcon icon={Database} text="Manage data for clearer audit trails" />
          <FeatureIcon icon={Bot} text="AI-based rationale generator" />
        </motion.div>
      </main>

      <motion.footer
        className="p-4 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <p>&copy; 2023 Fino AI. All rights reserved.</p>
      </motion.footer>
    </div>
  )
}

function FeatureIcon({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Icon className="h-5 w-5" />
      <span>{text}</span>
    </div>
  )
}

