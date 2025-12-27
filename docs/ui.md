# UI Coding Standards

This document outlines the UI coding standards for the Lifting Diary project.

## Component Library

**ONLY use shadcn/ui components for all UI elements in this project.**

- Do NOT create custom components
- Do NOT use other component libraries
- All UI must be built using shadcn/ui primitives

### Installing shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

### Available Components

Refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components) for the full list of available components.

## Date Formatting

Use `date-fns` for all date formatting operations.

### Standard Date Format

Dates should be formatted with ordinal day suffixes:

```
1st Sep 2025
2nd Aug 2024
3rd Jan 2023
4th Dec 2022
```

### Implementation

```typescript
import { format } from "date-fns";

// Format: "1st Sep 2025"
const formattedDate = format(date, "do MMM yyyy");
```

### Format Tokens

- `do` - Day of month with ordinal suffix (1st, 2nd, 3rd, etc.)
- `MMM` - Abbreviated month name (Jan, Feb, Mar, etc.)
- `yyyy` - Full year (2024, 2025, etc.)
