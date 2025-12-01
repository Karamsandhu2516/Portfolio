import type { Project } from '../types';
import * as icons from './icons';

// Static import for build-time data
import projectsData from '../collections/projects.json';

/**
 * Load projects from JSON with type safety
 * Icons are mapped from iconName references to actual SVG content
 * Projects can be filtered by 'published' status and sorted by 'order'
 */
export function getProjects() {
	// Use the static import for consistent behavior
	return (projectsData as Project[])
		.filter((p) => p.published !== false)
		.sort((a, b) => (a.order || 0) - (b.order || 0))
		.map((p) => ({
			title: p.title,
			techStack: p.techStack,
			description: p.description,
			ctaText: p.ctaText,
			ctaLink: p.ctaLink,
			icon: icons[p.iconName as keyof typeof icons] || ''
		}));
}

// For backwards compatibility, also export as constant
export const projects = getProjects();