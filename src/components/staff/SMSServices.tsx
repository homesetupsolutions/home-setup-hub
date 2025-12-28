import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, History, Users, Loader2, Clock, CheckCircle, XCircle } from "lucide-react";

interface SMSMessage {
  id: string;
  to: string;
  message: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  sentAt: string;
  type: 'individual' | 'bulk';
}

// Mock SMS history data
const mockSMSHistory: SMSMessage[] = [
  {
    id: '1',
    to: '+1 (555) 123-4567',
    message: 'Your appointment is confirmed for tomorrow at 2:00 PM.',
    status: 'delivered',
    sentAt: new Date(Date.now() - 3600000).toISOString(),
    type: 'individual',
  },
  {
    id: '2',
    to: '+1 (555) 987-6543',
    message: 'Reminder: Your service appointment is in 1 hour.',
    status: 'sent',
    sentAt: new Date(Date.now() - 7200000).toISOString(),
    type: 'individual',
  },
  {
    id: '3',
    to: 'All Customers (25)',
    message: 'Holiday special! 20% off all services this week.',
    status: 'delivered',
    sentAt: new Date(Date.now() - 86400000).toISOString(),
    type: 'bulk',
  },
];

const messageTemplates = [
  { id: 'reminder', label: 'Appointment Reminder', message: 'Hi {name}, this is a reminder that your appointment is scheduled for {date} at {time}.' },
  { id: 'confirm', label: 'Booking Confirmation', message: 'Hi {name}, your booking has been confirmed for {date} at {time}. See you soon!' },
  { id: 'followup', label: 'Follow Up', message: 'Hi {name}, thank you for choosing Home Setup Solutions! We hope you were satisfied with our service.' },
  { id: 'custom', label: 'Custom Message', message: '' },
];

const SMSServices = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [smsHistory, setSmsHistory] = useState<SMSMessage[]>(mockSMSHistory);

  // Bulk SMS state
  const [bulkRecipients, setBulkRecipients] = useState<'all' | 'staff' | 'customers'>('customers');
  const [bulkMessage, setBulkMessage] = useState("");

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setMessage(template.message);
    }
  };

  const handleSendSMS = async () => {
    if (!phoneNumber.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number and message",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    // Simulate sending SMS
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newMessage: SMSMessage = {
      id: Date.now().toString(),
      to: phoneNumber,
      message: message,
      status: 'sent',
      sentAt: new Date().toISOString(),
      type: 'individual',
    };

    setSmsHistory([newMessage, ...smsHistory]);
    setPhoneNumber("");
    setMessage("");
    setSelectedTemplate("");
    setSending(false);

    toast({
      title: "SMS Sent",
      description: "Your message has been sent successfully.",
    });
  };

  const handleSendBulkSMS = async () => {
    if (!bulkMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const recipientCount = bulkRecipients === 'all' ? 35 : bulkRecipients === 'customers' ? 25 : 10;
    const newMessage: SMSMessage = {
      id: Date.now().toString(),
      to: `${bulkRecipients === 'all' ? 'All Users' : bulkRecipients === 'customers' ? 'All Customers' : 'All Staff'} (${recipientCount})`,
      message: bulkMessage,
      status: 'pending',
      sentAt: new Date().toISOString(),
      type: 'bulk',
    };

    setSmsHistory([newMessage, ...smsHistory]);
    setBulkMessage("");
    setSending(false);

    toast({
      title: "Bulk SMS Queued",
      description: `Messages are being sent to ${recipientCount} recipients.`,
    });
  };

  const getStatusBadge = (status: SMSMessage['status']) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" /> Delivered</Badge>;
      case 'sent':
        return <Badge variant="secondary" className="gap-1"><Send className="h-3 w-3" /> Sent</Badge>;
      case 'pending':
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Failed</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          SMS Services
        </CardTitle>
        <CardDescription>
          Send SMS messages to customers and staff
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="send" className="gap-2">
              <Send className="h-4 w-4" />
              Send SMS
            </TabsTrigger>
            <TabsTrigger value="bulk" className="gap-2">
              <Users className="h-4 w-4" />
              Bulk SMS
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template">Message Template</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {messageTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {message.length}/160 characters
                </p>
              </div>
              <Button onClick={handleSendSMS} disabled={sending} className="gap-2">
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send SMS
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Recipients</Label>
                <Select value={bulkRecipients} onValueChange={(v) => setBulkRecipients(v as 'all' | 'staff' | 'customers')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customers">All Customers</SelectItem>
                    <SelectItem value="staff">All Staff</SelectItem>
                    <SelectItem value="all">Everyone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bulkMessage">Message</Label>
                <Textarea
                  id="bulkMessage"
                  placeholder="Type your bulk message here..."
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  {bulkMessage.length}/160 characters
                </p>
              </div>
              <Button onClick={handleSendBulkSMS} disabled={sending} className="gap-2">
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
                Send Bulk SMS
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {smsHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No messages sent yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>To</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {smsHistory.map((sms) => (
                    <TableRow key={sms.id}>
                      <TableCell className="font-medium">{sms.to}</TableCell>
                      <TableCell className="max-w-xs truncate">{sms.message}</TableCell>
                      <TableCell>{getStatusBadge(sms.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(sms.sentAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SMSServices;
