---
trigger: always_on
---

# API Routes & Coding Standards

This document establishes the strict coding standards and conventions to be followed across all API routes (`src/app/api/...`) and frontend code in this project.

---

## 1. Backend Environment Variable (`BACKEND_API`)
- Always use `process.env.BACKEND_API` directly for the backend endpoint.
- **Do NOT** define fallback aliases or redundant variables such as `const rawBackendApi = process.env.BACKEND_API || process.env.BACKEND_API_URL || ""`.
- **Standard format**:
  ```javascript
  const backendApi = (process.env.BACKEND_API || "").replace(/\/$/, "");
  ```

---

## 2. Clean Variable Naming & No Redundant Destructuring
- Always use **camelCase** for JavaScript variables, function parameters, and request body destructuring (e.g., `fullName`, `emailOrPhone`, `password`, `termsAccepted`).
- **Never duplicate or mix naming conventions** in destructuring (e.g., do NOT write `const { fullName, full_name, email, inputEmail } = body;`).
- Keep request body extraction single, clean, and explicit:
  ```javascript
  // Correct
  const { fullName, emailOrPhone, password } = body;

  // Incorrect (Forbidden)
  const { fullName, full_name, emailOrPhone, email: inputEmail } = body;
  ```

---

## 3. Scope & Enforcement
- These rules apply universally to **all route handlers (`route.js`)** and frontend modules across the entire codebase.
- Keep all API route logic concise, readable, and free of unnecessary boilerplate or redundant fallback chains.
