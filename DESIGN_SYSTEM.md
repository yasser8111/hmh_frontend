# Hospital Modern Hadramout (HMH) Design System

## 1. Design Philosophy: Minimalism Flat Modern Style
The design philosophy across all pages and components is strictly **Minimalism Flat Modern Style**.
- **Flat Surfaces & Clean Geometry**: Use crisp, flat backgrounds (`bg-white`, `bg-gray-50`) with subtle 1px border lines (`border-gray-200`, `hover:border-gray-300`). Avoid heavy 3D skeuomorphism, noisy shadows, or visual clutter.
- **Minimalist Palette**: Harmonious hospital primary blue (`--color-blue-500` / `#27adea`), healthcare emerald green (`--color-green-500` / `#3ab73e`), and balanced neutral grays.
- **Generous Whitespace & Clear Hierarchy**: Ample padding, crisp Alexandria Arabic typography, and structured grid cards.
- **Subtle Micro-interactions**: Smooth hover state transitions, clear focus rings, and flat status badges.

---

## 2. Visual Hierarchy
Every page must have a clear, structured visual hierarchy:
1. **Page Title**: Strong, crisp heading
2. **Supporting Description**: Concise context when necessary
3. **Primary Action**: Prominent primary button or filter
4. **Main Content**: Grid cards, forms, or data views
5. **Secondary Information**: Metadata, timestamps, and supporting details

Do not give every element the same visual weight. Primary actions must be visually distinguishable from secondary actions.

---

## 3. Color System

### Primary Blue
```css
--color-blue-500: #27adea;
```
Primary blue represents:
- Healthcare
- Trust & Professionalism
- Primary actions & buttons
- Active navigation states
- Interactive links

*Guideline*: Use primary blue deliberately. Do not paint the entire interface blue.

### Healthcare Green
```css
--color-green-500: #3ab73e;
```
Healthcare green represents:
- Success & Confirmation
- Available doctor / open slot
- Confirmed appointment
- Completed actions

*Guideline*: Do not use green as an arbitrary decorative color.

### Neutral Colors
Use neutral grays for all surfaces, borders, and typography:
- `gray-50`: Page & canvas backgrounds
- `gray-100`: Secondary surfaces, pill buttons, subtle hover backgrounds
- `gray-200`: Subtle card and input borders
- `gray-300`: Hover borders & disabled states
- `gray-400`: Placeholder text & muted icons
- `gray-500`: Secondary helper text & timestamps
- `gray-600`: Supporting body text
- `gray-700`: Strong secondary text & label headers
- `gray-800`: Card titles & section headings
- `gray-900` / `gray-950`: Primary page headings & high-emphasis text

---

## 4. Semantic Colors
Colors must communicate meaning consistently across the app:
- **Success (`green-500`)**: Successful bookings, verified accounts, active statuses.
- **Error (`red-500`)**: Form validation errors, failed requests, cancellations, destructive actions.
- **Warning (`amber-500`)**: Pending verifications, waiting list, cautionary notices.
- **Information (`blue-500`)**: Informational banners, instructions, neutral status details.

---

## 5. Typography
The primary Arabic typeface is: **Alexandria** (`font-alexandria`).
Typography must be clean, modern, highly legible, and consistent.

Hierarchy:
- **Page Title**: `text-xl` to `text-3xl`, `font-bold`, `text-gray-950`
- **Section Title**: `text-base` to `text-lg`, `font-semibold`, `text-gray-900`
- **Card Title / Heading**: `text-sm` to `text-base`, `font-bold`, `text-gray-900`
- **Body Text**: `text-sm`, `font-normal`, `text-gray-700`
- **Supporting / Caption Text**: `text-xs`, `font-medium`, `text-gray-500`

Avoid excessive font weights. Never use ornamental or decorative typefaces.

---

## 6. Spacing Scale
Use a consistent 4px spacing scale:
`4px` (`1`), `8px` (`2`), `12px` (`3`), `16px` (`4`), `20px` (`5`), `24px` (`6`), `32px` (`8`), `40px` (`10`), `48px` (`12`), `64px` (`16`).

Avoid arbitrary spacing values.

---

## 7. Layout & Whitespace
- Layouts must be structured, predictable, and responsive using CSS Grid and Flexbox.
- Generous whitespace is an intentional part of the design—it prevents cognitive overload in healthcare interfaces.
- Avoid cluttered layouts, overlapping elements, or unnecessary deeply nested containers.

---

