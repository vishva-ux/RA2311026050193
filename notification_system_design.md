# Stage 1

## Approach

To handle a high volume of incoming notifications and display the top "N" most important ones to the user, we need an efficient mechanism to score and sort notifications.

### 1. Priority Scoring System
Each notification type is assigned a weight based on its importance:
- **Placement**: 3
- **Result**: 2
- **Event**: 1

The Priority Engine evaluates all unread notifications. It computes a unified sorting order based on the following rules:
1. **Higher Weight First**: Placement > Result > Event.
2. **Recency (Tie-breaker)**: If two notifications share the exact same weight, the one with the more recent `Timestamp` is given higher priority.

### 2. Algorithmic Complexity (`O(n log n)`)
The problem asks for finding the Top N out of a collection. While a Min-Heap can achieve `O(n log k)` which is more efficient for very large datasets and small N, standard sorting algorithms operating at `O(n log n)` provide exceptional performance for standard front-end data sets while keeping the implementation highly readable and idiomatic.

Our `getTopNNotifications` function leverages the native `Array.prototype.sort()` engine (which implements highly optimized TimSort in modern V8/Chrome). It sorts the entire set of unread notifications in `O(n log n)` time based on our composite priority rules, and then we slice the top N results.

### 3. Handling Live Streams (Maintenance)
As new notifications arrive continuously:
- Since we are filtering and slicing on the frontend, we can simply re-run the sorting algorithm whenever the global state (store) is updated with new socket events or polling responses. Because V8's sorting algorithm handles partially sorted arrays exceptionally fast (often `O(n)`), re-inserting and re-sorting when a single notification arrives is highly performant.

## Stage 2 Overview

### Architecture & UI
- Built on **React/Vite** running on `http://localhost:3000`.
- Uses **Material UI** natively for professional aesthetics without external UI libraries like Shadcn.
- Separates concerns using **Layered Architecture** (`/api`, `/hooks`, `/services`, `/store`).
- Employs **Programmatic Authentication** on startup against the live API, avoiding manual UI login flows.

### Logging Design
- The custom `/logging_middleware` centralizes all telemetry.
- It exposes a unified `Log(stack, level, package, message)` signature.
- It wraps Axios interceptors to automatically log all API network calls.
- Contains a strict **1-Retry Fallback** mechanism: if the external `/logs` API is unreachable or fails, the middleware will catch the exception, delay, and attempt exactly one additional retry.
