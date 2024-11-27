import {SportEvent} from '../types/event';
import {fetchWithRetry, formatApiError} from './apiService';

const UFC_LEAGUE = {
  name: 'UFC',
  logo: 'https://www.thesportsdb.com/images/media/league/badge/bewnz31717531281.png'
};

const BROADCASTERS = {
  UFC_FIGHT_PASS: {
    name: 'UFC Fight Pass',
    logo: 'https://www.thesportsdb.com/images/media/channel/logo/UFC_Fight_Pass.png'
  },
  ESPN_PLUS: {
    name: 'ESPN+',
    logo: 'https://www.thesportsdb.com/images/media/channel/logo/ESPN_Plus.png'
  }
};

export const fetchUFCEvents = async (): Promise<SportEvent[]> => {
  try {
    const data = await fetchWithRetry('/eventsnextleague.php?id=4463');

    if (!data?.events?.length) {
      console.log('Aucun événement UFC trouvé');
      return [];
    }

    // @ts-ignore
    return data.events
      .filter((event: any) => {
        if (!event?.dateEvent || !event?.strTime || !event?.strEvent) return false;

        const now = new Date();
        const eventDate = new Date(event.dateEvent + 'T' + event.strTime);
        return eventDate > now;
      })
      .map((event: any) => {
        try {
          const startTime = new Date(event.dateEvent + 'T' + event.strTime);
          startTime.setHours(startTime.getHours() + 1);

          // Extraire les noms des combattants
          const fighters = event.strEvent.split(' vs ').map((name: string) => name.trim());
          const [fighter1 = '', fighter2 = ''] = fighters;

          // Déterminer le diffuseur
          let broadcaster = BROADCASTERS.UFC_FIGHT_PASS;
          if (event.strTVStation?.toLowerCase().includes('espn')) {
            broadcaster = BROADCASTERS.ESPN_PLUS;
          }

          // Construire les URLs des images des combattants
          const getImageUrl = (name: string) => {
            const formattedName = name.toLowerCase()
              .replace(/[^a-z0-9]/g, '')
              .substring(0, 20);
            return `https://www.thesportsdb.com/images/media/player/thumb/${formattedName}.jpg`;
          };

          const eventData: SportEvent = {
            id: event.idEvent,
            title: event.strEvent,
            sportType: 'MMA',
            startTime: startTime.toISOString(),
            endTime: new Date(startTime.getTime() + 3 * 60 * 60 * 1000).toISOString(),
            league: UFC_LEAGUE, // Utilisation directe de l'objet UFC_LEAGUE
            teams: {
              home: fighter1,
              home_logo: getImageUrl(fighter1),
              away: fighter2,
              away_logo: getImageUrl(fighter2)
            },
            venue: event.strVenue || 'À déterminer',
            status: 'upcoming',
            broadcastChannel: broadcaster.name,
            broadcastLogo: broadcaster.logo
          };

          return eventData;
        } catch (error) {
          console.error('Erreur lors du traitement d\'un événement UFC:', error);
          return null;
        }
      })
      .filter((event:SportEvent): event is SportEvent => event !== null)
      .sort((a:SportEvent, b:SportEvent) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  } catch (error) {
    console.error('Erreur lors de la récupération des événements UFC:', formatApiError(error));
    throw error;
  }
};
