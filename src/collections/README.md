# Collections Directory

This directory contains JSON data files that are used throughout the application.

## projects.json

Contains all project data displayed on the `/projects` page.

### Structure

```json
{
  "id": "unique-identifier",
  "title": "Project Title",
  "techStack": "Tech • Stack • Listed",
  "description": "Brief project description",
  "ctaText": "Button text →",
  "ctaLink": "#",
  "iconName": "IconName",
  "published": true,
  "order": 1
}
```

### Fields

- **id** (required): Unique identifier, lowercase with dashes
- **title** (required): Display name of the project
- **techStack** (required): Technologies used, separated by bullets (•)
- **description** (required): One-line description
- **ctaText** (required): Call-to-action button text
- **ctaLink** (required): Button URL
- **iconName** (required): Icon reference from `/src/data/icons.ts`
- **published** (optional): Set to `false` to hide, default `true`
- **order** (optional): Display order (lower = first), default `0`

### Usage

#### Add a Project

1. Add a new object to the array in `projects.json`
2. Ensure `iconName` matches an export in `/src/data/icons.ts`
3. Run `npm run build` to verify

#### Hide a Project

Set `"published": false` to hide without deleting

#### Reorder Projects

Change `order` values (lower numbers appear first)

### Type Safety

Projects are validated against the `Project` interface in `/src/types.ts`:

```typescript
export interface Project {
  id: string;
  title: string;
  techStack: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  iconName: string;
  published?: boolean;
  order?: number;
}
```

TypeScript will catch errors at build time.
