/**
 * Type definitions for Portfolio data structures
 */

export interface Project {
    /** Unique identifier for the project */
    id: string;

    /** Project title */
    title: string;

    /** Technology stack used (e.g., "React • TypeScript • Node.js") */
    techStack: string;

    /** Project description */
    description: string;

    /** Call-to-action button text */
    ctaText: string;

    /** Call-to-action button link */
    ctaLink: string;

    /** Icon name reference (must match export in logos.ts) */
    iconName: string;

    /** Whether the project should be displayed (default: true) */
    published?: boolean;

    /** Display order (lower numbers appear first, default: 0) */
    order?: number;
}