## 8. Containers
- Constrain desktop content to clean max-widths (`max-w-7xl`, `max-w-5xl`, `max-w-md` for auth).
- Large desktop layouts must never stretch content uncontrollably across ultra-wide monitors.
- Always include responsive horizontal padding (`px-4 sm:px-6 lg:px-8`).

---

## 9. Cards
Cards represent grouped information:
- **Background**: Flat white (`bg-white`)
- **Border**: Subtle 1px (`border border-gray-200` or `border-2 border-white` for flat floating feel)
- **Border Radius**: Rounded 2xl (`rounded-2xl`)
- **Shadow**: None or subtle micro-shadow (`shadow-2xs` / `shadow-xs`)
- Cards must never look like heavy 3D floating skeuomorphic blocks.

---

## 10. Borders
- Default border: `border border-gray-200`
- Interactive hover border: `hover:border-gray-300` or `hover:border-primary-300`
- Borders should clarify geometric structure without being visually heavy.

---

## 11. Border Radius
- **Inputs & Compact Controls**: `rounded-2xl` (or `rounded-xl`)
- **Cards & Modals**: `rounded-2xl`
- **Pills & Badges**: `rounded-full`
- Maintain consistency across all components.

---

## 12. Shadows
Default: **No shadow (Flat)**.
Use subtle micro-shadows (`shadow-xs`, `shadow-sm`) only when necessary to establish elevation for:
- Dropdowns & DatePickers
- Popovers
- Modal dialogs
- Floating navigation bars

---

## 13. Buttons
Buttons must have clear hierarchy and use `@/components/ui/Button`:
- **Primary Button (`variant="primary"`)**: Hospital blue background, white text, subtle hover brightness, clear focus ring.
- **Secondary Button (`variant="secondary"`)**: White background, subtle gray border (`border-gray-200`), dark text.
- **Destructive Button (`variant="danger"`)**: Red background or red outline, white/red text.
- **Google Button (`variant="google"`)**: Clean white surface, 1px border, authentic Google multi-color SVG icon.
- **States**: Support `loading` (spinner with `Loader2`), `disabled`, `startIcon`, and `endIcon`.

---

## 14. Inputs & Controls
Inputs must be spacious, clear, and accessible using `@/components/ui/Input`:
- Label positioned clearly above the input
- Neutral border (`border-gray-200`) with smooth focus ring (`focus:border-primary-500`)
- Accessible placeholder with appropriate contrast (`placeholder:text-gray-400`)
- Clear error message displayed below in red with subtle error icon
- Comfortable touch-friendly padding (`py-2.5 px-4`)

---

## 15. Forms
- Organize forms into clean, logical sections.
- Group related fields together.
- Use explicit labels on all inputs (do not rely on placeholders as labels).
- Clearly denote required fields.

---

## 16. Tables & Data Lists
- Prioritize high readability with clean column headers and subtle row borders.
- Adequate cell padding (`py-3.5 px-4`).
- On mobile devices, transform wide tables into structured, responsive card lists.

---

## 17. Status Badges
Status badges must be flat, compact, and semantically colored:
- **Confirmed**: Emerald green background (`bg-green-50 text-green-700 border border-green-200`)
- **Pending / Waiting**: Amber background (`bg-amber-50 text-amber-700 border border-amber-200`)
- **Cancelled**: Neutral/Red background (`bg-gray-100 text-gray-700` or `bg-red-50 text-red-700`)
- **Completed**: Blue/Slate background (`bg-blue-50 text-blue-700 border border-blue-200`)
- Never use gradients, badges with heavy shadows, or 3D effects.

---

## 18. Icons
- Use **Lucide React** (`lucide-react`) icons across the application.
- Maintain consistent stroke width (`stroke-[1.5]` to `stroke-2`).
- Align icons with text baselines and maintain proportional sizing (`w-4 h-4` to `w-5 h-5`).
- Never use icons solely as visual filler.

---

## 19. Navigation
- **Desktop Navigation**: Clean top header or sidebar with active link indicator, logo on the right (RTL), and user profile menu on the left.
- **Mobile Navigation**: Touch-friendly bottom bar or drawer menu with clear active states and large tap targets (minimum 44x44px).

---

## 20. Modals & Dialogs
- Use modals exclusively for focused tasks: confirmations, destructive actions, or critical appointment details.
- Always include an accessible close button (`X`), clear title, description, body content, and action buttons.
- Backdrop must be subtle (`bg-black/40 backdrop-blur-xs`).

---

## 21. Loading States
- Use skeleton loaders (`animate-pulse bg-gray-100 rounded-xl`) that mirror the layout of incoming content.
- Use inline spinner loaders (`Loader2`) inside buttons during active submissions.
- Never display fake or simulated data while waiting for network responses.

