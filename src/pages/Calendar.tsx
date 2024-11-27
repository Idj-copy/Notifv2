import {useState} from 'react';
import {useEvents} from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import moment from 'moment';

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const { events, loading, error } = useEvents();

  const filteredEvents = events.filter(event =>
    moment(event.startTime).format('YYYY-MM-DD') === selectedDate
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-gray-800 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">Event Calendar</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-100">
          Events on {moment(selectedDate).format('MMMM D, YYYY')}
        </h3>

        {filteredEvents.length === 0 ? (
          <p className="text-gray-400">No events scheduled for this date.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
