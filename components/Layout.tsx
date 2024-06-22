import { ComponentChildren } from "preact";
import Header from "./Header.tsx";

/**
 * Renders the layout component.
 *
 * @param {Object} props - The component props.
 * @param {ComponentChildren} props.children - The child components to render.
 * @returns {JSX.Element} The rendered layout component.
 */
export default function Layout({ children }: { children: ComponentChildren }) {
  return (
    <div class="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <main class="container mx-auto px-4 py-8 max-w-5xl">
        {children}
      </main>
    </div>
  );
}