"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  ArrowRight,
  Map
} from "lucide-react"
import { CpuChipIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"

export function AllowedServicesSection() {
  const { accessLevel } = useAuth()

  // Only show for limited access users
  if (accessLevel !== 'limited') {
    return null
  }

  const allowedServices = [
    {
      id: 'documentation',
      title: 'Documentation',
      description: 'Explore guides, tutorials, and API references',
      icon: BookOpen,
      href: '/documentation',
      color: 'bg-blue-100 text-blue-600',
      available: true,
      features: ['API Guides', 'Tutorials', 'Best Practices', 'Examples']
    },
    {
      id: 'maps',
      title: 'Maps',
      description: 'Access mapping services and location-based features',
      icon: Map,
      href: '/maps',
      color: 'bg-orange-100 text-orange-600',
      available: true,
      features: ['Map Studio', 'Location Services', 'Geocoding', 'Route Planning']
    },
    {
      id: 'ai-studio',
      title: 'AI Studio',
      description: 'Explore AI models and capabilities',
      icon: CpuChipIcon,
      href: '/ai-studio',
      color: 'bg-purple-100 text-purple-600',
      available: true,
      features: ['Model Catalog', 'API Testing', 'Documentation', 'Sample Code']
    }
  ]

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Available Services</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Services you can access with your current profile status
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {allowedServices.map((service) => {
          const Icon = service.icon
          return (
            <Card 
              key={service.id}
              className="hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${service.color} flex items-center justify-center`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center">
                      <CardTitle className="text-lg leading-none">{service.title}</CardTitle>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Available
                  </Badge>
                </div>
                <CardDescription className="text-sm text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">What's included:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <Button 
                  asChild
                  className="w-full group-hover:shadow-md transition-all duration-200"
                  variant="default"
                >
                  <Link href={service.href} className="flex items-center justify-center">
                    Explore {service.title}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
} 