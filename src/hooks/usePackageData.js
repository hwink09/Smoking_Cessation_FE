import { useState, useEffect, useCallback } from 'react';
import PackageService from '~/services/packageService';



export function usePackageData() {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PackageService.getAllPackages();
      setPackages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPackageById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await PackageService.getPackageById(id);
      setSelectedPackage(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return {
    packages,
    selectedPackage,
    loading,
    error,
    fetchPackages,
    fetchPackageById,
  };
}
