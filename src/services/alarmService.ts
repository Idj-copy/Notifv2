export const setAlarm = (title: string, date: Date) => {
  try {
    // Créer l'URL pour l'alarme
    const alarmUrl = new URL('https://');
    alarmUrl.protocol = 'android-app:';
    alarmUrl.host = 'com.android.deskclock';
    alarmUrl.pathname = '/alarm/new';
    alarmUrl.searchParams.append('hour', date.getHours().toString());
    alarmUrl.searchParams.append('minutes', date.getMinutes().toString());
    alarmUrl.searchParams.append('message', title);
    alarmUrl.searchParams.append('vibrate', 'true');
    alarmUrl.searchParams.append('skipUi', 'true');

    // Créer un lien et le cliquer
    const link = document.createElement('a');
    link.href = alarmUrl.toString();
    link.click();

    // Fallback pour iOS et autres plateformes
    if (!navigator.userAgent.toLowerCase().includes('android')) {
      const formattedDate = date.toLocaleString();
      alert(`Pour définir une alarme pour "${title}" à ${formattedDate}, veuillez utiliser l'application d'alarme de votre appareil.`);
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'alarme:', error);
    alert('Impossible de créer l\'alarme automatiquement. Veuillez utiliser l\'application d\'alarme de votre appareil.');
  }
};