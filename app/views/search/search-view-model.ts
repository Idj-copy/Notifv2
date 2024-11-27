import { Observable } from '@nativescript/core';
import { EventsService } from '../../services/events.service';
import { SportEvent } from '../../models/event.model';

export class SearchViewModel extends Observable {
    private eventsService: EventsService;
    private _searchQuery: string = '';
    private _showFilters: boolean = false;
    private _selectedSport: string = 'all';
    private _filteredEvents: SportEvent[] = [];
    private allEvents: SportEvent[] = [];

    constructor() {
        super();
        this.eventsService = new EventsService();
        this.allEvents = this.eventsService.getEvents();
        this.filterEvents();
    }

    get searchQuery(): string {
        return this._searchQuery;
    }

    set searchQuery(value: string) {
        if (this._searchQuery !== value) {
            this._searchQuery = value;
            this.notifyPropertyChange('searchQuery', value);
            this.filterEvents();
        }
    }

    get showFilters(): boolean {
        return this._showFilters;
    }

    set showFilters(value: boolean) {
        if (this._showFilters !== value) {
            this._showFilters = value;
            this.notifyPropertyChange('showFilters', value);
        }
    }

    get selectedSport(): string {
        return this._selectedSport;
    }

    set selectedSport(value: string) {
        if (this._selectedSport !== value) {
            this._selectedSport = value;
            this.notifyPropertyChange('selectedSport', value);
            this.filterEvents();
        }
    }

    get filteredEvents(): SportEvent[] {
        return this._filteredEvents;
    }

    set filteredEvents(value: SportEvent[]) {
        if (this._filteredEvents !== value) {
            this._filteredEvents = value;
            this.notifyPropertyChange('filteredEvents', value);
        }
    }

    toggleFilters() {
        this.showFilters = !this.showFilters;
    }

    onFilterTap(args: any) {
        const button = args.object;
        this.selectedSport = button.text === 'All' ? 'all' : button.text;
    }

    onSearchTextChange(args: any) {
        this.searchQuery = args.object.text;
    }

    onSearch() {
        this.filterEvents();
    }

    private filterEvents() {
        let filtered = this.allEvents;

        // Apply sport filter
        if (this.selectedSport !== 'all') {
            filtered = filtered.filter(event => event.sportType === this.selectedSport);
        }

        // Apply search query
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(event => 
                event.title.toLowerCase().includes(query) ||
                event.venue?.toLowerCase().includes(query) ||
                event.sportType.toLowerCase().includes(query)
            );
        }

        this.filteredEvents = filtered;
    }

    onEventTap(args: any) {
        const event = args.view.bindingContext as SportEvent;
        // TODO: Navigate to event details
        console.log('Selected event:', event.title);
    }
}