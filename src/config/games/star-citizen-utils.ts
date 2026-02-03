/**
 * Helper utilities for Star Citizen manufacturer data
 */

import manufacturersData from './star-citizen-manufacturers.json';

export interface Manufacturer {
  name: string;
  logo: string | null;
  code: string | null;
}

/**
 * Get manufacturer logo URL by manufacturer name
 */
export function getManufacturerLogo(manufacturerName: string): string | null {
  const manufacturer = manufacturersData.manufacturers.find(
    m => m.name === manufacturerName
  );
  return manufacturer?.logo || null;
}

/**
 * Get all manufacturers
 */
export function getAllManufacturers(): Manufacturer[] {
  return manufacturersData.manufacturers;
}

/**
 * Get manufacturer by name
 */
export function getManufacturer(manufacturerName: string): Manufacturer | null {
  return manufacturersData.manufacturers.find(
    m => m.name === manufacturerName
  ) || null;
}
