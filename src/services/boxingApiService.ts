import {SportEvent} from '../types/event';

const API_KEY = '580799';
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json';

const BROADCASTERS = {
  DAZN: {
    name: 'DAZN',
    logo: 'https://www.thesportsdb.com/images/media/channel/logo/ytaua51657045521.png'
  },
  CANAL_PLUS: {
    name: 'CANAL+',
    logo: 'https://www.thesportsdb.com/images/media/channel/logo/rswyxx1436720242.png'
  },
  NETFLIX: {
    name: 'Netflix',
    logo: 'https://www.thesportsdb.com/images/media/channel/logo/Netflix.png'
  },
  PRIME: {
    name: 'Prime Video',
    logo: 'https://www.thesportsdb.com/images/media/channel/logo/Amazon_Prime_Video.png'
  }
};

const BOXING_LEAGUE = {
  name: 'Boxe Anglaise',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Boxing_pictogram.svg/640px-Boxing_pictogram.svg.png'
};

export const fetchBoxingEvents = async (): Promise<SportEvent[]> => {
  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/eventsnextleague.php?id=4445`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    if (!data.events) return [];

    return data.events
      .filter((event: any) => {
        const now = new Date();
        const eventDate = new Date(event.strTimestamp);
        return eventDate > now;
      })
      .map((event: any) => {
        const startTime = new Date(event.strTimestamp);
        startTime.setHours(startTime.getHours() + 1);

        const [boxer1, boxer2] = event.strEvent.split(' vs ').map((name: string) => name.trim());

        // Déterminer le diffuseur
        let broadcaster;

        // Cas spécial pour Jake Paul vs Mike Tyson
        if (event.strEvent.toLowerCase().includes('jake paul') &&
            event.strEvent.toLowerCase().includes('mike tyson')) {
          broadcaster = BROADCASTERS.NETFLIX;
        } else if (event.strTVStation) {
          const tvStation = event.strTVStation.toLowerCase();
          if (tvStation.includes('netflix')) {
            broadcaster = BROADCASTERS.NETFLIX;
          } else if (tvStation.includes('canal+') || tvStation.includes('canal +')) {
            broadcaster = BROADCASTERS.CANAL_PLUS;
          } else if (tvStation.includes('dazn')) {
            broadcaster = BROADCASTERS.DAZN;
          } else if (tvStation.includes('prime') || tvStation.includes('amazon')) {
            broadcaster = BROADCASTERS.PRIME;
          }
        }

        const eventData: SportEvent = {
          id: event.idEvent,
          title: event.strEvent,
          sportType: 'Boxing',
          startTime: startTime.toISOString(),
          endTime: new Date(startTime.getTime() + 3 * 60 * 60 * 1000).toISOString(),
          league: BOXING_LEAGUE,
          teams: {
            home: boxer1,
            home_logo: `https://www.thesportsdb.com/images/media/player/thumb/${event.strHomeTeam || boxer1.toLowerCase().replace(/\s+/g, '')}.jpg`,
            away: boxer2,
            away_logo: `https://www.thesportsdb.com/images/media/player/thumb/${event.strAwayTeam || boxer2.toLowerCase().replace(/\s+/g, '')}.jpg`
          },
          venue: event.strVenue,
          status: 'upcoming'
        };

        // Ajouter les informations de diffusion si un diffuseur a été trouvé
        if (broadcaster) {
          eventData.broadcastChannel = broadcaster.name;
          eventData.broadcastLogo = broadcaster.logo;
        }

        return eventData;
      })
      .sort((a: SportEvent, b: SportEvent) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  } catch (error) {
    console.error('Error fetching boxing events:', error);
    return [];
  }
};
