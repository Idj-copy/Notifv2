import {SportEvent} from '../types/event';

const CUSTOM_EVENTS_KEY = 'sportify_custom_events';

export const saveCustomEvent = (event: SportEvent) => {
  const existingEvents = getCustomEvents();
  const newEvent = {
    ...event,
    id: `custom-${Date.now()}`,
    league: {
      //name:( event && (event.subcategory || event.sportType)) || "no name",
      name: "no name",
      logo: getDefaultLogoForSport(event.sportType)
    },
    teams: {
      ...event.teams,
      home_logo: event.teams.home_logo || getDefaultFighterImage(),
      away_logo: event.teams.away_logo || getDefaultFighterImage()
    },
    broadcastLogo: event.broadcastChannel ? getBroadcastLogo(event.broadcastChannel) : undefined
  };

  const updatedEvents = [...existingEvents, newEvent];
  localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(updatedEvents));
};

const getDefaultLogoForSport = (sportType: string): string => {
  switch (sportType.toLowerCase()) {
    case 'football':
      return 'https://www.thesportsdb.com/images/media/league/badge/zcafvy1719637069.png';
    case 'formula 1':
      return 'https://www.thesportsdb.com/images/media/league/badge/g8cofl1513623681.png';
    case 'mma':
      return 'https://www.thesportsdb.com/images/media/league/badge/uvwxyx1471773334.png';
    case 'boxing':
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Boxing_pictogram.svg/640px-Boxing_pictogram.svg.png';
    default:
      return '';
  }
};

const getDefaultFighterImage = (): string => {
  return 'https://www.thesportsdb.com/images/media/player/thumb/placeholder.png';
};

const getBroadcastLogo = (channel: string): string => {
  const channelMap: { [key: string]: string } = {
    'bein sports': 'https://www.thesportsdb.com/images/media/channel/logo/BeIn_Sports_HD_1_France.png',
    'dazn': 'https://www.thesportsdb.com/images/media/channel/logo/ytaua51657045521.png',
    'canal+': 'https://www.thesportsdb.com/images/media/channel/logo/rswyxx1436720242.png',
    'netflix': 'https://www.thesportsdb.com/images/media/channel/logo/Netflix.png',
    'prime video': 'https://www.thesportsdb.com/images/media/channel/logo/Amazon_Prime_Video.png',
    'espn+': 'https://www.thesportsdb.com/images/media/channel/logo/ESPN_Plus.png',
    'ufc fight pass': 'https://www.thesportsdb.com/images/media/channel/logo/UFC_Fight_Pass.png'
  };

  const normalizedChannel = channel.toLowerCase();
  return channelMap[normalizedChannel] || '';
};

export const getCustomEvents = (): SportEvent[] => {
  try {
    const eventsJson = localStorage.getItem(CUSTOM_EVENTS_KEY);
    return eventsJson ? JSON.parse(eventsJson) : [];
  } catch (error) {
    console.error('Error reading custom events:', error);
    return [];
  }
};

export const deleteCustomEvent = (eventId: string) => {
  const events = getCustomEvents();
  const updatedEvents = events.filter(event => event.id !== eventId);
  localStorage.setItem(CUSTOM_EVENTS_KEY, JSON.stringify(updatedEvents));
};
