# Component Documentation Guide

This guide outlines the standards for documenting components in the Krutrim Cloud project, especially for components that are planned for future use but not currently implemented.

## Documentation Format

We use JSDoc-style comments for component documentation. The standard format is:

\`\`\`typescript
/**
 * @component ComponentName
 * @description Brief description of what the component does
 * 
 * Detailed description of the component's purpose, functionality,
 * and any important implementation details.
 * 
 * @status Current status (Active, Planned, Deprecated)
 * @plannedFor When this component will be implemented (if planned)
 * 
 * @example
 * // Example usage code
 * import { ComponentName } from "@/components/path/to/component";
 * 
 * function ExampleUsage() {
 *   return <ComponentName prop="value" />;
 * }
 * 
 * @see Related components:
 * - RelatedComponent1
 * - RelatedComponent2
 * 
 * @todo Future tasks for this component
 */
\`\`\`

## Status Types

- **Active**: Component is currently in use in the application
- **Planned**: Component is planned for future use but not currently implemented
- **Deprecated**: Component is being phased out and should not be used in new code

## Documenting Planned Components

For components that are planned for future use but not currently implemented:

1. Always include the `@plannedFor` tag with a specific timeframe or milestone
2. Add detailed `@todo` items to outline what needs to be done
3. Include example usage code to show how the component should be used
4. List related components that will interact with this component

## Maintaining Documentation

- Update component documentation when implementation status changes
- Review documentation during code reviews
- Keep the planned implementation dates up-to-date

## Finding Unused Components

Run the `scripts/find-component-usage.sh` script periodically to identify potentially unused components:

\`\`\`bash
./scripts/find-component-usage.sh
\`\`\`

## Decision Process for Unused Components

When a component is identified as potentially unused:

1. Verify it's truly unused by running the search script
2. Determine if it's planned for future use
3. If planned, add proper documentation following this guide
4. If not planned, consider removing it following the cleanup plan
