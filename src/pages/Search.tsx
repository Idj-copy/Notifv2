import {useState} from 'react';
import EventCard from '../components/EventCard';
import {useEvents} from '../hooks/useEvents';

const categories = [
  { id: 'all', name: 'All Sports' },
  { id: 'football', name: 'Football' },
  { id: 'f1', name: 'Formula 1' },
  { id: 'mma', name: 'MMA', subcategories: [
    { id: 'ufc', name: 'UFC' },
    { id: 'bellator', name: 'Bellator' }
  ]},
  { id: 'boxing', name: 'Boxing' }
];

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { events, loading, error } = useEvents();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
  };

  const filteredEvents = events.filter(event => {
    const matchesQuery = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.sportType.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'all') return matchesQuery;

    const matchesCategory =
      (selectedCategory === 'football' && event.sportType === 'Football') ||
      (selectedCategory === 'f1' && event.sportType === 'Formula 1') ||
      (selectedCategory === 'boxing' && event.sportType === 'Boxing') ||
      (selectedCategory === 'mma' && event.sportType === 'MMA');

    if (selectedSubcategory && selectedCategory === 'mma') {
      return matchesQuery && matchesCategory && event.league?.name.toLowerCase() === selectedSubcategory;
    }

    return matchesQuery && matchesCategory;
  });


  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="p-4 bg-gray-800 rounded-lg shadow space-y-4">
          <h3 className="font-semibold mb-2 text-gray-100">Sport Type</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <div key={category.id} className="space-y-2">
                <button
                  onClick={() => handleCategorySelect(category.id)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                  }`}
                >
                  {category.name}
                </button>

                {selectedCategory === category.id && category.subcategories && (
                  <div className="ml-4 space-y-2">
                    {category.subcategories.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubcategory(sub.id)}
                        className={`px-3 py-1 rounded-lg ${
                          selectedSubcategory === sub.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-600 hover:bg-gray-500 text-gray-100'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading events...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 bg-gray-800 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
