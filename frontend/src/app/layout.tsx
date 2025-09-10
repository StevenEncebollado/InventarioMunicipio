

import 'bootstrap/dist/css/bootstrap.min.css';
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
      <head>
        <style>{`
          * {
            box-sizing: border-box;
          }
          html, body {
            margin: 0;
            padding: 0;
            border: none;
            outline: none;
            box-shadow: none;
          }
          #root {
            border: none;
            outline: none;
            box-shadow: none;
          }
          .swal-container-above-modal {
            z-index: 10000 !important;
          }
          .swal2-container {
            z-index: 10000 !important;
          }
        `}</style>
      </head>
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}
