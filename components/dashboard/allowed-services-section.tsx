"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Calculator, 
  Brain, 
  ArrowRight, 
  ExternalLink,
  FileText,
  Zap
} from "lucide-react"
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
      id: 'cost-estimator',
      title: 'Cost Estimator',
      description: 'Calculate costs for your cloud infrastructure',
      icon: Calculator,
      href: '/cost-estimator',
      color: 'bg-green-100 text-green-600',
      available: true,
      features: ['Resource Pricing', 'Cost Planning', 'Budget Estimation', 'Savings Calculator']
    },
    {
      id: 'ai-studio',
      title: 'AI Studio',
      description: 'Explore AI models and capabilities',
      icon: Brain,
      href: '/ai-studio',
      color: 'bg-purple-100 text-purple-600',
      available: true,
      features: ['Model Catalog', 'API Testing', 'Documentation', 'Sample Code']
    }
  ]

  return (
    <div className="space-y-6">
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
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${service.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Available
                    </Badge>
                  </div>
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

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Zap className="h-5 w-5 text-blue-600 mr-2" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common tasks you can perform right now
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" size="sm" asChild className="h-auto p-3 flex-col space-y-1">
              <Link href="/documentation/getting-started">
                <FileText className="h-4 w-4" />
                <span className="text-xs">Getting Started</span>
              </Link>
            </Button>
            
            <Button variant="outline" size="sm" asChild className="h-auto p-3 flex-col space-y-1">
              <Link href="/cost-estimator">
                <Calculator className="h-4 w-4" />
                <span className="text-xs">Estimate Costs</span>
              </Link>
            </Button>
            
            <Button variant="outline" size="sm" asChild className="h-auto p-3 flex-col space-y-1">
              <Link href="/ai-studio/models">
                <Brain className="h-4 w-4" />
                <span className="text-xs">Browse Models</span>
              </Link>
            </Button>
            
            <Button variant="outline" size="sm" asChild className="h-auto p-3 flex-col space-y-1">
              <Link href="/documentation/api" target="_blank" className="flex flex-col items-center space-y-1">
                <ExternalLink className="h-4 w-4" />
                <span className="text-xs">API Docs</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>


    </div>
  )
} 