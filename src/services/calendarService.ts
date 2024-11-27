import {SportEvent} from '../types/event';
import moment from 'moment';

export const addToCalendar = (event: SportEvent, reminderMinutes: number) => {
  const startDate = moment(event.startTime).format('YYYYMMDDTHHmmss');
  const endDate = moment(event.endTime).format('YYYYMMDDTHHmmss');

  const title = encodeURIComponent(event.title);
  const location = encodeURIComponent(event.venue || '');
  const description = encodeURIComponent(generateEventDescription(event));

  // Créer l'URL du calendrier
  const url = `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
BEGIN:VALARM
TRIGGER:-PT${reminderMinutes}M
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
END:VCALENDAR`;

  // Créer un lien temporaire et déclencher le téléchargement
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const generateEventDescription = (event: SportEvent): string => {
  const parts = [];

  if (event.teams) {
    parts.push(`${event.teams.home} vs ${event.teams.away}`);
  }

  if (event.broadcastChannel) {
    parts.push(`Diffusion : ${event.broadcastChannel}`);
  }

  if (event.venue) {
    parts.push(`Lieu : ${event.venue}`);
  }

  if (event.league?.name) {
    parts.push(`Compétition : ${event.league.name}`);
  }

  return parts.join('\\n');
};
