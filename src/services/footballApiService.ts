import {SportEvent} from '../types/event';

const API_KEY = '580799';
const BASE_URL = 'https://www.thesportsdb.com/api/v1/json';

const BROADCASTERS = {
  BEIN_SPORTS: {
    name: 'beIN SPORTS',
    logo: 'https://www.thesportsdb.com/images/media/channel/logo/BeIn_Sports_HD_1_France.png'
  },
  DAZN: {
    name: 'DAZN',
    logo: 'https://www.thesportsdb.com/images/media/channel/logo/ytaua51657045521.png'
  }
};
/**
 * @nordine
 * fonction inexistante à la base,  ajoutée pour tester
 */
export const fetchLiveMatches = async (): Promise<SportEvent[]> => {
return []
}
/**
 *
 */
export const fetchLigue1Matches = async (): Promise<SportEvent[]> => {
  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/eventsnextleague.php?id=4334`);
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
        startTime.setHours(startTime.getHours() + 1); // Ajout d'une heure

        const hour = startTime.getHours();
        const day = startTime.getDay();

        // Détermination du diffuseur selon l'horaire
        let broadcaster = BROADCASTERS.BEIN_SPORTS;
        if (day === 0) { // Dimanche
          if (hour === 13 || hour === 20 || hour === 21) {
            broadcaster = BROADCASTERS.DAZN;
          } else if (hour === 15) {
            broadcaster = BROADCASTERS.BEIN_SPORTS;
          }
        } else if (day === 5 && hour === 21) { // Vendredi 21h
          broadcaster = BROADCASTERS.DAZN;
        } else if (day === 6) { // Samedi
          if (hour === 17) {
            broadcaster = BROADCASTERS.BEIN_SPORTS;
          } else if (hour === 21) {
            broadcaster = BROADCASTERS.DAZN;
          }
        }

        return {
          id: event.idEvent,
          title: `${event.strHomeTeam} vs ${event.strAwayTeam}`,
          sportType: 'Football',
          startTime: startTime.toISOString(),
          endTime: new Date(startTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
          league: {
            name: 'Ligue 1',
            logo: 'https://www.thesportsdb.com/images/media/league/badge/zcafvy1719637069.png'
          },
          teams: {
            home: event.strHomeTeam,
            home_logo: event.strHomeTeamBadge,
            away: event.strAwayTeam,
            away_logo: event.strAwayTeamBadge
          },
          venue: event.strVenue,
          status: 'upcoming',
          broadcastChannel: broadcaster.name,
          broadcastLogo: broadcaster.logo
        };
      })
      .sort((a: SportEvent, b: SportEvent) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
  } catch (error) {
    console.error('Error fetching Ligue 1 matches:', error);
    return [];
  }
};
