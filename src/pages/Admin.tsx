import {ChangeEvent, FormEvent, useState} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select} from '@/components/ui/select';
import {Category} from '../types/category';
import {SportEvent} from '../types/event';
import {getCategories,} from '../services/categoryService';
import {saveCustomEvent,} from '../services/customEventsService';

function Admin() {
  const [selectedTab, setSelectedTab] = useState('events');
  const [categories] = useState<Category[]>(getCategories());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [eventForm, setEventForm] = useState({
    title: '',
    sportType: '',
    subcategory: '',
    startTime: '',
    endTime: '',
    venue: '',
    broadcastChannel: '',
    broadcastLogo: '',
    teams: {
      home: '',
      home_logo: '',
      away: '',
      away_logo: '',
    },
  });





  // Gestion des inputs
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gestion des selects
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'sportType') {
      const category = categories.find((cat) => cat.name === value);
      setSelectedCategory(category || null);
    }
    setEventForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEventSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newEvent: SportEvent = {
      ...eventForm,
      id: `custom-${Date.now()}`,
      status: 'upcoming',
      startTime: new Date(eventForm.startTime).toISOString(),
      endTime: new Date(eventForm.endTime).toISOString(),
      league: selectedCategory?.subcategories?.find(
        (sub) => sub.id === eventForm.subcategory
      )
        ? {
            name: eventForm.subcategory,
            logo: selectedCategory.icon,
          }
        : undefined,
    };
    saveCustomEvent(newEvent);
    setEventForm({
      title: '',
      sportType: '',
      subcategory: '',
      startTime: '',
      endTime: '',
      venue: '',
      broadcastChannel: '',
      broadcastLogo: '',
      teams: {
        home: '',
        home_logo: '',
        away: '',
        away_logo: '',
      },
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="bg-gray-800">
          <TabsTrigger value="events" className="text-gray-300">
            Events
          </TabsTrigger>
          <TabsTrigger value="categories" className="text-gray-300">
            Categories
          </TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="space-y-6">
          <Card className="bg-gray-800 text-white border-gray-700">
            <CardHeader>
              <CardTitle>Add New Event</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    name="title"
                    value={eventForm.title}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sport Type</Label>
                  <Select
                    name="sportType"
                    value={eventForm.sportType}
                    onChange={handleSelectChange}
                    className="bg-gray-700 border-gray-600"
                    required
                  >
                    <option value="">Select sport type</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </Select>
                </div>
                {/* Ajoutez le reste des champs ici */}
                <Button type="submit" className="w-full">
                  Add Event
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Admin;
