import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kako da Cury - Financiamento Habitacional Sem Complicações',
  description: 'Conquiste o sonho da casa própria com a Cury. Financiamento habitacional facilitado, sem burocracia e com as melhores condições do mercado.',
  generator: 'Kako da Cury',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
