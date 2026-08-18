# Design System: Minimalism Flat Modern Style

This document defines the core UI & visual styling principles for the Hadramout Modern Hospital (HMH) frontend application.

---

## 1. Core Philosophy: Minimalism & Flat Modernism
- **Simplicity First**: Every element on screen must serve a clear clinical or user purpose. Remove unnecessary decorations, excessive borders, or heavy textures.
- **Flat Surfaces**: Use solid, crisp background colors (`bg-white`, `bg-gray-50`, `bg-gray-100`) and flat container panels. Avoid heavy drop shadows or 3D skeuomorphic gradients.
- **Crisp Outlines & Borders**: Use subtle 1px border outlines (`border border-gray-200`) with smooth transitions on hover (`hover:border-primary-300` or `hover:border-gray-300`).
- **High Contrast & Readability**: Content, numbers, and medical statuses should be immediately identifiable at a glance.

---

## 2. Color Palette & Theming
- **Primary Color (Hospital Blue)**: `#27adea` / `var(--color-blue-500)`
  - Used for primary CTA buttons, active state indicators, link highlights, and key icons.
  - Light variants (`bg-blue-50`, `text-blue-700`, `border-blue-100`) for badges and icon backgrounds.
- **Secondary / Accent (Medical Emerald)**: `#3ab73e` / `var(--color-green-500)`
  - Used for positive states, confirmed appointments, active clinics, and health metrics.
  - Light variants (`bg-emerald-50`, `text-emerald-700`, `border-emerald-200`) for flat status pills.
- **Neutrals (Crisp Modern Grays)**:
  - Page Background: `#f9fafb` (`bg-gray-50`)
  - Card Surface: `#ffffff` (`bg-white`)
  - Heading & Primary Text: `#111827` (`text-gray-900`)
  - Secondary / Body Text: `#4b5563` (`text-gray-600` / `text-gray-700`)
  - Subtle Muted Text: `#9ca3af` (`text-gray-400` / `text-gray-500`)
  - Border Lines: `#e5e7eb` (`border-gray-200`)

---

## 3. Component Design Rules
- **Cards**:
  - `bg-white rounded-2xl border border-gray-200 p-5 md:p-6 transition-all duration-200`
  - Interactive cards: `hover:border-gray-300 hover:bg-gray-50/50 cursor-pointer`
- **Buttons**:
  - Pill / Rounded shapes (`rounded-full`) with solid flat fills or crisp outlines (`border-2 border-gray-200`).
- **Badges / Status Pills**:
  - Compact, flat pills with pastel background and high-contrast text (`badge-primary`, `badge-secondary`, `badge-gray`).
- **Icons**:
  - Clean geometric stroke icons from `lucide-react` with soft flat pastel badge containers (`bg-blue-50 text-blue-600`, `bg-emerald-50 text-emerald-600`, etc.).
- **Typography & RTL**:
  - Alexandria Arabic font with proper line-height (`leading-relaxed` or `leading-tight`).
  - Strict RTL alignment for Arabic language.
