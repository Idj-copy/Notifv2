import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {SportEvent} from '../types/event';
import {requestNotificationPermission, scheduleNotification} from '../services/notificationService';

interface NotificationDialogProps {
  event: SportEvent;
  open: boolean;
  onClose: () => void;
}

export default function NotificationDialog({ event, open, onClose }: NotificationDialogProps) {
  const handleNotificationRequest = async (minutes: number) => {
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      const eventDate = new Date(event.startTime);
      const notificationDate = new Date(eventDate.getTime() - minutes * 60 * 1000);

      scheduleNotification(event, notificationDate);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle>Définir un rappel pour {event.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-400">
            Quand souhaitez-vous être notifié ?
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={() => handleNotificationRequest(24 * 60)}
              className="justify-start"
            >
              1 jour avant
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNotificationRequest(60)}
              className="justify-start"
            >
              1 heure avant
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNotificationRequest(15)}
              className="justify-start"
            >
              15 minutes avant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
