import {SportEvent} from '../types/event';
import moment from 'moment';
import {BellIcon, ClockIcon, TvIcon} from '@heroicons/react/24/outline';
import {Card, CardContent, CardFooter, CardHeader} from './ui/card';
import {Button} from './ui/button';
import {useState} from 'react';
import NotificationDialog from './NotificationDialog';
import AlarmDialog from './AlarmDialog';

interface EventCardProps {
  event: SportEvent;
}

function EventCard({ event }: EventCardProps) {
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [showAlarmDialog, setShowAlarmDialog] = useState(false);
  const isCombatSport = event.sportType === 'MMA' || event.sportType === 'Boxing';

  return (
    <>
      <Card className="bg-card hover:bg-card/90 transition-colors">
        {event.league && (
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <div className="w-8 h-8 flex items-center justify-center overflow-hidden">
              <img
                src={event.league.logo}
                alt={event.league.name}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  console.log('Erreur de chargement du logo:', event.league?.name);
                  e.currentTarget.src = 'https://www.thesportsdb.com/images/media/league/badge/default.png';
                }}
              />
            </div>
            <span className="text-card-foreground font-medium">{event.league.name}</span>
          </CardHeader>
        )}

        <CardContent className="space-y-4">
          {event.teams ? (
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-2 flex-1">
                <img
                  src={event.teams.home_logo}
                  alt={event.teams.home}
                  className={`${isCombatSport ? 'w-24 h-24 rounded-full object-cover' : 'w-12 h-12'}`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://www.thesportsdb.com/images/media/player/thumb/placeholder.png';
                  }}
                />
                <span className="text-card-foreground font-medium text-center">{event.teams.home}</span>
              </div>
              <span className="text-muted-foreground font-bold mx-4">VS</span>
              <div className="flex flex-col items-center gap-2 flex-1">
                <img
                  src={event.teams.away_logo}
                  alt={event.teams.away}
                  className={`${isCombatSport ? 'w-24 h-24 rounded-full object-cover' : 'w-12 h-12'}`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://www.thesportsdb.com/images/media/player/thumb/placeholder.png';
                  }}
                />
                <span className="text-card-foreground font-medium text-center">{event.teams.away}</span>
              </div>
            </div>
          ) : (
            <h3 className="text-xl font-semibold text-card-foreground">{event.title}</h3>
          )}

          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span>{moment(event.startTime).format('DD MMMM YYYY')}</span>
              <span className="font-bold">{moment(event.startTime).format('HH:mm')}</span>
            </div>
          </div>

          {event.venue && (
            <div className="text-sm text-muted-foreground">
              <span>📍 {event.venue}</span>
            </div>
          )}

          {event.broadcastChannel && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TvIcon className="w-4 h-4" />
              <div className="flex items-center gap-2">
                <span>{event.broadcastChannel}</span>
                {event.broadcastLogo && (
                  <img
                    src={event.broadcastLogo}
                    alt={event.broadcastChannel}
                    className="h-4 object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-end">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              title="Définir un rappel"
              onClick={() => setShowNotificationDialog(true)}
            >
              <BellIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Définir une alarme"
              onClick={() => setShowAlarmDialog(true)}
            >
              <ClockIcon className="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <NotificationDialog
        event={event}
        open={showNotificationDialog}
        onClose={() => setShowNotificationDialog(false)}
      />

      <AlarmDialog
        event={event}
        open={showAlarmDialog}
        onClose={() => setShowAlarmDialog(false)}
      />
    </>
  );
}

export default EventCard;
