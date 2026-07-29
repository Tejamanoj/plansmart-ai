import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeneratedItinerary {
  id: string;
  title: string;
  destination: string;
  durationDays: number;
  travelStyle: string;
  totalBudget: number;
  currency: string;
  createdAt: string;
  days: {
    dayNumber: number;
    title: string;
    activities: {
      id: string;
      title: string;
      description: string;
      timeSlot: string;
      location: string;
      estimatedCost: number;
      category: 'sightseeing' | 'food' | 'outdoor' | 'culture' | 'relaxation' | 'nightlife';
    }[];
  }[];
}

interface RawActivity {
  title: string;
  description: string;
  timeSlot: string;
  location: string;
  estimatedCost: number;
  category: 'sightseeing' | 'food' | 'outdoor' | 'culture' | 'relaxation' | 'nightlife';
}

/**
 * City-specific authentic 7-day activity database for fallback itinerary generation.
 */
const CITY_DESTINATION_DATA: Record<string, {
  destinationName: string;
  days: { title: string; activities: RawActivity[] }[];
}> = {
  goa: {
    destinationName: 'Goa, India',
    days: [
      {
        title: 'Baga Beach Watersports & Nightlife',
        activities: [
          { title: 'Baga & Calangute Beach Watersports', description: 'Parasailing, banana boat rides, and jet skiing along North Goa\'s golden shoreline.', timeSlot: '09:30 AM - 01:00 PM', location: 'Baga Beach, North Goa', estimatedCost: 25, category: 'outdoor' },
          { title: 'Goan Fish Curry Thali Lunch', description: 'Authentic Goan spicy Kingfish curry, rice, sol kadi, and fried prawns at Britto\'s.', timeSlot: '01:30 PM - 03:00 PM', location: 'Baga Beach Shack', estimatedCost: 12, category: 'food' },
          { title: 'Chapora Fort (Dil Chahta Hai Spot)', description: 'Hike up red laterite cliffside fort for breathtaking views over Vagator River estuary.', timeSlot: '04:30 PM - 06:30 PM', location: 'Vagator Coast', estimatedCost: 0, category: 'sightseeing' },
          { title: 'Tito\'s Lane Nightlife & Clubbing', description: 'Experience Goa\'s famous nightlife strip with music clubs and beach lounges.', timeSlot: '08:00 PM - 11:30 PM', location: 'Tito\'s Lane, Baga', estimatedCost: 30, category: 'nightlife' },
        ],
      },
      {
        title: 'Old Goa Heritage & Spice Plantation',
        activities: [
          { title: 'Basilica of Bom Jesus & Se Cathedral', description: 'UNESCO World Heritage 16th-century Portuguese churches holding St. Francis Xavier relics.', timeSlot: '09:00 AM - 11:30 AM', location: 'Old Goa', estimatedCost: 0, category: 'culture' },
          { title: 'Tropical Spice Plantation Lunch', description: 'Guided walk through cardamom, vanilla, and pepper trees with traditional Goan buffet.', timeSlot: '12:30 PM - 03:30 PM', location: 'Ponda Spice Estate', estimatedCost: 15, category: 'food' },
          { title: 'Mandovi River Sunset Cruise & Dance', description: 'Enjoy traditional Goan Fugdi folk dance and music aboard evening river boat.', timeSlot: '05:30 PM - 07:30 PM', location: 'Panjim Jetty', estimatedCost: 8, category: 'relaxation' },
        ],
      },
      {
        title: 'South Goa Serene Beaches & Flea Market',
        activities: [
          { title: 'Anjuna Flea Market & Shopping', description: 'Browse boho clothing, handmade souvenirs, and silver jewelry at beachside market.', timeSlot: '09:30 AM - 12:30 PM', location: 'Anjuna Beach Coast', estimatedCost: 15, category: 'sightseeing' },
          { title: 'Palolem Beach Relaxation & Sunset', description: 'Unwind at crescent-shaped Palolem beach with quiet shacks and kayak rental.', timeSlot: '02:00 PM - 06:30 PM', location: 'Palolem Beach, South Goa', estimatedCost: 10, category: 'relaxation' },
          { title: 'Fisherman\'s Wharf Waterfront Dinner', description: 'Dine on fresh Goan seafood crab xacuti overlooking Sal River.', timeSlot: '07:30 PM - 09:30 PM', location: 'Cavelossim, South Goa', estimatedCost: 28, category: 'food' },
        ],
      },
      {
        title: 'Dudhsagar Waterfalls & Wildlife Safari',
        activities: [
          { title: 'Dudhsagar Waterfalls Jeep Safari', description: 'Thrilling 4x4 jungle drive through Bhagwan Mahavir Sanctuary to 300m cascading waterfalls.', timeSlot: '08:00 AM - 01:00 PM', location: 'Collem, Western Ghats', estimatedCost: 20, category: 'outdoor' },
          { title: 'Spice Garden Herbal Tea & Buffet', description: 'Enjoy organic jungle herbal tea and local Goan veg & non-veg lunch.', timeSlot: '01:30 PM - 03:00 PM', location: 'Mollem National Park', estimatedCost: 10, category: 'food' },
          { title: 'Tambdi Surla Ancient Temple Hike', description: 'Visit 12th-century Kadamba dynasty black basalt temple hidden inside forest reserve.', timeSlot: '03:30 PM - 05:30 PM', location: 'Tambdi Surla', estimatedCost: 0, category: 'culture' },
        ],
      },
      {
        title: 'Fontainhas Latin Quarter & Island Bike Tour',
        activities: [
          { title: 'Fontainhas Heritage Walk', description: 'Stroll colorful 18th-century Portuguese colonial homes and art galleries in Panjim.', timeSlot: '09:30 AM - 12:00 PM', location: 'Fontainhas, Panaji', estimatedCost: 0, category: 'culture' },
          { title: 'Divar Island Ferry & Countryside Cycling', description: 'Take local car ferry to peaceful Divar island for scenic village cycling past paddy fields.', timeSlot: '12:30 PM - 04:30 PM', location: 'Divar Island, Mandovi', estimatedCost: 12, category: 'outdoor' },
          { title: 'Panjim Latin Bistro Dinner', description: 'Sample Goan-Portuguese fusion dishes like Pork Vindaloo and Bebinca dessert.', timeSlot: '07:00 PM - 09:30 PM', location: 'Panaji Heritage Zone', estimatedCost: 22, category: 'food' },
        ],
      },
      {
        title: 'Grand Island Scuba Diving & Dolphin Cruise',
        activities: [
          { title: 'Grand Island Boat Cruise & Snorkeling', description: 'Boat trip to Grand Island for scuba diving, snorkeling, and spotting wild Indo-Pacific dolphins.', timeSlot: '08:30 AM - 02:30 PM', location: 'Grand Island Jetty', estimatedCost: 45, category: 'outdoor' },
          { title: 'Sinquerim Fort & Lighthouse Walk', description: 'Visit historic 1612 Portuguese fort overlooking Aguada bay.', timeSlot: '04:00 PM - 06:30 PM', location: 'Sinquerim Beach', estimatedCost: 0, category: 'sightseeing' },
        ],
      },
      {
        title: 'Arambol Sunset Drum Circle & Unwind',
        activities: [
          { title: 'Arambol Sweet Water Lake Hike', description: 'Walk around Arambol cliffside trail to hidden freshwater lake surrounded by jungle trees.', timeSlot: '10:00 AM - 01:00 PM', location: 'Arambol Beach, North Goa', estimatedCost: 5, category: 'outdoor' },
          { title: 'Arambol Beach Sunset Drum Circle', description: 'Join international travelers for evening acoustic music, fire spinners, and beach sunset.', timeSlot: '05:00 PM - 07:30 PM', location: 'Arambol Beachfront', estimatedCost: 0, category: 'relaxation' },
          { title: 'Farewell Beach Shack Dinner', description: 'Celebrate end of Goa trip with candlelit beachside seafood platter and music.', timeSlot: '08:00 PM - 10:30 PM', location: 'Morjim Coast', estimatedCost: 30, category: 'food' },
        ],
      },
    ],
  },
  paris: {
    destinationName: 'Paris, France',
    days: [
      {
        title: 'Eiffel Tower & Seine River Exploration',
        activities: [
          { title: 'Eiffel Tower Summit & Champ de Mars', description: 'Ascend Paris\' iconic landmark for panoramic views across the Seine and city skyline.', timeSlot: '09:00 AM - 12:00 PM', location: 'Champ de Mars, 7th Arrondissement', estimatedCost: 32, category: 'sightseeing' },
          { title: 'Traditional French Bistro Lunch', description: 'Savor classic Croque Monsieur, Duck Confit, and French wine at a historic street bistro.', timeSlot: '12:30 PM - 02:00 PM', location: 'Le Marais District', estimatedCost: 40, category: 'food' },
          { title: 'Seine River Cruise & Louvre Gardens', description: 'Scenic glass-canopy boat cruise past Notre-Dame and stroll through Tuileries Garden.', timeSlot: '02:30 PM - 05:30 PM', location: 'Quai de la Bourdonnais', estimatedCost: 18, category: 'culture' },
          { title: 'Montmartre & Sacré-Cœur Sunset', description: 'Explore bohemian artists\' square Place du Tertre and view sunset from Sacré-Cœur steps.', timeSlot: '06:00 PM - 09:00 PM', location: 'Montmartre Hill', estimatedCost: 25, category: 'nightlife' },
        ],
      },
      {
        title: 'Louvre Art & Historic Le Marais',
        activities: [
          { title: 'Louvre Museum & Mona Lisa Tour', description: 'View world masterpieces including Venus de Milo, Winged Victory, and Da Vinci\'s Mona Lisa.', timeSlot: '09:00 AM - 12:30 PM', location: 'Rue de Rivoli, 1st Arrondissement', estimatedCost: 22, category: 'culture' },
          { title: 'French Bakery & Macaron Tasting', description: 'Sample fresh croissants, pain au chocolat, and colorful macarons at Pierre Hermé.', timeSlot: '01:00 PM - 02:30 PM', location: 'Saint-Germain-des-Prés', estimatedCost: 15, category: 'food' },
          { title: 'Musée d\'Orsay Impressionist Gallery', description: 'Marvel at Monet, Van Gogh, and Degas inside a grand former railway station.', timeSlot: '03:00 PM - 05:30 PM', location: '1 Rue de la Légion d\'Honneur', estimatedCost: 16, category: 'culture' },
          { title: 'Latin Quarter Dinner & Jazz Club', description: 'Atmospheric French candlelit dinner followed by live jazz music in underground cellar bars.', timeSlot: '07:00 PM - 10:00 PM', location: 'Quartier Latin', estimatedCost: 55, category: 'nightlife' },
        ],
      },
      {
        title: 'Royal Versailles Day Expedition',
        activities: [
          { title: 'Palace of Versailles Hall of Mirrors', description: 'Guided exploration of Louis XIV\'s opulent royal palace and gilded Hall of Mirrors.', timeSlot: '09:30 AM - 01:00 PM', location: 'Versailles Palace', estimatedCost: 28, category: 'culture' },
          { title: 'Versailles Royal Gardens & Grand Canal', description: 'Stroll through fountains, manicured lawns, and rent a rowboat on the Grand Canal.', timeSlot: '01:30 PM - 04:00 PM', location: 'Versailles Estate', estimatedCost: 12, category: 'outdoor' },
          { title: 'Champs-Élysées & Arc de Triomphe Sunset', description: 'Walk Paris\' premier avenue and watch evening city lights from top of Arc de Triomphe.', timeSlot: '05:30 PM - 08:30 PM', location: 'Place Charles de Gaulle', estimatedCost: 15, category: 'sightseeing' },
        ],
      },
      {
        title: 'Palais Garnier & Luxury Shopping',
        activities: [
          { title: 'Palais Garnier Opera House Tour', description: 'Admire Phantom of the Opera\'s legendary inspiration with marble staircases and ceiling frescoes.', timeSlot: '10:00 AM - 12:30 PM', location: 'Place de l\'Opéra', estimatedCost: 14, category: 'culture' },
          { title: 'Galeries Lafayette Rooftop View & Lunch', description: 'Gourmet shopping and free panoramic terrace views over Opera and Eiffel Tower.', timeSlot: '01:00 PM - 03:30 PM', location: 'Boulevard Haussmann', estimatedCost: 35, category: 'food' },
          { title: 'Luxembourg Gardens Relaxation', description: 'Sit by the Medici Fountain in Paris\' favorite peaceful park.', timeSlot: '04:00 PM - 06:00 PM', location: '6th Arrondissement', estimatedCost: 0, category: 'relaxation' },
        ],
      },
      {
        title: 'Sainte-Chapelle Glass & Latin Quarter',
        activities: [
          { title: 'Sainte-Chapelle Stained Glass Marvel', description: 'Behold 1,113 towering 13th-century stained glass windows illustrating biblical history.', timeSlot: '09:30 AM - 11:30 AM', location: 'Île de la Cité', estimatedCost: 11, category: 'culture' },
          { title: 'Shakespeare and Company Bookshop Visit', description: 'Explore historic English-language bookstore frequented by Hemingway and Fitzgerald.', timeSlot: '12:00 PM - 02:00 PM', location: 'Rue de la Bûcherie', estimatedCost: 0, category: 'culture' },
          { title: 'Panthéon Crypt & Latin Quarter Dinner', description: 'Visit burial vaults of Victor Hugo, Voltaire, and Marie Curie.', timeSlot: '03:00 PM - 07:00 PM', location: 'Place du Panthéon', estimatedCost: 18, category: 'culture' },
        ],
      },
    ],
  },
  bali: {
    destinationName: 'Bali, Indonesia',
    days: [
      {
        title: 'Ubud Culture, Rice Terraces & Monkeys',
        activities: [
          { title: 'Sacred Ubud Monkey Forest Sanctuary', description: 'Walk through lush jungle trails inhabited by over 700 playful Balinese long-tailed macaques.', timeSlot: '08:30 AM - 11:00 AM', location: 'Monkey Forest Rd, Ubud', estimatedCost: 6, category: 'outdoor' },
          { title: 'Tegalalang Rice Terraces & Swing', description: 'Iconic emerald green stepped rice fields with giant swing photo opportunities.', timeSlot: '11:30 AM - 02:00 PM', location: 'Tegalalang, Gianyar', estimatedCost: 10, category: 'sightseeing' },
          { title: 'Organic Farm-to-Table Lunch', description: 'Fresh Balinese Nasi Campur and coconut smoothies overlooking jungle ravines.', timeSlot: '02:30 PM - 04:00 PM', location: 'Ubud Highlands', estimatedCost: 15, category: 'food' },
          { title: 'Traditional Balinese Spa & Massage', description: 'Relaxing 90-minute flower bath and aromatherapy massage with herbal oils.', timeSlot: '05:00 PM - 07:00 PM', location: 'Ubud Wellness Center', estimatedCost: 25, category: 'relaxation' },
        ],
      },
      {
        title: 'Cliffside Temples & Beach Sunset',
        activities: [
          { title: 'Uluwatu Cliff Temple Visit', description: 'Majestic temple perched on 70-meter steep sea cliffs above crashing Indian Ocean waves.', timeSlot: '09:30 AM - 12:00 PM', location: 'Pecatu, South Kuta', estimatedCost: 4, category: 'culture' },
          { title: 'Padang Padang Beach Swim', description: 'Hidden beach cove with turquoise water framed by dramatic hollowed rock caves.', timeSlot: '01:00 PM - 04:00 PM', location: 'Uluwatu Coast', estimatedCost: 2, category: 'relaxation' },
          { title: 'Kecak Fire Dance at Sunset', description: 'Captivating traditional chanting and fire dance performance on cliffside amphitheater.', timeSlot: '05:30 PM - 07:00 PM', location: 'Uluwatu Amphitheater', estimatedCost: 12, category: 'culture' },
          { title: 'Jimbaran Bay Seafood Candlelit BBQ', description: 'Dine on fresh grilled snapper and king prawns right on the sandy beach under starlight.', timeSlot: '07:30 PM - 09:30 PM', location: 'Jimbaran Beach', estimatedCost: 35, category: 'food' },
        ],
      },
      {
        title: 'Nusa Penida Island Adventure',
        activities: [
          { title: 'Speedboat to Nusa Penida & Kelingking Beach', description: 'Visit the world-famous T-Rex shaped green cliff overlooking pristine turquoise waters.', timeSlot: '07:00 AM - 12:00 PM', location: 'Nusa Penida Island', estimatedCost: 45, category: 'outdoor' },
          { title: 'Angel\'s Billabong & Broken Beach', description: 'Natural infinity pool and spectacular rock arch bridge over oceanic whirlpools.', timeSlot: '12:30 PM - 03:00 PM', location: 'Nusa Penida West Coast', estimatedCost: 5, category: 'sightseeing' },
          { title: 'Crystal Bay Snorkeling with Manta Rays', description: 'Snorkel among colorful coral reefs and gentle manta rays in crystal clear sea.', timeSlot: '03:30 PM - 06:00 PM', location: 'Crystal Bay Cove', estimatedCost: 20, category: 'outdoor' },
        ],
      },
      {
        title: 'Mount Batur Volcano Sunrise Trek',
        activities: [
          { title: 'Mount Batur Sunrise Trekking', description: 'Early morning hike to 1,717m volcanic summit to watch sunrise over Lake Batur.', timeSlot: '03:30 AM - 09:00 AM', location: 'Kintamani Highlands', estimatedCost: 35, category: 'outdoor' },
          { title: 'Toya Devasya Natural Hot Springs', description: 'Soak tired muscles in infinity hot spring pools facing Mount Batur lake.', timeSlot: '10:00 AM - 01:00 PM', location: 'Toya Bungkah', estimatedCost: 18, category: 'relaxation' },
          { title: 'Luwak Coffee Plantation Tour', description: 'Sample Balinese coffee, spices, and famous Kopi Luwak overlooking valley.', timeSlot: '02:00 PM - 04:30 PM', location: 'Kintamani Valley', estimatedCost: 10, category: 'food' },
        ],
      },
      {
        title: 'Seminyak Beach Clubs & Nightlife',
        activities: [
          { title: 'Canggu Surfing Lesson & Beach Walk', description: 'Beginner-friendly surf session with professional instructors on Batu Bolong beach.', timeSlot: '09:00 AM - 11:30 AM', location: 'Canggu Coast', estimatedCost: 25, category: 'outdoor' },
          { title: 'Potato Head Beach Club Relaxation', description: 'Lounge by beachfront infinity pool with signature tropical cocktails and DJ beats.', timeSlot: '01:00 PM - 05:30 PM', location: 'Seminyak Beachfront', estimatedCost: 40, category: 'relaxation' },
          { title: 'Seminyak Fine Dining & Night Lounge', description: 'Asian fusion gastronomy followed by vibrant nightlife lounges in Seminyak.', timeSlot: '07:00 PM - 10:30 PM', location: 'Jalan Kayu Aya', estimatedCost: 45, category: 'nightlife' },
        ],
      },
    ],
  },
  dubai: {
    destinationName: 'Dubai, UAE',
    days: [
      {
        title: 'Burj Khalifa & Modern Wonders',
        activities: [
          { title: 'Burj Khalifa 148th Floor At the Top', description: 'Ascend world\'s tallest skyscraper for breathtaking views over Dubai desert and coastline.', timeSlot: '09:00 AM - 11:30 AM', location: 'Downtown Dubai', estimatedCost: 95, category: 'sightseeing' },
          { title: 'Dubai Mall & Aquarium Exploration', description: 'Shop world-class luxury brands and visit massive indoor oceanarium with sharks.', timeSlot: '12:00 PM - 03:30 PM', location: 'Dubai Mall Promenade', estimatedCost: 40, category: 'culture' },
          { title: 'Dubai Fountain & Laser Show', description: 'Watch world\'s largest choreographed water fountain dance set to music and lights.', timeSlot: '06:30 PM - 08:30 PM', location: 'Burj Lake Plaza', estimatedCost: 0, category: 'nightlife' },
        ],
      },
      {
        title: 'Desert Safari & Bedouin Camp',
        activities: [
          { title: 'Red Dune Bashing & Quad Biking', description: 'Thrilling 4x4 Land Cruiser dune bashing across golden Lahbab desert dunes.', timeSlot: '02:30 PM - 05:00 PM', location: 'Lahbab Red Dunes', estimatedCost: 65, category: 'outdoor' },
          { title: 'Camel Riding & Sandboarding', description: 'Glide down steep sand dunes and ride camels across sunset desert backdrop.', timeSlot: '05:00 PM - 06:30 PM', location: 'Desert Oasis', estimatedCost: 15, category: 'outdoor' },
          { title: 'Bedouin Camp BBQ & Tanoura Show', description: 'Buffet dinner under stars with belly dancing, henna tattoos, and shisha pipe.', timeSlot: '06:30 PM - 09:30 PM', location: 'Al Khayma Camp', estimatedCost: 40, category: 'food' },
        ],
      },
      {
        title: 'Future Tech & Palm Jumeirah',
        activities: [
          { title: 'Museum of the Future Exhibition', description: 'Step into year 2071 with immersive AI exhibits, space station simulations, and green tech.', timeSlot: '09:30 AM - 12:00 PM', location: 'Sheikh Zayed Road', estimatedCost: 42, category: 'culture' },
          { title: 'Palm Jumeirah Monorail & Atlantis', description: 'Scenic monorail ride across palm-shaped island to Atlantis Aquaventure waterpark.', timeSlot: '01:00 PM - 05:30 PM', location: 'Palm Jumeirah Crescent', estimatedCost: 80, category: 'outdoor' },
          { title: 'Dubai Marina Luxury Yacht Dinner', description: 'Glide along illuminated Marina towers onboard a 5-star glass dinner cruiser.', timeSlot: '07:30 PM - 10:00 PM', location: 'Dubai Marina Yacht Club', estimatedCost: 85, category: 'nightlife' },
        ],
      },
      {
        title: 'Gold Souk Abra Boat & Old Dubai',
        activities: [
          { title: 'Gold & Spice Souk Walking Tour', description: 'Explore traditional Arabian bazaars overflowing with gold jewelry, spices, and perfumes.', timeSlot: '09:30 AM - 12:00 PM', location: 'Deira, Old Dubai', estimatedCost: 10, category: 'culture' },
          { title: 'Traditional Wooden Abra Boat Crossing', description: 'Cross Dubai Creek on iconic 1-dirham wooden boat to Al Fahidi Quarter.', timeSlot: '12:15 PM - 01:30 PM', location: 'Dubai Creek Pier', estimatedCost: 2, category: 'sightseeing' },
          { title: 'Al Fahidi Historical Quarter & Coffee Museum', description: 'Wander 19th-century wind-tower buildings and sample authentic Arabic cardamom coffee.', timeSlot: '02:00 PM - 05:00 PM', location: 'Bur Dubai Historic District', estimatedCost: 12, category: 'culture' },
        ],
      },
      {
        title: 'Miracle Garden & Global Village',
        activities: [
          { title: 'Dubai Miracle Garden Floral Wonders', description: 'Walk through world\'s largest natural flower garden featuring 150 million blooming flowers.', timeSlot: '10:00 AM - 01:00 PM', location: 'Al Barsha South', estimatedCost: 25, category: 'outdoor' },
          { title: 'Global Village International Pavilions', description: 'Explore 90 country cultural pavilions, street performances, and global food stalls.', timeSlot: '04:00 PM - 09:30 PM', location: 'Sheikh Mohammed Bin Zayed Rd', estimatedCost: 20, category: 'sightseeing' },
        ],
      },
    ],
  },
  tokyo: {
    destinationName: 'Tokyo, Japan',
    days: [
      {
        title: 'Asakusa Culture & Skytree Views',
        activities: [
          { title: 'Explore Senso-ji Temple & Nakamise', description: 'Tokyo\'s oldest Buddhist temple with traditional craft shops and red paper lanterns.', timeSlot: '09:30 AM - 12:00 PM', location: 'Asakusa, Taito City', estimatedCost: 0, category: 'culture' },
          { title: 'Authentic Sukiyaki & Ramen Lunch', description: 'Savor rich pork broth ramen and sliced Wagyu beef in Asakusa alleyways.', timeSlot: '12:30 PM - 02:00 PM', location: 'Nishi-Asakusa', estimatedCost: 25, category: 'food' },
          { title: 'Sumida River Cruise to Hama-rikyu', description: 'Scenic water bus cruise passing beneath Tokyo bridges to floating teahouse gardens.', timeSlot: '02:30 PM - 05:00 PM', location: 'Sumida River Pier', estimatedCost: 15, category: 'relaxation' },
        ],
      },
      {
        title: 'Shibuya Crossing & Harajuku Culture',
        activities: [
          { title: 'Meiji Jingu Shrine Forest Stroll', description: 'Tranquil Shinto shrine enclosed in 120,000 evergreen trees in central Shibuya.', timeSlot: '09:00 AM - 11:00 AM', location: 'Yoyogikamizonocho, Shibuya', estimatedCost: 0, category: 'culture' },
          { title: 'Takeshita Street Crepes & Kawaii Fashion', description: 'Explore Harajuku pop culture, youth fashion boutiques, and famous dessert crepes.', timeSlot: '11:15 AM - 01:00 PM', location: 'Jingumae, Harajuku', estimatedCost: 10, category: 'sightseeing' },
          { title: 'Shibuya Scramble Crossing & Shibuya Sky', description: 'Cross world\'s busiest intersection and visit 47th-floor open-air rooftop deck.', timeSlot: '02:00 PM - 05:00 PM', location: 'Shibuya Station Square', estimatedCost: 20, category: 'sightseeing' },
        ],
      },
      {
        title: 'teamLab Digital Art & Odaiba Bay',
        activities: [
          { title: 'teamLab Planets Digital Art Exhibition', description: 'Immersive barefoot digital art museum — walk through crystal water and orchid installations.', timeSlot: '09:00 AM - 11:30 AM', location: 'Toyosu, Koto City', estimatedCost: 28, category: 'outdoor' },
          { title: 'Toyosu Fish Market Fresh Sushi Lunch', description: 'Ultra-fresh omakase sushi from world\'s premier seafood market.', timeSlot: '12:00 PM - 02:00 PM', location: 'Toyosu Outer Market', estimatedCost: 45, category: 'food' },
          { title: 'Odaiba Seaside Park & Rainbow Bridge Sunset', description: 'Stroll waterfront beach with views of Statue of Liberty replica and illuminated bridge.', timeSlot: '03:30 PM - 07:00 PM', location: 'Daiba, Minato City', estimatedCost: 0, category: 'relaxation' },
        ],
      },
      {
        title: 'Akihabara Tech & Ueno Park',
        activities: [
          { title: 'Ueno Park & Toshogu Golden Shrine', description: 'Sprawling park housing national museums, lotus ponds, and Edo-period shrine.', timeSlot: '09:30 AM - 12:00 PM', location: 'Uenokoen, Taito City', estimatedCost: 5, category: 'culture' },
          { title: 'Ameyoko Market Street Food Tasting', description: 'Bustling open-air market selling seafood skewers, fresh fruits, and green tea snacks.', timeSlot: '12:15 PM - 01:45 PM', location: 'Ueno Market Alley', estimatedCost: 12, category: 'food' },
          { title: 'Akihabara Electric Town Arcade Exploration', description: 'Epicenter of anime merchandise, retro video game arcades, and multi-story electronics.', timeSlot: '02:15 PM - 06:00 PM', location: 'Sotokanda, Chiyoda City', estimatedCost: 15, category: 'culture' },
        ],
      },
      {
        title: 'Imperial Palace & Ginza Kaiseki Banquet',
        activities: [
          { title: 'Imperial Palace East Gardens Walk', description: 'Historic ruins of Edo Castle surrounded by koi ponds and Japanese gardens.', timeSlot: '09:30 AM - 11:30 AM', location: 'Chiyoda, Chiyoda City', estimatedCost: 0, category: 'outdoor' },
          { title: 'Ginza Luxury Shopping & Architecture', description: 'High-end boutiques, department stores, and modern architectural galleries.', timeSlot: '12:30 PM - 03:30 PM', location: 'Ginza, Chuo City', estimatedCost: 30, category: 'sightseeing' },
          { title: 'Farewell Kaiseki Multi-Course Banquet', description: 'Traditional seasonal multi-course Japanese fine dining to conclude expedition.', timeSlot: '06:30 PM - 09:30 PM', location: 'Ginza District', estimatedCost: 95, category: 'food' },
        ],
      },
    ],
  },
};

