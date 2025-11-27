import { z } from "zod";

export const getFlightsSchema = z.object({
  origin: z.string().length(3),
  destination: z.string().length(3),
  date: z.string()
});

export const bookFlightSchema = z.object({
  flightNumber: z.string(),
  travelClass: z.enum(["economy", "business"]),
  passengerName: z.string().min(2).optional()
});

const toCode = (value: string) => value.trim().toUpperCase();
const recordLocator = () =>
  `BK${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

/** Generate 2–4 random flights for any query */
const generateMockFlights = (
  origin: string,
  destination: string,
  date: string
) => {
  const count = Math.floor(Math.random() * 3) + 2; // between 2 to 4 flights
  const flights = [];

  for (let i = 0; i < count; i++) {
    const depHour = 6 + i * 3; // 06:00, 09:00, 12:00, …
    const dep = `${date}T${depHour.toString().padStart(2, "0")}:00:00-08:00`;
    const arr = `${date}T${(depHour + 3)
      .toString()
      .padStart(2, "0")}:30:00-05:00`;

    flights.push({
      flightNumber: `FL${Math.floor(Math.random() * 800 + 100)}`,
      origin,
      destination,
      date,
      departureTime: dep,
      arrivalTime: arr,
      durationMinutes: 210,
      aircraft: ["Boeing 737", "Airbus A320", "Boeing 787"][i % 3],
      classes: {
        economy: {
          price: Math.floor(Math.random() * 200) + 150,
          seatsAvailable: Math.floor(Math.random() * 50) + 10
        },
        business: {
          price: Math.floor(Math.random() * 600) + 500,
          seatsAvailable: Math.floor(Math.random() * 10) + 1
        }
      }
    });
  }

  return flights;
};

// In-memory cache so booking can find flights
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const flightCache = new Map<string, any[]>();

export const findFlights = (query: z.infer<typeof getFlightsSchema>) => {
  const origin = toCode(query.origin);
  const destination = toCode(query.destination);

  const flights = generateMockFlights(origin, destination, query.date);

  // Save to cache so booking can reference them
  const key = `${origin}-${destination}-${query.date}`;
  flightCache.set(key, flights);

  return flights;
};

export const holdFlight = ({
  flightNumber,
  travelClass,
  passengerName
}: z.infer<typeof bookFlightSchema>) => {
  // Look through all cached flight batches
  const allFlights = Array.from(flightCache.values()).flat();
  const flight = allFlights.find(
    (item) => item.flightNumber === flightNumber.toUpperCase()
  );

  if (!flight) {
    return {
      success: false,
      message: `Flight ${flightNumber} not found. Try searching again.`
    };
  }

  // 70% success rate
  const success = Math.random() > 0.3;

  if (!success) {
    return {
      success: false,
      message: `Booking failed for ${flightNumber}. Try again.`
    };
  }

  const price = flight.classes[travelClass].price;

  return {
    success: true,
    message: `Held ${travelClass} on ${flight.flightNumber} from ${flight.origin} to ${flight.destination}.`,
    booking: {
      recordLocator: recordLocator(),
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      date: flight.date,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      travelClass,
      price,
      passengerName: passengerName ?? null
    }
  };
};
