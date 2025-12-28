import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, RefreshCw, Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, Settings } from 'lucide-react';
import { use3CX } from '@/hooks/use3CX';
import { format, formatDistanceToNow } from 'date-fns';

const statusColors: Record<string, string> = {
  initiated: 'bg-blue-500/10 text-blue-500',
  ringing: 'bg-yellow-500/10 text-yellow-500',
  answered: 'bg-green-500/10 text-green-500',
  completed: 'bg-muted text-muted-foreground',
  missed: 'bg-red-500/10 text-red-500',
  failed: 'bg-destructive/10 text-destructive',
};

const directionIcons: Record<string, typeof PhoneIncoming> = {
  inbound: PhoneIncoming,
  outbound: PhoneOutgoing,
};

function formatDuration(seconds?: number): string {
  if (!seconds) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface PhoneTabProps {
  threeCXUrl?: string;
}

export function PhoneTab({ threeCXUrl }: PhoneTabProps) {
  const [subTab, setSubTab] = useState('softphone');
  const [dialNumber, setDialNumber] = useState('');
  const [configUrl, setConfigUrl] = useState(threeCXUrl || '');
  const [savedUrl, setSavedUrl] = useState(threeCXUrl || '');
  
  const { 
    isCallActive, 
    currentCall, 
    callLogs, 
    loadingLogs, 
    initiateCall, 
    endCall, 
    fetchCallLogs 
  } = use3CX();

  useEffect(() => {
    fetchCallLogs();
  }, [fetchCallLogs]);

  // Load saved 3CX URL from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('3cx_webclient_url');
    if (stored) {
      setSavedUrl(stored);
      setConfigUrl(stored);
    }
  }, []);

  const handleSaveConfig = () => {
    localStorage.setItem('3cx_webclient_url', configUrl);
    setSavedUrl(configUrl);
  };

  const handleDial = () => {
    if (dialNumber.trim()) {
      initiateCall(dialNumber.trim());
      setDialNumber('');
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              3CX Phone System
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Make calls and view call history
            </CardDescription>
          </div>
          {isCallActive && currentCall && (
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/10 text-green-500 animate-pulse">
                <PhoneCall className="h-3 w-3 mr-1" />
                Call Active
              </Badge>
              <Button variant="destructive" size="sm" onClick={() => endCall()}>
                End Call
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={subTab} onValueChange={setSubTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
            <TabsTrigger value="softphone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Softphone
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Call Logs
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="softphone" className="space-y-6">
            {/* Quick Dial */}
            <div className="flex gap-2 max-w-md">
              <Input
                placeholder="Enter phone number..."
                value={dialNumber}
                onChange={(e) => setDialNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDial()}
                className="flex-1"
              />
              <Button onClick={handleDial} disabled={!dialNumber.trim()}>
                <PhoneCall className="h-4 w-4 mr-2" />
                Dial
              </Button>
            </div>

            {/* Embedded 3CX Web Client */}
            {savedUrl ? (
              <div className="relative w-full aspect-[4/3] max-h-[600px] rounded-lg overflow-hidden border border-border bg-muted">
                <iframe
                  src={savedUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="microphone; camera; autoplay"
                  title="3CX Web Client"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Phone className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Configure 3CX Web Client</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Go to the Settings tab and enter your 3CX Web Client URL to embed the softphone here.
                </p>
                <Button variant="outline" onClick={() => setSubTab('settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Open Settings
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="logs">
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={fetchCallLogs} disabled={loadingLogs}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingLogs ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {loadingLogs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : callLogs.length === 0 ? (
              <div className="text-center py-12">
                <Phone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No call logs yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Direction</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {callLogs.map((log) => {
                      const DirectionIcon = directionIcons[log.direction] || Phone;
                      return (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <DirectionIcon className={`h-4 w-4 ${log.direction === 'inbound' ? 'text-blue-500' : 'text-green-500'}`} />
                              <span className="capitalize text-sm">{log.direction}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {log.customer_name || 'Unknown'}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {log.phone_number}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColors[log.status] || ''}>
                              {log.status === 'missed' && <PhoneMissed className="h-3 w-3 mr-1" />}
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDuration(log.duration_seconds)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-lg space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">3CX Web Client URL</label>
                <p className="text-sm text-muted-foreground">
                  Enter your 3CX Web Client URL to embed the softphone. You can find this in your 3CX Management Console.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://your-company.3cx.us:5001/webclient/"
                    value={configUrl}
                    onChange={(e) => setConfigUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSaveConfig} disabled={!configUrl.trim()}>
                    Save
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <h4 className="font-medium text-foreground mb-2">How to find your 3CX Web Client URL</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Log in to your 3CX Management Console</li>
                  <li>Go to System → Web Client</li>
                  <li>Copy the Web Client URL</li>
                  <li>Paste it above and click Save</li>
                </ol>
              </div>

              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <h4 className="font-medium text-foreground mb-2">Click-to-Call Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Phone numbers in the Customers tab now have click-to-call functionality. 
                  When you click a phone number, it will automatically:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                  <li>Open the 3CX app (if installed) to initiate the call</li>
                  <li>Log the call in the Call Logs tab</li>
                  <li>Fall back to your default phone app if 3CX is not available</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
