export interface SportEvent {
  id: string;
  title: string;
  sportType: string;
  startTime: string;
  endTime: string;
  league?: {
    name: string;
    logo: string;
  };
  teams: {
    home: string;
    home_logo: string;
    away: string;
    away_logo: string;
  };
  venue?: string;
  status: 'upcoming' | 'live' | 'completed';
  score?: string;
  broadcastChannel?: string;
  broadcastLogo?: string;
}

export interface F1Event extends SportEvent {
  location: string;
  sessionType: 'sprint_shootout' | 'sprint_race' | 'qualifying' | 'race';
}

export interface SportPreference {
  sportType: string;
  enabled: boolean;
  notificationsEnabled: boolean;
}
