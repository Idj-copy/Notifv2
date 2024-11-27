import {useCallback, useState} from 'react';
import {useEvents} from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import F1WeekendCard from '../components/F1WeekendCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';
import {F1Event} from '../types/event';

const categories = [
  {
    id: 'football',
    name: 'Football',
    icon: '⚽',
  },
  {
    id: 'f1',
    name: 'Formula 1',
    icon: '🏎️',
  },
  {
    id: 'mma',
    name: 'MMA',
    icon: '🥊',
    subcategories: [
      {
        id: 'ufc',
        name: 'UFC',
      },
      {
        id: 'bellator',
        name: 'Bellator',
      }
    ]
  },
  {
    id: 'boxing',
    name: 'Boxing',
    icon: '🥊',
  }
];

function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const { events, loading, error } = useEvents();

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
    setSelectedSubcategory(null);
  }, []);

  const handleSubcategorySelect = useCallback((subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
  }, []);

  const filteredEvents = events.filter(event => {
    if (!selectedCategory) return true;

    switch (selectedCategory) {
      case 'football':
        return event.sportType === 'Football';
      case 'f1':
        return event.sportType === 'Formula 1';
      case 'mma':
        if (selectedSubcategory) {
          return event.sportType === 'MMA' && event.league?.name.toLowerCase() === selectedSubcategory;
        }
        return event.sportType === 'MMA';
      case 'boxing':
        return event.sportType === 'Boxing';
      default:
        return event.sportType.toLowerCase() === selectedCategory;
    }
  });

  // Grouper les événements F1 par weekend
  const f1Weekends = selectedCategory === 'f1'
    ? Object.values(
        filteredEvents.reduce((acc: { [key: string]: { location: string, events: F1Event[] } }, event) => {
          if (event.sportType === 'Formula 1' && 'location' in event) {
            const f1Event = event as F1Event;
            if (!acc[f1Event.location]) {
              acc[f1Event.location] = { location: f1Event.location, events: [] };
            }
            acc[f1Event.location].events.push(f1Event);
          }
          return acc;
        }, {})
      ).sort((a, b) => {
        const dateA = new Date(a.events[0].startTime);
        const dateB = new Date(b.events[0].startTime);
        return dateA.getTime() - dateB.getTime();
      })
    : [];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Sélectionnez un sport</h2>
        <div className="grid gap-3">
          {categories.map(category => (
            <div key={category.id} className="space-y-2">
              <button
                onClick={() => handleCategorySelect(category.id)}
                className={`flex items-center gap-3 w-full p-4 rounded-xl transition-all
                  ${selectedCategory === category.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>

              {selectedCategory === category.id && category.subcategories && (
                <div className="ml-8 space-y-2">
                  {category.subcategories.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubcategorySelect(sub.id)}
                      className={`flex items-center gap-2 w-full p-3 rounded-lg transition-all
                        ${selectedSubcategory === sub.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                      <span className="font-medium">{sub.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">
          {selectedSubcategory
            ? `Événements ${selectedSubcategory.toUpperCase()}`
            : selectedCategoryData
              ? `Événements ${selectedCategoryData.name}`
              : 'Tous les événements'}
        </h2>

        <div className="grid gap-6">
          {selectedCategory === 'f1' ? (
            f1Weekends.length > 0 ? (
              f1Weekends.map(weekend => (
                <F1WeekendCard
                  key={weekend.location}
                  location={weekend.location}
                  events={weekend.events}
                />
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">
                Aucun événement F1 à venir pour le moment.
              </p>
            )
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {filteredEvents.length === 0 && selectedCategory !== 'f1' && (
            <p className="text-gray-400 text-center py-8">
              Aucun événement trouvé pour cette sélection.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
