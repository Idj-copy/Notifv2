import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {SportEvent} from '../types/event';
import {addToCalendar} from '../services/calendarService';

interface CalendarDialogProps {
  event: SportEvent;
  open: boolean;
  onClose: () => void;
}

export default function CalendarDialog({ event, open, onClose }: CalendarDialogProps) {
  const handleAddToCalendar = (reminderMinutes: number) => {
    addToCalendar(event, reminderMinutes);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle>Ajouter au calendrier : {event.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-400">
            Choisissez quand vous souhaitez être rappelé de l'événement
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={() => handleAddToCalendar(24 * 60)}
              className="justify-start"
            >
              1 jour avant
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddToCalendar(60)}
              className="justify-start"
            >
              1 heure avant
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddToCalendar(15)}
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
