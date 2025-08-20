# My Image Generation LLM Service

A FastAPI-based service for LLM-powered image generation.

## Features

- FastAPI-based REST API
- Image generation endpoints
- Comprehensive testing setup
- Code formatting and linting
- Type checking with mypy

## Installation

This project uses [uv](https://github.com/astral-sh/uv) for dependency management.

```bash
# Clone the repository
git clone <your-repo-url>
cd my-img-gen/llm

# Install dependencies
uv sync

# Activate virtual environment
source .venv/bin/activate  # On Unix/macOS
# or
.venv\Scripts\activate     # On Windows
```

## Development Setup

```bash
# Install development dependencies
uv sync --group dev

# Run code formatting
uv run black .
uv run isort .

# Run type checking
uv run mypy .

# Run tests
uv run pytest
```

## Running the Application

```bash
# Run the development server
uv run python -m my_img_gen_llm.main

# Or use the script entry point
uv run my-img-gen-llm
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:

- Interactive API docs: http://localhost:8000/docs
- ReDoc documentation: http://localhost:8000/redoc

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=false

# CORS Configuration
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]

# Image Generation Configuration
DEFAULT_IMAGE_SIZE=1024x1024
DEFAULT_QUALITY=standard
DEFAULT_STYLE=vivid

# External API Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE=https://api.openai.com/v1

# Logging Configuration
LOG_LEVEL=INFO
```

## Project Structure

```
llm/
├── my_img_gen_llm/          # Main package
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   └── config.py            # Configuration management
├── tests/                   # Test files
│   ├── __init__.py
│   └── test_main.py
├── pyproject.toml           # Project configuration
└── README.md               # This file
```

## Development

### Adding Dependencies

```bash
# Add production dependency
uv add package_name

# Add development dependency
uv add --dev package_name
```

### Running Tests

```bash
# Run all tests
uv run pytest

# Run tests with coverage
uv run pytest --cov=my_img_gen_llm

# Run specific test file
uv run pytest tests/test_main.py
```

### Code Quality

```bash
# Format code
uv run black .
uv run isort .

# Type checking
uv run mypy .

# Lint code (if you add flake8 or ruff)
uv run flake8 .
```

## License

MIT License - see LICENSE file for details.
