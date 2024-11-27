import {useState} from 'react';
import {SportPreference} from '../types/event';

function Settings() {
  const [preferences, setPreferences] = useState<SportPreference[]>([
    { sportType: 'Football', enabled: true, notificationsEnabled: true },
    { sportType: 'MMA', enabled: true, notificationsEnabled: false },
    { sportType: 'Boxing', enabled: false, notificationsEnabled: false },
  ]);

  const handleToggleEnabled = (sportType: string) => {
    setPreferences(prefs =>
      prefs.map(pref =>
        pref.sportType === sportType
          ? { ...pref, enabled: !pref.enabled }
          : pref
      )
    );
  };

  const handleToggleNotifications = (sportType: string) => {
    setPreferences(prefs =>
      prefs.map(pref =>
        pref.sportType === sportType
          ? { ...pref, notificationsEnabled: !pref.notificationsEnabled }
          : pref
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-100">Settings</h2>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-medium mb-4 text-gray-100">Sport Preferences</h3>
            <div className="space-y-4">
              {preferences.map(pref => (
                <div key={pref.sportType} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <span className="font-medium text-gray-100">{pref.sportType}</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-gray-200">
                      <input
                        type="checkbox"
                        checked={pref.enabled}
                        onChange={() => handleToggleEnabled(pref.sportType)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600"
                      />
                      Show Events
                    </label>
                    <label className="flex items-center gap-2 text-gray-200">
                      <input
                        type="checkbox"
                        checked={pref.notificationsEnabled}
                        onChange={() => handleToggleNotifications(pref.sportType)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600"
                      />
                      Notifications
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium mb-4 text-gray-100">Notification Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-gray-200">
                <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600" defaultChecked />
                Event Reminders
              </label>
              <label className="flex items-center gap-2 text-gray-200">
                <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600" defaultChecked />
                Live Score Updates
              </label>
              <label className="flex items-center gap-2 text-gray-200">
                <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600" defaultChecked />
                Breaking News
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Settings;
