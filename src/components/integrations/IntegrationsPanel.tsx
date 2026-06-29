import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  CreditCard, 
  Phone, 
  Calendar,
  RefreshCw,
  Settings
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'pending';
  icon: React.ComponentType<{ className?: string }>;
  configUrl?: string;
  features: string[];
}

const integrations: Integration[] = [
  {
    id: 'square',
    name: 'Square CRM',
    description: 'Customer management, payments, and booking',
    status: 'connected',
    icon: CreditCard,
    configUrl: 'https://squareup.com/dashboard',
    features: [
      'Customer profiles',
      'Payment processing',
      'Appointment booking',
      'Transaction history',
    ],
  },
  {
    id: 'callcentric',
    name: 'Call Centric SMS',
    description: 'SMS texting and notifications',
    status: 'connected',
    icon: Phone,
    features: [
      'Send SMS messages',
      'Appointment reminders',
      'Booking confirmations',
      'On-the-way alerts',
    ],
  },
  {
    id: 'm365',
    name: 'Microsoft 365',
    description: 'Calendar sync and email integration',
    status: 'pending',
    icon: Calendar,
    configUrl: 'https://admin.microsoft.com',
    features: [
      'Calendar sync',
      'Email notifications',
      'Teams integration',
      'OneDrive storage',
    ],
  },
];

export function IntegrationsPanel() {
  const [refreshing, setRefreshing] = useState<string | null>(null);

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="default" className="gap-1 bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle2 className="h-3 w-3" />
            Connected
          </Badge>
        );
      case 'disconnected':
        return (
          <Badge variant="secondary" className="gap-1">
            <XCircle className="h-3 w-3" />
            Disconnected
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="gap-1 border-yellow-500/50 text-yellow-500">
            <Settings className="h-3 w-3" />
            Setup Required
          </Badge>
        );
    }
  };

  const handleRefresh = async (integrationId: string) => {
    setRefreshing(integrationId);
    // Simulate API call to check integration status
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Integrations</h2>
        <p className="text-muted-foreground">
          Manage your connected services and third-party integrations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    integration.status === 'connected' 
                      ? 'bg-green-500/10' 
                      : integration.status === 'pending'
                      ? 'bg-yellow-500/10'
                      : 'bg-muted'
                  }`}>
                    <integration.icon className={`h-5 w-5 ${
                      integration.status === 'connected' 
                        ? 'text-green-500' 
                        : integration.status === 'pending'
                        ? 'text-yellow-500'
                        : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    {getStatusBadge(integration.status)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRefresh(integration.id)}
                  disabled={refreshing === integration.id}
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing === integration.id ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <CardDescription className="mt-2">
                {integration.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Features:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {integration.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                {integration.configUrl && (
                  <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                    <a href={integration.configUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Open Dashboard
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Integration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-500">
                {integrations.filter(i => i.status === 'connected').length}
              </p>
              <p className="text-sm text-muted-foreground">Connected</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-500">
                {integrations.filter(i => i.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending Setup</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-muted-foreground">
                {integrations.filter(i => i.status === 'disconnected').length}
              </p>
              <p className="text-sm text-muted-foreground">Disconnected</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Numbers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Numbers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Main Phone Line</p>
                <p className="text-sm text-muted-foreground">Toll-free calls</p>
              </div>
              <p className="font-mono font-bold">1-833-230-2933</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">SMS / Text Line</p>
                <p className="text-sm text-muted-foreground">Call Centric</p>
              </div>
              <p className="font-mono font-bold">1-778-989-4357</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
