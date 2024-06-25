# ClaudeAssist

ClaudeAssist is an AI-powered assistant application built with Fresh, a next-generation web framework for Deno. It provides various AI-assisted functionalities including translation, code assistance, email generation, and a chat interface.

## Features

- Translation: Translate text between multiple languages
- Code Assistant: Get AI-powered help with coding tasks
- Email Generator: Generate professional emails based on given topics
- Chat Interface: Engage in conversations with an AI assistant

## Installation

1. Ensure you have Deno installed on your system.
2. Clone this repository:
   ```
   git clone https://github.com/your-username/claude-assist.git
   cd claude-assist
   ```
3. Set up your environment variables:
   Create a `.env` file in the root directory and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

## Usage

To run the development server:

```
deno task start
```

To build the project:

```
deno task build
```

To preview the production build:

```
deno task preview
```

## Project Structure

- `islands/`: Contains interactive components (TaskManager, TranslateForm, CodeAssistant, EmailGenerator, ChatInterface)
- `routes/`: Defines the application routes and API endpoints
- `components/`: Reusable UI components
- `utils/`: Utility functions and classes for interacting with the Anthropic API
- `static/`: Static assets (CSS)

## Dependencies

- Fresh: Web framework for Deno
- Preact: Lightweight alternative to React
- Tailwind CSS: Utility-first CSS framework
- Anthropic SDK: For interacting with the Anthropic AI API

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
