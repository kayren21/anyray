import axios from 'axios';

export const getTargetLanguageId = async (): Promise<string | null> => {
  const hubRaw = localStorage.getItem('hub');

  if (hubRaw) {
    try {
      const hub = JSON.parse(hubRaw);
      return hub?.targetLanguage?.id || null;
    } catch (err) {
      console.warn('Invalid hub JSON in localStorage:', err);
      localStorage.removeItem('hub'); 
    }
  }

  const userId = localStorage.getItem('userId');
  if (!userId) return null;

  try {
    const res = await axios.get(`http://localhost:3000/hub/default?userId=${userId}`);
    const hub = res.data;
    localStorage.setItem('hub', JSON.stringify(hub));
    return hub?.targetLanguage?.id || null;
  } catch (error) {
    console.error('Error fetching default hub:', error);
    return null;
  }
};
