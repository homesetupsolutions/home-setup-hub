import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  Clock, 
  Calendar,
  Coffee,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  Users,
  RefreshCw,
  Sun,
  Moon,
  Printer,
  ClipboardList,
  Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  category: 'opening' | 'ongoing' | 'closing';
  icon: React.ElementType;
  completed: boolean;
  notes?: string;
}

const DEFAULT_CHECKLIST: Omit<ChecklistItem, 'completed' | 'notes'>[] = [
  // Opening Tasks
  { id: 'check-voicemail', title: 'Check Voicemail', description: 'Review and return any overnight voicemails', category: 'opening', icon: Phone },
  { id: 'check-email', title: 'Check Email Inbox', description: 'Review booking requests and customer inquiries', category: 'opening', icon: Mail },
  { id: 'check-sms', title: 'Check Text Messages', description: 'Reply to customer texts from 1-587-604-5127', category: 'opening', icon: MessageSquare },
  { id: 'review-schedule', title: 'Review Today\'s Schedule', description: 'Review all appointments for the day with staff', category: 'opening', icon: Calendar },
  { id: 'confirm-appointments', title: 'Send Appointment Reminders', description: 'Text/call customers with appointments today', category: 'opening', icon: Bell },
  { id: 'print-schedules', title: 'Print Staff Schedules', description: 'Print daily schedule for each technician', category: 'opening', icon: Printer },
  
  // Ongoing Tasks
  { id: 'answer-calls', title: 'Answer Incoming Calls', description: 'Use the incoming call script', category: 'ongoing', icon: Phone },
  { id: 'process-bookings', title: 'Process New Bookings', description: 'Enter all bookings into M365 calendar', category: 'ongoing', icon: ClipboardList },
  { id: 'update-crm', title: 'Update Customer Records', description: 'Add notes from calls and update contact info', category: 'ongoing', icon: Users },
  { id: 'follow-up-quotes', title: 'Follow Up on Quotes', description: 'Call customers who received quotes this week', category: 'ongoing', icon: FileText },
  
  // Closing Tasks
  { id: 'confirm-tomorrow', title: 'Confirm Tomorrow\'s Appointments', description: 'Send confirmation texts for next day', category: 'closing', icon: Calendar },
  { id: 'review-notes', title: 'Review Call Notes', description: 'Ensure all call outcomes are logged', category: 'closing', icon: FileText },
  { id: 'update-supervisor', title: 'Update Supervisor', description: 'Brief supervisor on any issues or urgent items', category: 'closing', icon: Users },
  { id: 'forward-phones', title: 'Set Phone Forwarding', description: 'Forward calls to after-hours line', category: 'closing', icon: Phone },
];

export function DailyChecklist() {
  const { toast } = useToast();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyNotes, setDailyNotes] = useState('');
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = async () => {
    setLoading(true);
    try {
      // Try to load saved checklist from localStorage (or could be from database)
      const saved = localStorage.getItem(`checklist-${today}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setChecklist(parsed.items);
        setDailyNotes(parsed.notes || '');
      } else {
        // Initialize with defaults
        setChecklist(
          DEFAULT_CHECKLIST.map(item => ({
            ...item,
            completed: false,
            notes: ''
          }))
        );
      }
    } catch (error) {
      console.error('Error loading checklist:', error);
      setChecklist(
        DEFAULT_CHECKLIST.map(item => ({
          ...item,
          completed: false,
          notes: ''
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  const saveChecklist = async (items: ChecklistItem[], notes: string) => {
    try {
      localStorage.setItem(`checklist-${today}`, JSON.stringify({ items, notes }));
    } catch (error) {
      console.error('Error saving checklist:', error);
    }
  };

  const toggleItem = (id: string) => {
    const updated = checklist.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    saveChecklist(updated, dailyNotes);
  };

  const updateItemNotes = (id: string, notes: string) => {
    const updated = checklist.map(item =>
      item.id === id ? { ...item, notes } : item
    );
    setChecklist(updated);
    saveChecklist(updated, dailyNotes);
  };

  const handleDailyNotesChange = (notes: string) => {
    setDailyNotes(notes);
    saveChecklist(checklist, notes);
  };

  const resetChecklist = () => {
    const reset = DEFAULT_CHECKLIST.map(item => ({
      ...item,
      completed: false,
      notes: ''
    }));
    setChecklist(reset);
    setDailyNotes('');
    localStorage.removeItem(`checklist-${today}`);
    toast({
      title: 'Checklist Reset',
      description: 'All items have been marked incomplete'
    });
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const openingTasks = checklist.filter(item => item.category === 'opening');
  const ongoingTasks = checklist.filter(item => item.category === 'ongoing');
  const closingTasks = checklist.filter(item => item.category === 'closing');

  const getCategoryCompletion = (items: ChecklistItem[]) => {
    const completed = items.filter(i => i.completed).length;
    return `${completed}/${items.length}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                Daily Checklist
              </CardTitle>
              <CardDescription>
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={progress === 100 ? 'default' : 'secondary'} className="text-lg px-3 py-1">
                {completedCount} / {totalCount}
              </Badge>
              <Button variant="outline" size="sm" onClick={resetChecklist}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Daily Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Opening Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              Opening Tasks
              <Badge variant="outline" className="ml-auto">{getCategoryCompletion(openingTasks)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {openingTasks.map(item => (
              <ChecklistItemRow 
                key={item.id} 
                item={item} 
                onToggle={toggleItem}
                onNotesChange={updateItemNotes}
              />
            ))}
          </CardContent>
        </Card>

        {/* Ongoing Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Ongoing Tasks
              <Badge variant="outline" className="ml-auto">{getCategoryCompletion(ongoingTasks)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ongoingTasks.map(item => (
              <ChecklistItemRow 
                key={item.id} 
                item={item} 
                onToggle={toggleItem}
                onNotesChange={updateItemNotes}
              />
            ))}
          </CardContent>
        </Card>

        {/* Closing Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Moon className="h-5 w-5 text-purple-500" />
              Closing Tasks
              <Badge variant="outline" className="ml-auto">{getCategoryCompletion(closingTasks)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {closingTasks.map(item => (
              <ChecklistItemRow 
                key={item.id} 
                item={item} 
                onToggle={toggleItem}
                onNotesChange={updateItemNotes}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Daily Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Daily Notes & Handover
          </CardTitle>
          <CardDescription>
            Important notes to pass on to the next shift or supervisor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter any important notes, issues, or items that need follow-up..."
            value={dailyNotes}
            onChange={(e) => handleDailyNotesChange(e.target.value)}
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>
    </div>
  );
}

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (id: string) => void;
  onNotesChange: (id: string, notes: string) => void;
}

function ChecklistItemRow({ item, onToggle, onNotesChange }: ChecklistItemRowProps) {
  const [showNotes, setShowNotes] = useState(false);
  const Icon = item.icon;

  return (
    <div className="space-y-2">
      <div 
        className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-accent/50 ${
          item.completed ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' : 'border-border'
        }`}
        onClick={() => onToggle(item.id)}
      >
        <Checkbox 
          checked={item.completed} 
          className="mt-0.5"
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={() => onToggle(item.id)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 flex-shrink-0 ${item.completed ? 'text-green-600' : 'text-muted-foreground'}`} />
            <span className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
              {item.title}
            </span>
          </div>
          {item.description && (
            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
          )}
        </div>
        {item.completed && (
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
