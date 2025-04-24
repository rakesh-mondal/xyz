export interface Breadcrumb {
  href: string
  title: string
}

export function generateBreadcrumbs(pathname: string): Breadcrumb[] {
  // Skip empty segments and get path parts
  const paths = pathname.split("/").filter(Boolean)

  // Create breadcrumb items
  const breadcrumbs: Breadcrumb[] = []

  // Add home/dashboard as first breadcrumb if not already in path
  if (paths.length > 0 && paths[0] !== "dashboard") {
    breadcrumbs.push({
      href: "/dashboard",
      title: "Dashboard",
    })
  }

  // Build the rest of the breadcrumbs
  paths.forEach((path, index) => {
    // Build the href for this breadcrumb
    const href = `/${paths.slice(0, index + 1).join("/")}`

    // Format the title (convert kebab-case to Title Case)
    const title = path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    breadcrumbs.push({ href, title })
  })

  return breadcrumbs
}
