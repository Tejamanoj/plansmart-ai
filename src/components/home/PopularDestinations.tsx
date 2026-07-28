import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { MapPin, ArrowRight, Star } from 'lucide-react';

export const PopularDestinations: React.FC = () => {
  const destinations = [
    {
      city: 'Tokyo',
      country: 'Japan',
      tagline: 'Futuristic Metropolises & Ancient Temples',
      days: '5-7 Days',
      avgBudget: '$1,850',
      rating: '4.9',
      style: 'Balanced',
      badgeVariant: 'purple' as const,
    },
    {
      city: 'Paris',
      country: 'France',
      tagline: 'Art, Architecture & World-Class Gastronomy',
      days: '4-6 Days',
      avgBudget: '$2,100',
      rating: '4.8',
      style: 'Luxury',
      badgeVariant: 'info' as const,
    },
    {
      city: 'Bali',
      country: 'Indonesia',
      tagline: 'Tropical Beaches, Rice Terraces & Wellness',
      days: '7-10 Days',
      avgBudget: '$1,200',
      rating: '4.9',
      style: 'Relaxation',
      badgeVariant: 'success' as const,
    },
    {
      city: 'Rome',
      country: 'Italy',
      tagline: 'Colosseum Landmarks & Authentic Trattorias',
      days: '3-5 Days',
      avgBudget: '$1,650',
      rating: '4.7',
      style: 'Culture',
      badgeVariant: 'warning' as const,
    },
  ];

  return (
    <section className="py-12 space-y-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Popular <span className="gradient-text">Destinations</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Top global travel hubs ready for instant AI plan creation.
          </p>
        </div>
        <Link to="/plan">
          <Button variant="outline" size="sm">
            <span>View All Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {destinations.map((dest, idx) => (
          <Card
            key={idx}
            className="glass-card glass-card-hover p-5 flex flex-col justify-between space-y-5 border border-slate-800"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={dest.badgeVariant}>{dest.style}</Badge>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{dest.rating}</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-400" /> {dest.city}, {dest.country}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{dest.tagline}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                <span>{dest.days}</span>
                <span className="font-semibold text-emerald-400">{dest.avgBudget} est.</span>
              </div>
            </div>

            <Link to={`/plan?destination=${encodeURIComponent(dest.city)}`}>
              <Button variant="secondary" size="sm" className="w-full justify-between">
                <span>Generate Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
};
