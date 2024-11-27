export interface SportEvent {
    id: string;
    title: string;
    sportType: string;
    startTime: Date;
    endTime: Date;
    venue?: string;
    broadcastChannels: string[];
    streamingLinks?: string[];
    teams?: {
        home: string;
        away: string;
    };
    status: 'upcoming' | 'live' | 'completed';
    imageUrl?: string;
}

export interface SportPreference {
    sportType: string;
    enabled: boolean;
    notificationsEnabled: boolean;
}