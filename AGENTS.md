# Project Guidelines & Agent Instructions

## 1. Backend Environment Variable
- Use `process.env.BACKEND_API` directly.
- Do not create extra alias fallbacks (e.g., avoid `rawBackendApi` or checking `BACKEND_API_URL`).
- Format:
  ```javascript
  const backendApi = (process.env.BACKEND_API || "").replace(/\/$/, "");
  ```

## 2. Clean Variable Naming & No Redundant Aliases
- Use standard **camelCase** for all JavaScript variables and destructured objects (`fullName`, `emailOrPhone`, `password`).
- Never duplicate variables with alternative casing styles (e.g. do not write `{ fullName, full_name }` or `{ email, inputEmail }`).
- Destructure clean single variables only.

## 3. Scope
- These standards apply strictly across all API routes (`src/app/api/...`) and frontend components in this project.

## 4. UI & Design System: Minimalism Flat Modern Style
- The design philosophy across all pages and components is strictly **Minimalism Flat Modern Style**.
- **Key Principles**:
  - **Flat Surfaces & Clean Geometry**: Use crisp, flat backgrounds (`bg-white`, `bg-gray-50`) with subtle 1px border lines (`border-gray-200`, `hover:border-gray-300`). Avoid heavy 3D skeuomorphism, noisy shadows, or clutter.
  - **Minimalist Palette**: Harmonious hospital primary blue (`--color-blue-500` / `#27adea`), healthcare emerald green (`--color-green-500` / `#3ab73e`), and balanced neutral grays.
  - **Generous Whitespace & Clear Hierarchy**: Ample padding, crisp Alexandria Arabic typography, and structured grid cards.
  - **Subtle Micro-interactions**: Smooth hover state transitions, clear focus rings, and flat status badges.

## 5. Code Comments & Documentation Guidelines
- **Always in English**: All code comments and docstrings must strictly be written in English.
- **Concise & Minimal**: Avoid excessive or line-by-line commentary on obvious code.
- **Meaningful Only**: Only write comments when clarifying complex, non-obvious logic or key architecture decisions. Keep them short and essential.


