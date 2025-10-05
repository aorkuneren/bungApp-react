import { useState, useEffect, useCallback } from 'react';

// Custom hook for API calls with loading, error, and data states
export const useApi = (apiFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate, ...dependencies]);

  return {
    data,
    loading,
    error,
    execute,
    setData,
    setLoading,
    setError,
  };
};

// Custom hook for paginated data
export const usePaginatedApi = (apiFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async (pageParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const requestParams = {
        ...params,
        ...pageParams,
        page: pageParams.page || pagination.currentPage,
        per_page: pageParams.perPage || pagination.perPage,
      };

      const result = await apiFunction(requestParams);
      
      setData(result.data || []);
      setPagination({
        currentPage: result.current_page || 1,
        totalPages: result.last_page || 1,
        totalItems: result.total || 0,
        perPage: result.per_page || 10,
      });
      
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params, pagination.currentPage, pagination.perPage]);

  const goToPage = useCallback((page) => {
    fetchData({ page });
  }, [fetchData]);

  const changePerPage = useCallback((perPage) => {
    fetchData({ page: 1, perPage });
  }, [fetchData]);

  const updateParams = useCallback((newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
    fetchData({ page: 1, ...newParams });
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    pagination,
    loading,
    error,
    goToPage,
    changePerPage,
    updateParams,
    refresh,
    setData,
  };
};

// Custom hook for form submission
export const useFormSubmit = (apiFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(data);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return {
    submit,
    loading,
    error,
    setError,
  };
};
