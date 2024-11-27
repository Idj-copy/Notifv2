import { Observable } from '@nativescript/core';
import { SportEvent, SportPreference } from '../models/event.model';

export class EventsService extends Observable {
    private events: SportEvent[] = [
        {
            id: '1',
            title: 'UFC 300: Main Event',
            sportType: 'MMA',
            startTime: new Date('2024-04-20T22:00:00Z'),
            endTime: new Date('2024-04-21T01:00:00Z'),
            venue: 'T-Mobile Arena, Las Vegas',
            broadcastChannels: ['ESPN+', 'PPV'],
            status: 'upcoming'
        },
        {
            id: '2',
            title: 'Champions League Final',
            sportType: 'Football',
            startTime: new Date('2024-06-01T19:00:00Z'),
            endTime: new Date('2024-06-01T21:00:00Z'),
            venue: 'Wembley Stadium, London',
            broadcastChannels: ['BT Sport', 'CBS'],
            teams: {
                home: 'TBD',
                away: 'TBD'
            },
            status: 'upcoming'
        }
    ];

    getEvents(): SportEvent[] {
        return this.events;
    }

    getEventById(id: string): SportEvent | undefined {
        return this.events.find(event => event.id === id);
    }

    filterEvents(sportType?: string, status?: string): SportEvent[] {
        return this.events.filter(event => 
            (!sportType || event.sportType === sportType) &&
            (!status || event.status === status)
        );
    }
}