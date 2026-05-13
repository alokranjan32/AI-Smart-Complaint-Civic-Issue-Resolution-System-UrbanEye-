import { apiRequest } from "../lib/api";

export type MapHotspot = {
  id: string;
  title: string;
  description?: string;
  location: string;
  latitude: number;
  longitude: number;
  category: string;
  priority: string;
  status: string;
  department?: string;
  createdAt?: string;
};

export async function getHotspots(): Promise<MapHotspot[]> {
  return apiRequest<MapHotspot[]>("/map/hotspots", {
    fallbackData: [],
  });
}
