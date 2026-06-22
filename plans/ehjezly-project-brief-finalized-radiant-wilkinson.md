# Ehjezly — Implementation Plan

## Context
Ehjezly ("Book for me" in Arabic) is a luxury-minimalist, bilingual health & beauty booking marketplace for Kuwait. The deliverable is a full interactive React SPA demonstrating every major screen from the finalized IA brief: onboarding, multi-account auth, client discovery & booking, and service provider management. The app simulates a mobile experience (max-width ~430px centered on a dark canvas).

---

## Aesthetic Decisions

**Default mode: Light.** A theme toggle (sun/moon icon) in the top-right of the shell switches between light and dark. The `dark` class is toggled on `<html>`.

| Token | Light Value | Dark Value |
|---|---|---|
| `--background` | `#F3EDF8` | `#1B1324` |
| `--foreground` | `#1B1324` | `#F3EDF8` |
| `--card` | `#FFFFFF` | `#2A1D3D` |
| `--card-foreground` | `#1B1324` | `#F3EDF8` |
| `--primary` | `#6B21A8` | `#6B21A8` |
| `--primary-foreground` | `#FFFFFF` | `#FFFFFF` |
| `--accent` | `#F8CD42` | `#F8CD42` |
| `--accent-foreground` | `#1B1324` | `#1B1324` |
| `--muted` | `#EDE5F5` | `#3D2B57` |
| `--muted-foreground` | `#7C5C9E` | `#C4A8E0` |
| `--border` | `rgba(107,33,168,0.2)` | `rgba(107,33,168,0.35)` |
| `--radius` | `1rem` | `1rem` |

**Font:** Inter (Google Fonts) — already specified in brief.  
**Stance:** Luxury minimalist, light-ground default. Gold accents used sparingly for CTAs and key highlights only.

---

## File Changes

### `src/styles/fonts.css`
Add Google Fonts import for Inter (weights 300, 400, 500, 600, 700).

### `src/styles/theme.css`
Update `:root` token values to the Ehjezly palette above. Preserve `.dark` block and `@theme inline` mapping — only update values, never token names.

### `src/app/App.tsx`
Complete replacement. Single file, ~900–1100 lines. All views rendered via React `useState` router. No external router needed.

---

## Screen Inventory & State Router

`currentView` string drives which screen renders. Bottom nav and back-stack array handle navigation.

```
"splash"              → Onboarding/Splash (logo + tagline + CTA)
"login"               → Login form (email/phone + password, "Add Account" link)
"signup"              → Sign-up form (Client or Provider toggle)
"account-switcher"    → Bottom-sheet overlay (active accounts list)
"client-home"         → Client home (search bar, category pills, featured providers)
"provider-results"    → Search results with filters (location, price, rating)
"provider-profile"    → Provider detail (bio, services, portfolio grid, reviews)
"booking-flow"        → Date picker + time slot selector + confirm
"my-appointments"     → Personal booking history tabs (Upcoming / Past)
"business-bookings"   → Business incoming bookings list (all clients)
"provider-dashboard"  → Today's schedule + revenue mini-chart + quick stats
"provider-calendar"   → Weekly calendar with appointment blocks + time-block
"service-setup"       → Service catalog (add/edit services, price, duration)
"business-profile"    → Business profile editor (name, photos, bio, hours)
"settings"            → Account hub: profile info, Add Account, Switch Account
```

---

## Component Structure (all inline in App.tsx)

```
<App>
  <MobileShell>               ← max-w-[430px] centered, dark bg, overflow-y-auto
    {view === "splash"    && <SplashScreen />}
    {view === "login"     && <LoginScreen />}
    {view === "signup"    && <SignupScreen />}
    {view === "client-home" && <ClientHome />}
    ... (all other views)
    <AccountSwitcherSheet />  ← conditional overlay
  </MobileShell>
  <BottomNav />               ← fixed to MobileShell bottom when authenticated
</App>
```

**Shared state (passed via closure / lifted to App):**
- `currentView`, `setView(name)`
- `accountType`: `"personal" | "business"`
- `accounts[]`: mock list for switcher
- `showSwitcher`: boolean for bottom sheet
- `darkMode`: boolean, default `false`; toggled by sun/moon button in shell header

---

## Key Design Patterns

- **Bottom nav:** 4 tabs for both account types. Personal: Home / Bookings / Calendar / Profile. Business: Home / Bookings / Calendar / Profile. "Bookings" tab shows personal appointments for personal accounts and all incoming client bookings for business accounts. Active tab highlighted with gold dot + label.
- **Account switcher:** Radix `Sheet` from bottom; lists mock accounts with avatar + name + type badge; "Add account" row at bottom.
- **Cards:** `bg-card` with `border-border` hairline, `rounded-2xl`, subtle `shadow`.
- **Gold CTAs:** `bg-accent text-accent-foreground` primary buttons. Secondary buttons use `bg-primary text-white`.
- **Provider profile portfolio:** 3-column image grid using Unsplash beauty/spa photos.
- **Booking flow:** Horizontal date strip (next 14 days) + time slot grid; selected slots in gold.
- **Revenue chart:** Recharts `AreaChart` with purple fill and gold stroke on provider dashboard.
- **Realistic data:** Kuwait-context names (Reem, Noura, Farah, Al-Salam Beauty, Lush Salon), KWD pricing, realistic service names.

---

## Unsplash Images to Use
- Salon/spa interior: hero and provider profile covers
- Beauty service closeups: portfolio grid tiles
- Professional headshots: provider avatars

All images: `https://images.unsplash.com/photo-{id}?w={w}&h={h}&fit=crop&auto=format`

---

## Verification
1. App loads at splash screen with Ehjezly branding
2. Tapping "Get Started" → Login; toggling to Signup works
3. After login, bottom nav appears; switching account type (client ↔ provider) changes nav + home view
4. Account switcher sheet opens from Settings or avatar tap
5. Client flow: Home → search → Provider Results → Provider Profile → Booking → Appointments
6. Provider flow: Dashboard → Calendar → Services → Business Profile → Settings
7. All views render without console errors; gold CTAs and purple surfaces match spec
