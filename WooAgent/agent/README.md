# WooAgent - AI Agent

This component contains the AI agent that interacts with WooCommerce through the MCP server. The agent uses OpenAI's GPT models to understand natural language requests and convert them into appropriate tool calls.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key
   - Configure MCP server URL

## Running the Agent

To start the agent:

```
python src/main.py
```

## Project Structure

- `src/`: Source code
  - `main.py`: Entry point
  - `models/`: Data models
  - `services/`: Service classes
  - `utils/`: Utility functions
- `tests/`: Test files

## Development

To run tests:

```
pytest
