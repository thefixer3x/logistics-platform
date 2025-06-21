import { Card, CardHeader, CardTitle, CardDescription } from \"@/components/ui/card\"
import { 
  MapPin, Shield, BarChart3, Gauge, Cloud, Smartphone 
} from \"lucide-react\"

export function FeaturesGrid() {
  const features = [
    {
      icon: MapPin,
      title: \"Real-time GPS Tracking\",
      description: \"Track your entire fleet in real-time with precise location updates and route history\"
    },
    {
      icon: Shield,
      title: \"Advanced Security\",
      description: \"Multi-factor authentication, role-based access control, and end-to-end encryption\"
    },
    {
      icon: BarChart3,
      title: \"SLA Monitoring\",
      description: \"Automated SLA tracking with real-time alerts and comprehensive performance reports\"
    },
    {
      icon: Gauge,
      title: \"Performance Analytics\",
      description: \"Deep insights into driver performance, fuel efficiency, and route optimization\"
    },
    {
      icon: Cloud,
      title: \"Cloud Infrastructure\",
      description: \"Scalable cloud-based platform with 99.9% uptime and automatic backups\"
    },
    {
      icon: Smartphone,
      title: \"Mobile Apps\",
      description: \"Native mobile applications for iOS and Android with offline support\"
    }
  ]

  return (
    <section className=\"py-20 px-4\">
      <div className=\"max-w-7xl mx-auto\">
        <div className=\"text-center mb-12\">
          <h2 className=\"text-3xl font-bold text-gray-900 mb-4\">
            Everything You Need to Manage Your Fleet
          </h2>
          <p className=\"text-lg text-gray-600\">
            Comprehensive features designed for drivers, supervisors, and contractors
          </p>
        </div>

        <div className=\"grid md:grid-cols-2 lg:grid-cols-3 gap-6\">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className=\"hover:shadow-lg transition-shadow\">
                <CardHeader>
                  <Icon className=\"w-10 h-10 text-blue-600 mb-4\" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
