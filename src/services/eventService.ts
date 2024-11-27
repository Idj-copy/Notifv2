import {SportEvent} from '../types/event';
import {fetchLigue1Matches} from './footballApiService';
import {fetchF1Events} from './f1ApiService';
import {fetchUFCEvents} from './ufcApiService';
import {fetchBoxingEvents} from './boxingApiService';
import {getCustomEvents} from './customEventsService';

export const getEvents = async (): Promise<SportEvent[]> => {
  try {
    const [footballMatches, f1Events, ufcEvents, boxingEvents] = await Promise.all([
      fetchLigue1Matches(),
      fetchF1Events(),
      fetchUFCEvents(),
      fetchBoxingEvents()
    ]);

    const customEvents = getCustomEvents();

    // Filtrer les événements personnalisés passés
    const now = new Date();
    const validCustomEvents = customEvents.filter(event => {
      const eventStart = new Date(event.startTime);
      const twoHoursAfterStart = new Date(eventStart.getTime() + 2 * 60 * 60 * 1000);
      return twoHoursAfterStart > now;
    });

    return [...validCustomEvents, ...footballMatches, ...f1Events, ...ufcEvents, ...boxingEvents].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};