---

## 22. Empty States
- Display calm, authentic empty states when collections are empty (`[]`).
- Structure: Centered icon, clean title, short friendly explanation, and an optional action button (e.g., "احجز موعدك الأول").
- Do not imply an error occurred when the backend legitimately returned zero records.

---

## 23. Error States
- Error screens and inline banners must explain what happened clearly and provide an actionable next step (e.g., "إعادة المحاولة").
- Never expose raw backend stack traces or database errors to the user.

---

## 24. Toasts & Notifications
- Use notifications only for meaningful events (e.g., "تم تأكيد الحجز بنجاح", "تم نسخ رابط الموعد").
- Auto-dismiss after a reasonable duration (3-5 seconds).

---

## 25. Micro-interactions & Animations
- Keep transitions short, smooth, and purposeful (`transition-all duration-200`).
- Use subtle scale effects on active press (`active:scale-[0.98]`).
- Avoid large bouncing animations, complex 3D flips, or distracting motion.

---

## 26. Accessibility
- All interactive controls must support keyboard navigation (`Tab`, `Enter`, `Space`, `Escape`).
- Focus rings must be clearly visible (`focus-visible:ring-2 focus-visible:ring-primary-500`).
- Ensure sufficient contrast ratios between text and background colors (WCAG AA compliant).
- Do not use clickable `div` elements without proper `role="button"`, `tabIndex={0}`, and key handlers.

---

## 27. Responsive Design
- Design with a mobile-first mindset.
- Verify layouts across Mobile (`<640px`), Tablet (`640px-1024px`), Desktop (`1024px-1280px`), and Large Desktop (`>1280px`).
- Prevent any accidental horizontal scrollbars (`overflow-x-hidden`).

---

## 28. Healthcare UX Principles
Because this application serves hospital patients, doctors, and healthcare staff:
- Prioritize extreme clarity, trust, and calm visual presentation.
- Minimize cognitive load—keep medical forms and booking steps streamlined.
- Ensure critical patient and doctor info (specialty, clinic room, appointment date/time) is immediately legible.

---

## 29. Data Presentation
- Structure medical information cleanly:
  1. Most important info (Doctor Name, Appointment Date & Time, Status)
  2. Supporting info (Clinic Building, Room Number, Specialty)
  3. Secondary metadata (Booking Number, Created Timestamp)
  4. Actions (Reschedule, Cancel, View Details)
- Never expose sensitive private patient data in public summaries.

---

## 30. Dashboard Design
- Dashboards must prioritize real actionable information over vanity metrics.
- Only render stats, upcoming appointments, and notifications backed by the real live backend API.
- Never fabricate dashboard figures.

---

## 31. Visual Density Balance
- Avoid extreme density (crammed text, excessive borders, tiny fonts).
- Avoid excessive emptiness (huge wasted spaces, lack of structure).
- Maintain balanced, breathing information density.

---

## 32. Consistency & Component Reuse
Always reuse established components from `@/components/ui`:
- `Button`
- `Input`
- `Card`
- `RadioCard`
- `DatePicker`
- `Modal`
- `Badge`
- `Textarea`

Do not create one-off variant components for individual pages without architectural justification.

---

## 33. Forbidden Visual Patterns
Unless explicitly requested, strictly avoid:
- Heavy gradients or neon glowing colors
- Glassmorphism & Neumorphism
- 3D skeuomorphic cards
- Dark mode hacks on light pages
- Random decorative floating blobs
- Fake charts or fabricated dashboard metrics

---

## 34. Design Decision Priority
When resolving design decisions, adhere to this strict hierarchy:
1. **Usability & Clarity**
2. **Accessibility**
3. **Information Hierarchy**
4. **Consistency with Design System**
5. **Responsiveness**
6. **Visual Simplicity**
7. **Aesthetics**

---

## 35. Checklist Before Creating New UI
Before building or modifying any page or component:
1. Inspect existing pages in `src/app/` for established layout patterns.
2. Inspect `@/components/ui` for existing primitives.
3. Verify required data fields against the live OpenAPI specification (`https://hmh-backend.vercel.app/openapi.json`).
4. Apply the color palette (`blue-500`, `green-500`, `gray-50` to `gray-950`).
5. Verify responsive behavior on mobile and desktop.
6. Verify loading, empty, and error states.

---

## 36. Final Design Rule
Every page and component must look and feel like it belongs to one unified, premium, and trustworthy healthcare application.

**Minimal. Flat. Modern. Clear. Professional. Accessible. Consistent.**
