# RAWG API Proxy

A self-hosted proxy layer for the [RAWG Video Games Database API](https://rawg.io/apidocs). This proxy adds a layer of control and optimization, making it ideal for managing access and staying within API usage limits.

It includes built-in features for authentication, caching, rate limiting, and monthly budget tracking to prevent exceeding the RAWG API's free tier allowance.

## Features

*   **Monthly Budgeting**: Caps the total number of upstream calls to the RAWG API per month to avoid hitting usage limits and incurring costs.
*   **In-Memory Caching**: Reduces redundant API calls by caching successful responses. Includes Time-To-Live (TTL) and LRU-style eviction.
*   **Rate Limiting**: Implements a per-client, per-minute rate limit to prevent abuse of the proxy.
*   **Basic Authentication**: Secures the proxy endpoint with simple username/password authentication.
*   **Highly Configurable**: All major parameters (API keys, limits, cache settings) are easily configured through environment variables.
*   **Built with TypeScript & Express**: A modern, type-safe, and robust foundation.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
*   [pnpm](https://pnpm.io/installation) (or `npm`/`yarn`)
*   A [RAWG API Key](https://rawg.io/apidocs)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/aulanchik/rawg-proxy.git
    cd rawg-proxy
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Configure environment variables:**
    Create a `.env` file by copying the example:
    ```bash
    cp .env.example .env
    ```
    Then, open the `.env` file and fill in your details. See the [Configuration](#configuration) section below for details on each variable.

## Configuration

The following environment variables can be set in your `.env` file:

| Variable              | Description                                                                       | Default    |
| --------------------- | --------------------------------------------------------------------------------- | ---------- |
| `PORT`                | The port on which the proxy server will run.                                      | `8080`     |
| `RAWG_API_KEY`        | **Required.** Your API key for the RAWG database.                                 | `''`       |
| `PROXY_USER`          | The username for Basic Authentication to access the proxy.                        | `admin`    |
| `PROXY_PASS`          | The password for Basic Authentication to access the proxy.                        | `change_me`  |
| `RATE_LIMIT_PER_MIN`  | The number of requests allowed per client per minute.                             | `60`       |
| `CACHE_TTL_SECONDS`   | The time-to-live for cached responses, in seconds.                                | `3600` (1 hour) |
| `CACHE_MAX_ENTRIES`   | The maximum number of entries to store in the cache before evicting the oldest.   | `1000`     |
| `MONTHLY_BUDGET`      | The total number of requests allowed to the upstream RAWG API per calendar month. | `9500`     |

## Usage

Once the server is running, you can make requests to the RAWG API through the proxy. All requests are forwarded from `/api/*` on the proxy to `https://api.rawg.io/api/*`.

You must provide your configured `PROXY_USER` and `PROXY_PASS` using HTTP Basic Authentication.

### Example Request

Here is an example using `curl` to search for the game "Portal 2". Replace the user, password, and port with your configuration.

```bash
curl -u "admin:change_me" "http://localhost:8080/api/games?search=portal%202"
```

The response will be a JSON object from the RAWG API. The response headers will also include `X-Cache: HIT` or `X-Cache: MISS` to indicate if the response was served from the proxy's cache.

## Available Scripts

### Run in Development Mode

Starts the server with hot-reloading for development.

```bash
pnpm dev
```

### Build for Production

Compiles the TypeScript code into JavaScript in the `dist/` directory.

```bash
pnpm build
```

### Start Production Server

Runs the compiled application from the `dist/` directory. Ensure you have run `pnpm build` first.

```bash
pnpm start
```

## API Endpoints

*   **`GET /health`**
    *   **Description**: A simple health check endpoint to confirm the server is running.
    *   **Response**: `OK`

*   **`GET /api/*`**
    *   **Description**: Proxies any `GET` request to the corresponding RAWG API endpoint. For example, a request to `/api/games/3498` will be forwarded to `https://api.rawg.io/api/games/3498`.
    *   **Authentication**: Requires HTTP Basic Authentication.
    *   **Responses**:
        *   `2xx/4xx`: A response from the upstream RAWG API, potentially served from cache.
        *   `401 Unauthorized`: Authentication failed or was not provided.
        *   `429 Too Many Requests`: The client has exceeded the configured rate limit.
        *   `503 Service Unavailable`: The monthly budget for RAWG API calls has been exhausted.
