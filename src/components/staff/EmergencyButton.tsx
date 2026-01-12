import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function EmergencyButton() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEmergencyCall = () => {
    // Dial the toll-free number with extension 9
    window.location.href = 'tel:18332302933,9';
  };

  return (
    <>
      {/* Fixed Emergency Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <Button
          onClick={() => setShowConfirm(true)}
          variant="destructive"
          size="lg"
          className="rounded-full h-14 w-14 p-0 shadow-lg hover:scale-110 transition-transform animate-pulse"
        >
          <Phone className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Emergency Call
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will call the emergency line at <strong>1-833-230-2933 ext. 9</strong>.
              <br /><br />
              Only use this for urgent situations that require immediate supervisor assistance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmergencyCall}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
