// Demo mode utilities and configuration
export const isDemoMode = () => {
  return (
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    process.env.NODE_ENV === "development" ||
    (typeof window !== "undefined" &&
      window.location.pathname.includes("/demo"))
  );
};

export const getDemoConfig = () => {
  return {
    enableDatabase: !isDemoMode(),
    showConnectionErrors: !isDemoMode(),
    useRealTimeUpdates: !isDemoMode(),
    enableAuthentication: !isDemoMode(),
    dataSource: isDemoMode() ? "mock" : "database",
  };
};

// Demo data configurations
export const demoConfig = {
  company: {
    name: "SefTech Logistics",
    description: "Comprehensive Demo Dashboard",
    fleet: {
      totalTrucks: 24,
      activeTrucks: 18,
      inMaintenance: 3,
      locations: [
        "Lagos",
        "Abuja",
        "Kano",
        "Port Harcourt",
        "Ibadan",
        "Kaduna",
      ],
    },
    metrics: {
      onTimeDeliveries: 94.2,
      totalRevenue: 2450000,
      monthlyGrowth: 12.5,
      totalTrips: 1247,
      fuelEfficiency: 8.2,
    },
  },
};
