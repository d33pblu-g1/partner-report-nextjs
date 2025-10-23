'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';

interface Event {
  id: number;
  title: string;
  type: 'webinar' | 'conference' | 'training' | 'meeting';
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  attendees?: number;
  description: string;
}

export default function EventsPage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  // Mock events data - in production, this would come from an API
  const events: Event[] = [
    {
      id: 1,
      title: 'Partner Onboarding Webinar',
      type: 'webinar',
      date: '2025-11-15',
      time: '14:00 UTC',
      location: 'Online',
      status: 'upcoming',
      attendees: 45,
      description: 'Learn about our partner program, commission structure, and marketing tools.',
    },
    {
      id: 2,
      title: 'Quarterly Business Review',
      type: 'meeting',
      date: '2025-11-20',
      time: '10:00 UTC',
      location: 'Online',
      status: 'upcoming',
      attendees: 12,
      description: 'Review Q3 performance and discuss Q4 strategy with top partners.',
    },
    {
      id: 3,
      title: 'Advanced Trading Strategies Workshop',
      type: 'training',
      date: '2025-11-25',
      time: '15:00 UTC',
      location: 'Online',
      status: 'upcoming',
      attendees: 78,
      description: 'Deep dive into advanced trading techniques to help your clients succeed.',
    },
    {
      id: 4,
      title: 'Partner Summit 2025',
      type: 'conference',
      date: '2025-12-10',
      time: '09:00 UTC',
      location: 'Dubai, UAE',
      status: 'upcoming',
      attendees: 150,
      description: 'Annual partner conference with networking, workshops, and awards ceremony.',
    },
  ];

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(e => e.status === filter);

  const getEventIcon = (type: string) => {
    const icons = {
      webinar: '🎥',
      conference: '🏛️',
      training: '📚',
      meeting: '👥',
    };
    return icons[type as keyof typeof icons] || '📅';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return colors[status as keyof typeof colors] || '';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      webinar: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      conference: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      training: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      meeting: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    };
    return colors[type as keyof typeof colors] || '';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Events & Training
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Upcoming webinars, conferences, and training sessions
        </p>
      </div>

      {/* Funding Request Notification */}
      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-blue-900 dark:text-blue-100 font-medium">
                Planning an event? We&apos;re here to help. Submit your funding request.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <a
              href="https://forms.clickup.com/20696747/f/kqknb-1211395/9569VCIZQ7525OBH6W?Approval%20Steps=Draft&EVENT%20TYPE=SPONSORSHIP"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Submit a Request
            </a>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All Events ({events.length})
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'upcoming'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Upcoming ({events.filter(e => e.status === 'upcoming').length})
        </button>
        <button
          onClick={() => setFilter('ongoing')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'ongoing'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Ongoing ({events.filter(e => e.status === 'ongoing').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'completed'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Completed ({events.filter(e => e.status === 'completed').length})
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-5xl flex-shrink-0">
                  {getEventIcon(event.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <div className="flex gap-2 flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(event.type)}`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">📅</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">🕐</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">📍</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {event.location}
                      </span>
                    </div>
                    {event.attendees && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 dark:text-gray-400">👥</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {event.attendees} registered
                        </span>
                      </div>
                    )}
                  </div>

                  {event.status === 'upcoming' && (
                    <div className="mt-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Register Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No events found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No events match your filter criteria
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