/**
 * Transform activities dynamically based on travel style (Budget, Luxury, Adventure, Family, Balanced)
 */
function customizeActivityByStyle(act: RawActivity, style: string): RawActivity {
  const s = style.toLowerCase();
  let cost = act.estimatedCost;
  let title = act.title;
  let desc = act.description;
  let cat = act.category;

  if (s === 'budget') {
    cost = Math.round(cost * 0.4);
    if (cost === 0 || cat === 'food') cost = Math.min(cost, 12);
    title = title.replace(/Luxury|Gourmet|VIP|Private|Banquet|5-Star/gi, 'Local');
    if (!title.toLowerCase().includes('budget') && !title.toLowerCase().includes('local')) {
      title = `Budget ${title}`;
    }
    desc = `${desc} (Budget-friendly self-guided option with local discounts).`;
  } else if (s === 'luxury') {
    cost = Math.max(Math.round(cost * 2.8), 85);
    title = title.replace(/Walk|Stroll|Standard|Basic/gi, 'Private VIP');
    if (!title.toLowerCase().includes('luxury') && !title.toLowerCase().includes('vip') && !title.toLowerCase().includes('exclusive')) {
      title = `Exclusive ${title}`;
    }
    desc = `Premium VIP experience: ${desc} Includes chauffeur transfer, champagne access, and private guide.`;
    if (cat === 'food') cat = 'food';
  } else if (s === 'adventure') {
    cost = Math.round(cost * 1.2);
    if (cat === 'sightseeing' || cat === 'relaxation') cat = 'outdoor';
    title = title.replace(/Stroll|Walk|Relaxation|Tea/gi, 'Trek & Adventure');
    if (!title.toLowerCase().includes('trail') && !title.toLowerCase().includes('expedition') && !title.toLowerCase().includes('trek')) {
      title = `${title} Expedition`;
    }
    desc = `High-energy outdoor experience: ${desc} Includes gear rentals and guided trail access.`;
  } else if (s === 'family') {
    cost = Math.round(cost * 1.1);
    if (cat === 'nightlife') cat = 'relaxation';
    title = title.replace(/Bar|Nightclub|Pub|Cocktail/gi, 'Family Evening Walk');
    if (!title.toLowerCase().includes('family') && !title.toLowerCase().includes('kids')) {
      title = `Family-Friendly ${title}`;
    }
    desc = `Kid-friendly & relaxed pacing: ${desc} Perfect for all age groups with easy access.`;
  }

  return {
    ...act,
    title,
    description: desc,
    estimatedCost: cost,
    category: cat,
  };
}

