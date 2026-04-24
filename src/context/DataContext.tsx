import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { subscribeToProjects, subscribeToSkills } from "@/services/firestore";
import { initialProjects } from "@/lib/initial-data";

interface DataContextType {
  projects: any[];
  skills: any[];
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const CACHE_KEY_PROJECTS = "portfolio_cache_projects";
const CACHE_KEY_SKILLS = "portfolio_cache_skills";

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<any[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY_PROJECTS);
    return cached ? JSON.parse(cached) : initialProjects;
  });
  const [skills, setSkills] = useState<any[]>(() => {
    const cached = localStorage.getItem(CACHE_KEY_SKILLS);
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    // Start project subscription
    const unsubProjects = subscribeToProjects((data) => {
      const finalProjects = data.length > 0 ? data : initialProjects;
      setProjects(finalProjects);
      localStorage.setItem(CACHE_KEY_PROJECTS, JSON.stringify(finalProjects));
      setLoading(false);
    });

    // Start skills subscription
    const unsubSkills = subscribeToSkills((data) => {
      setSkills(data);
      localStorage.setItem(CACHE_KEY_SKILLS, JSON.stringify(data));
    });

    return () => {
      unsubProjects();
      unsubSkills();
    };
  }, []);

  return (
    <DataContext.Provider value={{ projects, skills, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
