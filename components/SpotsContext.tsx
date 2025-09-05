import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "@/config";
import { Spot, Criteria } from "@/types";

interface SpotsContextType {
  spots: Spot[];
  criteria: Criteria[];
  loading: boolean;
}

const SpotsContext = createContext<SpotsContextType | null>(null);

export const SpotsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch(`${API_URL}/spots/`);
        const data: Spot[] = await response.json();
        setSpots(data);
      } catch (err) {
        console.error("Failed to fetch spots:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, []);

  useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const response = await fetch(`${API_URL}/criteria/`);
        const data: Criteria[] = await response.json();
        setCriteria(data);
      } catch (err) {
        console.error("Failed to fetch criteria:", err);
      }
    };
    fetchCriteria();
  }, []);

  return (
    <SpotsContext.Provider value={{ spots, criteria, loading }}>
      {children}
    </SpotsContext.Provider>
  );
};

export const useSpots = () => {
  const ctx = useContext(SpotsContext);
  if (!ctx) throw new Error("useSpots must be used inside SpotsProvider");
  return ctx;
};
