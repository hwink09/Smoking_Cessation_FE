import { useState, useEffect } from 'react';
import CoachService from '~/services/CoachService';


export function useCoachData() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const data = await CoachService.getAllCoaches();
      setCoaches(data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  return {
    coaches,
    loading,
    error,
    refetch: fetchCoaches,
  };
}
