import { Metadata } from 'next'
import LandingPage from './landing/page'

export const metadata: Metadata = {
  title: 'Fino AI - All-in-One Tool for Financial Analysts',
  description: 'Manage customers, trade calls, and centralize data with AI-powered insights.',
}

export default function Home() {
  return <LandingPage />
}