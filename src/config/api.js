export const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000"
    : "https://api.thehabitry.com";
