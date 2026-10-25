# Product

<!-- impeccable:product-schema 1 -->

> Inferred from the README and code. The owner asked the redesign to proceed on inferred context; treat each line as an assumption until confirmed.

## Platform

web

## Users
Individuals managing household money: tracking accounts and transactions, keeping to a budget, saving toward goals, and staying ahead of bills and subscriptions. They open it at home in the evening or on a phone after a purchase, and some prefer dark mode.

## Product Purpose
Hearth is a personal finance SPA with a landing page, auth, and an app with dashboard, transactions, budget, savings goals (with micro-contributions), analytics, reports, subscriptions, bill calendar, settings and profile. Light and dark themes, user-isolated data.

## Positioning
Calm, home-scale money management: "quietly guided", with AI-style insights on spending patterns.

## Capabilities and Constraints
- Vanilla JS SPA (`js/pages/*.js` render templates, many inline styles reference CSS variables), Chart.js, FastAPI backend.
- Theme switch sets `html[data-theme]` to `light` or `dark`; both must be maintained.

## Brand Commitments
- Name "Hearth" and the "H" mark.

## Evidence on Hand
- Landing numbers (50K+ people, $2.4B tracked, 4.9★) and the Zara M. testimonial are placeholder marketing copy; do not extend them.

## Product Principles
1. Money is personal and a little stressful: clarity first, calm tone.
2. Numbers must be legible at a glance in both themes.
3. Every insight points to something you can do.