/**
 * Fallback static mock trip generator when Gemini API key is missing or fails.
 */
function getMockItinerary(promptText: string): GeneratedItinerary {
  const lowerPrompt = promptText.toLowerCase();

  // 1. Identify Match City
  let matchedKey = Object.keys(CITY_DESTINATION_DATA).find((key) => lowerPrompt.includes(key));
  let destination = matchedKey ? CITY_DESTINATION_DATA[matchedKey].destinationName : '';

  if (!destination) {
    if (lowerPrompt.includes('japan') || lowerPrompt.includes('tokyo')) destination = 'Tokyo, Japan';
    else if (lowerPrompt.includes('france') || lowerPrompt.includes('paris')) destination = 'Paris, France';
    else if (lowerPrompt.includes('indonesia') || lowerPrompt.includes('bali')) destination = 'Bali, Indonesia';
    else if (lowerPrompt.includes('italy') || lowerPrompt.includes('rome')) destination = 'Rome, Italy';
    else if (lowerPrompt.includes('uk') || lowerPrompt.includes('london')) destination = 'London, UK';
    else if (lowerPrompt.includes('uae') || lowerPrompt.includes('dubai')) destination = 'Dubai, UAE';
    else if (lowerPrompt.includes('usa') || lowerPrompt.includes('york')) destination = 'New York City, USA';
    else if (lowerPrompt.includes('india') || lowerPrompt.includes('goa')) destination = 'Goa, India';
    else if (lowerPrompt.includes('swiss') || lowerPrompt.includes('switzerland')) destination = 'Swiss Alps, Switzerland';
    else {
      const destMatch = promptText.match(/(?:to|in|visit|explore)\s+([A-Z][a-zA-Z\s,]+?)(?:\s+for|\s+with|\s+on|\.|$)/);
      destination = destMatch && destMatch[1] ? destMatch[1].trim() : 'Tokyo, Japan';
    }
  }

  // 2. Extract Duration Days
  let durationDays = 5;
  const daysMatch = lowerPrompt.match(/(\d+)\s*-\s*day|(\d+)\s*day/);
  if (daysMatch) {
    const parsedDays = parseInt(daysMatch[1] || daysMatch[2], 10);
    if (parsedDays >= 1 && parsedDays <= 14) durationDays = parsedDays;
  }

  // 3. Extract Travel Style
  let travelStyle = 'balanced';
  if (lowerPrompt.includes('budget') || lowerPrompt.includes('cheap') || lowerPrompt.includes('backpacker')) travelStyle = 'budget';
  else if (lowerPrompt.includes('luxury') || lowerPrompt.includes('5-star') || lowerPrompt.includes('vip')) travelStyle = 'luxury';
  else if (lowerPrompt.includes('adventure') || lowerPrompt.includes('hiking') || lowerPrompt.includes('thrill')) travelStyle = 'adventure';
  else if (lowerPrompt.includes('family') || lowerPrompt.includes('kids')) travelStyle = 'family';

  // 4. Extract Budget & Currency
  let currency = 'USD';
  if (lowerPrompt.includes('₹') || lowerPrompt.includes('inr') || lowerPrompt.includes('rupees')) currency = 'INR';
  else if (lowerPrompt.includes('€') || lowerPrompt.includes('eur') || lowerPrompt.includes('euro')) currency = 'EUR';
  else if (lowerPrompt.includes('£') || lowerPrompt.includes('gbp') || lowerPrompt.includes('pound')) currency = 'GBP';

  let totalBudget = travelStyle === 'luxury' ? 3500 : travelStyle === 'budget' ? 650 : travelStyle === 'adventure' ? 1400 : travelStyle === 'family' ? 2200 : 1800;
  if (currency === 'INR') totalBudget = travelStyle === 'luxury' ? 280000 : travelStyle === 'budget' ? 35000 : travelStyle === 'adventure' ? 75000 : travelStyle === 'family' ? 120000 : 95000;

  const budgetMatch = lowerPrompt.match(/(?:₹|€|£|\$|budget:?|budget of)\s*([\d,]+)/i);
  if (budgetMatch && budgetMatch[1]) {
    const parsedBudget = parseInt(budgetMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(parsedBudget) && parsedBudget > 0) totalBudget = parsedBudget;
  }

  const tripId = crypto.randomUUID ? crypto.randomUUID() : `trip-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // 5. Select Days Data (City specific vs Dynamic fallback)
  const lookupKey = Object.keys(CITY_DESTINATION_DATA).find((k) => destination.toLowerCase().includes(k));
  const cityData = lookupKey ? CITY_DESTINATION_DATA[lookupKey] : null;

  const days = [];
  for (let i = 1; i <= durationDays; i++) {
    let rawTitle = '';
    let rawActivities: RawActivity[] = [];

    if (cityData && cityData.days.length > 0) {
      if (i <= cityData.days.length) {
        const template = cityData.days[i - 1];
        rawTitle = template.title;
        rawActivities = template.activities;
      } else {
        // Beyond preset days: Generate distinct unique day themes dynamically
        const extraThemes = [
          {
            title: `${destination} Nature Reserve & Panoramic Sunset`,
            activities: [
              { title: `${destination} Scenic Nature Trail Hike`, description: `Walk scenic eco-trails and forested paths in ${destination}.`, timeSlot: '09:30 AM - 12:30 PM', location: `${destination} Eco Reserve`, estimatedCost: 15, category: 'outdoor' as const },
              { title: 'Local Vineyard or Craft Cafe Lunch', description: `Enjoy fresh regional produce and coffee in a scenic setting.`, timeSlot: '01:00 PM - 03:00 PM', location: `${destination} Hills`, estimatedCost: 25, category: 'food' as const },
              { title: `${destination} Sunset Cruise & Promenade Walk`, description: `Watch the sunset over ${destination} from a scenic boat deck.`, timeSlot: '05:30 PM - 08:00 PM', location: `${destination} Waterfront`, estimatedCost: 20, category: 'relaxation' as const },
            ],
          },
          {
            title: `${destination} Shopping, Artisan Markets & Evening Music`,
            activities: [
              { title: `${destination} Artisan Souvenir Bazaar`, description: `Shop local handicrafts, fashion, and traditional artwork.`, timeSlot: '10:00 AM - 01:00 PM', location: `${destination} Central Bazaar`, estimatedCost: 30, category: 'sightseeing' as const },
              { title: 'Gourmet Specialty Tasting', description: `Savor multi-course regional lunch with local desserts.`, timeSlot: '01:30 PM - 03:30 PM', location: `${destination} Gourmet Alley`, estimatedCost: 40, category: 'food' as const },
              { title: `${destination} Night Lounge & Acoustic Live Music`, description: `Unwind with live music and cocktails in downtown ${destination}.`, timeSlot: '07:30 PM - 10:30 PM', location: `${destination} Downtown`, estimatedCost: 35, category: 'nightlife' as const },
            ],
          },
        ];
        const extraTemplate = extraThemes[(i - cityData.days.length - 1) % extraThemes.length];
        rawTitle = extraTemplate.title;
        rawActivities = extraTemplate.activities;
      }
    } else {
      const dynamicTemplates = [
        {
          title: `${destination} Heritage Walk & Landmark Tour`,
          activities: [
            { title: `${destination} Historic Center & Grand Cathedral`, description: `Explore iconic architecture, historical monuments, and cobblestone plazas in ${destination}.`, timeSlot: '09:30 AM - 12:00 PM', location: `${destination} Central Quarter`, estimatedCost: 25, category: 'culture' as const },
            { title: 'Local Culinary Tasting Lunch', description: `Sample signature local specialties and dishes at a top-rated ${destination} bistro.`, timeSlot: '12:30 PM - 02:00 PM', location: `${destination} Old Market Square`, estimatedCost: 35, category: 'food' as const },
            { title: `${destination} Observation Deck & Viewpoint`, description: `Ascend ${destination}'s premier viewpoint for panoramic photos over the city skyline.`, timeSlot: '02:30 PM - 05:30 PM', location: `${destination} Panorama Deck`, estimatedCost: 20, category: 'sightseeing' as const },
          ],
        },
        {
          title: `Art, Culture & Waterfront Discovery in ${destination}`,
          activities: [
            { title: `${destination} National Museum & Art Gallery`, description: `Immerse in world-class art collections, historical artifacts, and exhibitions.`, timeSlot: '09:00 AM - 11:45 AM', location: `${destination} Museum District`, estimatedCost: 18, category: 'culture' as const },
            { title: 'Scenic Promenade Walk & Cafe Lounge', description: `Relax along ${destination}'s scenic waterfront with specialty coffee and desserts.`, timeSlot: '01:00 PM - 03:00 PM', location: `${destination} Waterfront Pier`, estimatedCost: 12, category: 'relaxation' as const },
            { title: 'Night Market & Sunset Dinner', description: `Vibrant evening night market featuring local craft vendors and acoustic live music.`, timeSlot: '06:00 PM - 08:30 PM', location: `${destination} Riverside Market`, estimatedCost: 30, category: 'food' as const },
          ],
        },
      ];
      const template = dynamicTemplates[(i - 1) % dynamicTemplates.length];
      rawTitle = template.title;
      rawActivities = template.activities;
    }

    const cleanTitle = rawTitle.replace(/^Day\s+\d+:\s*/i, '');
    const dayTitle = `Day ${i}: ${cleanTitle}`;
    const styledActivities = rawActivities.map((act) => customizeActivityByStyle(act, travelStyle));

    days.push({
      dayNumber: i,
      title: dayTitle,
      activities: styledActivities.map((act, actIdx) => ({
        ...act,
        id: `${tripId}-act-${i}-${actIdx + 1}`,
        isCompleted: false,
        isFavorite: false,
        notes: '',
      })),
    });
  }

  return {
    id: tripId,
    title: `${durationDays}-Day ${travelStyle.charAt(0).toUpperCase() + travelStyle.slice(1)} Trip to ${destination}`,
    destination,
    durationDays,
    travelStyle,
    totalBudget,
    currency,
    createdAt: new Date().toISOString(),
    days,
  };
}

