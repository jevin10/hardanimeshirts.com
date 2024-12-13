import type { Country } from "$lib/shared/locations/countries";

export interface ShippingZone {
  shippingGroup: string;
  countries: string[];
  price: number; // USD
}

export const shippingData: ShippingZone[] = [
  {
    shippingGroup: "United States",
    countries: ["US"],
    price: 8 // Originally Canadian price, switched as requested
  },
  {
    shippingGroup: "Canada",
    countries: ["CA"],
    price: 14 // Originally US price, switched as requested
  },
  {
    shippingGroup: "Japan",
    countries: ["JP"],
    price: 18.50 // Converted from ¥2750
  },
  {
    shippingGroup: "Mainland China",
    countries: ["CN"],
    price: 42
  },
  {
    shippingGroup: "Hong Kong",
    countries: ["HK"],
    price: 28 // Converted from HKD 218
  },
  {
    shippingGroup: "United Kingdom",
    countries: ["GB"],
    price: 21 // Converted from £17
  },
  {
    shippingGroup: "Australia",
    countries: ["AU"],
    price: 28 // Converted from AUD 43
  },
  {
    shippingGroup: "New Zealand",
    countries: ["NZ"],
    price: 62
  },
  {
    shippingGroup: "Europe Group A",
    countries: ["AT", "BE", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "NO", "PL", "PT", "SK", "SI", "ES", "SE", "CH"],
    price: 24 // Converted from €22
  },
  {
    shippingGroup: "Europe Group B",
    countries: ["AL", "AD", "BA", "BG", "HR", "FO", "GI", "IS", "LI", "MK", "MD", "MC", "ME", "RO", "SM", "RS", "UA", "VA"],
    price: 42
  },
  {
    shippingGroup: "International Group A",
    countries: ["AR", "BS", "BB", "BZ", "BR", "KY", "CL", "SV", "GD", "GY", "IS", "MA", "LC", "SG", "KR", "TW"],
    price: 27
  },
  {
    shippingGroup: "International Group B",
    countries: ["IL", "MO", "RU"],
    price: 77
  },
  {
    shippingGroup: "International Group C",
    countries: ["MY", "PH"],
    price: 42
  }
];

export function getShippingZone(location: Country): ShippingZone {
  const zone = shippingData.find(zone =>
    zone.countries.includes(location.code)
  );

  if (!zone) {
    // Provide a default fallback if no zone is found
    throw new Error(`No shipping zone found for country: ${location.country} (${location.code})`);
  }

  return zone;
}

