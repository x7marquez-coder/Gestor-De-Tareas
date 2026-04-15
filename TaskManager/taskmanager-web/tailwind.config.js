// Exporta la configuración por defecto (en este caso, de Tailwind CSS)
export default {
  // Aquí se define las rutas de los archivos donde Tailwind buscará clases CSS
  content: [
    "./index.html",                 // Archivo HTML principal
    "./src/**/*.{js,jsx,ts,tsx}",   // Todos los archivos JS, JSX, TS y TSX dentro de /src
  ],
  // Configuración del tema de Tailwind
  theme: {
    extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  // Lista de plugins de Tailwind
  plugins: [
  ],
}