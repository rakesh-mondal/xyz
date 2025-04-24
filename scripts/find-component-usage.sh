#!/bin/bash
# Component Usage Search Script
# This script searches for imports and references to potentially unused components
# across the entire codebase.

# Set text colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Krutrim Cloud Component Usage Search ===${NC}"
echo "This script will search for imports and references to potentially unused components."
echo ""

# Define components to search for
COMPONENTS=(
  "GitHubAuthScreen"
  "GoogleAuthScreen"
  "CreditsDisplay"
  "TranslateIcon"
)

# Define search patterns
PATTERNS=(
  "import.*%s"
  "from.*%s"
  "dynamic.*%s"
  "\"%s\""
  "<%s"
  "component=\"%s\""
  "components\.%s"
)

# Function to search for a component
search_component() {
  local component=$1
  local found=false
  
  echo -e "${YELLOW}Searching for component: ${component}${NC}"
  
  for pattern in "${PATTERNS[@]}"; do
    # Replace %s with the component name
    search_pattern=$(printf "$pattern" "$component")
    
    # Run the search
    results=$(grep -r --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" "$search_pattern" . 2>/dev/null | grep -v "find-component-usage.sh")
    
    if [ -n "$results" ]; then
      found=true
      echo -e "${GREEN}Found references with pattern '$search_pattern':${NC}"
      echo "$results"
      echo ""
    fi
  }
  
  if [ "$found" = false ]; then
    echo -e "${RED}No references found for $component${NC}"
    echo -e "${YELLOW}This component appears to be unused and may be a candidate for removal or documentation.${NC}"
  fi
  
  echo "----------------------------------------"
}

# Main execution
for component in "${COMPONENTS[@]}"; do
  search_component "$component"
done

echo -e "${BLUE}=== Search Complete ===${NC}"
echo "If components show as having no references, verify manually before removing."
echo "Consider adding TODO comments to components that are intended for future use."

# Make the script executable with: chmod +x scripts/find-component-usage.sh
# Run with: ./scripts/find-component-usage.sh
