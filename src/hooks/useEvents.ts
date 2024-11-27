import {useEffect, useState} from 'react';
import {SportEvent} from '../types/event';
import {getEvents} from '../services/eventService';

export function useEvents() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    let retryTimeout: NodeJS.Timeout;

    const loadEvents = async () => {
      if (!mounted) return;

      try {
        setLoading(true);
        const allEvents = await getEvents();

        if (!mounted) return;

        if (allEvents.length === 0 && retryCount < 3) {
          retryTimeout = setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000 * (retryCount + 1));
          return;
        }

        const now = new Date();
        const filteredEvents = allEvents.filter(event => {
          const eventStart = new Date(event.startTime);
          const twoHoursAfterStart = new Date(eventStart.getTime() + 2 * 60 * 60 * 1000);
          return twoHoursAfterStart > now;
        });

        setEvents(filteredEvents);
        setError(null);
        setRetryCount(0);
      } catch (err) {
        if (!mounted) return;
        setError('Impossible de charger les événements. Veuillez réessayer plus tard.');
        console.error('Erreur lors du chargement des événements:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadEvents();
    const refreshInterval = setInterval(loadEvents, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(refreshInterval);
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [retryCount]);

  return { events, loading, error };
}
