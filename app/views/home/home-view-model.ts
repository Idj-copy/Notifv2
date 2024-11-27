import { Observable } from '@nativescript/core';
import { EventsService } from '../../services/events.service';
import { SportEvent } from '../../models/event.model';

export class HomeViewModel extends Observable {
    private eventsService: EventsService;
    private _liveEvents: SportEvent[] = [];
    private _upcomingEvents: SportEvent[] = [];

    constructor() {
        super();
        this.eventsService = new EventsService();
        this.loadEvents();
    }

    get liveEvents(): SportEvent[] {
        return this._liveEvents;
    }

    get upcomingEvents(): SportEvent[] {
        return this._upcomingEvents;
    }

    loadEvents() {
        this._liveEvents = this.eventsService.filterEvents(null, 'live');
        this._upcomingEvents = this.eventsService.filterEvents(null, 'upcoming');
        
        this.notifyPropertyChange('liveEvents', this._liveEvents);
        this.notifyPropertyChange('upcomingEvents', this._upcomingEvents);
    }

    onEventTap(args: any) {
        const event = args.view.bindingContext as SportEvent;
        // Navigate to event details page
        // TODO: Implement navigation
    }
}