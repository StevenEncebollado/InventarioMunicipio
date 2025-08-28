import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inventario Municipio',
  description: 'Sistema de inventario municipal - Gestión de equipos y activos',
  keywords: 'inventario, municipio, equipos, gestión',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