export const geminiService = {
  async generateTrip(promptText: string): Promise<GeneratedItinerary> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.warn('⚠️ GEMINI_API_KEY environment variable is missing or set to placeholder. Falling back to style-customized mock data.');
      return getMockItinerary(promptText);
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash-latest',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const tripId = crypto.randomUUID ? crypto.randomUUID() : `trip-${Date.now()}`;

      const instruction = `
You are a premium AI trip planning assistant. Generate a highly detailed, realistic trip itinerary in JSON format based on the user's travel request.
The output MUST strictly match the following JSON schema (all fields required):
{
  "title": "string (e.g. Kyoto 5-Day Cultural Expedition)",
  "destination": "string (e.g. Kyoto, Japan)",
  "durationDays": "number (number of days in the trip — must match the number of day objects)",
  "travelStyle": "string — one of: budget | balanced | luxury | adventure | family",
  "totalBudget": "number (estimated total cost as a plain number, no currency symbols)",
  "currency": "string (e.g. USD, EUR, INR, GBP)",
  "days": [
    {
      "dayNumber": "number (starting from 1)",
      "title": "string (the theme of the day)",
      "activities": [
        {
          "title": "string (name of the activity)",
          "description": "string (2-3 sentence description)",
          "timeSlot": "string (e.g. 09:00 AM - 11:30 AM)",
          "location": "string (specific location or neighbourhood)",
          "estimatedCost": "number (cost in the trip's currency, plain number)",
          "category": "one of exactly: sightseeing | food | outdoor | culture | relaxation | nightlife"
        }
      ]
    }
  ]
}

Rules:
- Include 3-5 activities per day.
- Every single day MUST be completely unique with distinct titles, activities, and spots. Do NOT repeat previous day titles or activities.
- Make the activities match the requested travel style (budget, luxury, adventure, family, or balanced) in pricing, tone, and activity type!
- All estimated costs must be realistic numbers (no strings, no currency signs).
- Ensure the number of day objects matches durationDays exactly.
- Do not return any text before or after the JSON payload. No markdown code fences.
`;

      const result = await model.generateContent([
        { text: instruction },
        { text: `User request: ${promptText}` },
      ]);

      const textResponse = result.response.text();
      if (!textResponse) {
        throw new Error('Empty response received from Gemini API');
      }

      const cleanedText = textResponse.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

      try {
        const parsedItinerary = JSON.parse(cleanedText);
        if (!parsedItinerary || typeof parsedItinerary !== 'object' || !Array.isArray(parsedItinerary.days)) {
          throw new Error('Malformed JSON structure: missing days array');
        }

        const enriched: GeneratedItinerary = {
          ...parsedItinerary,
          id: tripId,
          createdAt: new Date().toISOString(),
          days: parsedItinerary.days.map((day: { dayNumber: number; title: string; activities: object[] }, dIdx: number) => {
            const cleanTitle = (day.title || '').replace(/^Day\s+\d+:\s*/i, '');
            return {
              ...day,
              title: `Day ${dIdx + 1}: ${cleanTitle}`,
              activities: day.activities.map((act: object, aIdx: number) => ({
                ...act,
                id: `${tripId}-act-${dIdx + 1}-${aIdx + 1}`,
                isCompleted: false,
                isFavorite: false,
                notes: '',
              })),
            };
          }),
        };

        return enriched;
      } catch (jsonErr) {
        console.warn('⚠️ Gemini returned non-parsable or malformed JSON. Using style mock fallback.', jsonErr);
        return getMockItinerary(promptText);
      }
    } catch (error) {
      console.error('❌ Failed to generate itinerary via Gemini API. Falling back to style mock data:', error);
      return getMockItinerary(promptText);
    }
  },
};
