import {Card, CardContent, CardHeader} from './ui/card';
import {F1Event} from '../types/event';
import moment from 'moment';
import EventCard from './EventCard';

interface F1WeekendCardProps {
  location: string;
  events: F1Event[];
}

export default function F1WeekendCard({ location, events }: F1WeekendCardProps) {
  // Trier les événements par date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <h3 className="text-xl font-bold text-white">
          Grand Prix de {location}
        </h3>
        <p className="text-gray-400">
          {moment(events[0].startTime).format('DD')} - {moment(events[events.length - 1].startTime).format('DD MMMM YYYY')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </CardContent>
    </Card>
  );
}
