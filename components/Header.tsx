/**
 * Renders the header component for the ClaudeAssist application.
 * @returns The JSX element representing the header component.
 */
export default function Header() {
  return (
    <header class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center max-w-5xl">
        <h1 class="text-xl font-semibold text-gray-800">ClaudeAssist</h1>
        <nav>
          <ul class="flex space-x-6">
            <li><a href="/" class="text-gray-600 hover:text-gray-900">Home</a></li>
            <li><a href="#about" class="text-gray-600 hover:text-gray-900">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
