'use client';

import { useState } from 'react';
import { Plus, Calendar, Megaphone, Pin, Trash2, Edit2 } from 'lucide-react';
import { EventWithRsvps, Announcement, RsvpStatus } from '@/lib/events';
import { EventCard } from './EventCard';
import { EventForm } from './EventForm';
import { AnnouncementForm } from './AnnouncementForm';

interface EventsListProps {
  events: EventWithRsvps[];
  announcements: Announcement[];
  timezone: string;
  clanId: string;
  userId: string;
  canManage: boolean;
  onCreateEvent: (event: Parameters<typeof EventForm>[0]['onSubmit'] extends (e: infer E) => Promise<void> ? E : never) => Promise<void>;
  onUpdateEvent: (id: string, updates: Partial<EventWithRsvps>) => Promise<void>;
  onCancelEvent: (id: string) => Promise<void>;
  onRsvp: (eventId: string, status: RsvpStatus) => Promise<void>;
  onCreateAnnouncement: (announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdateAnnouncement: (id: string, updates: Partial<Announcement>) => Promise<void>;
  onDeleteAnnouncement: (id: string) => Promise<void>;
}

export function EventsList({
  events,
  announcements,
  timezone,
  clanId,
  userId,
  canManage,
  onCreateEvent,
  onUpdateEvent,
  onCancelEvent,
  onRsvp,
  onCreateAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
}: EventsListProps) {
  const [showEventForm, setShowEventForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventWithRsvps | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Split events into upcoming and past
  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.starts_at) >= now || !e.is_cancelled);
  const pinnedAnnouncements = announcements.filter(a => a.is_pinned);
  const recentAnnouncements = announcements.filter(a => !a.is_pinned).slice(0, 5);

  const handleCreateEvent = async (eventData: Parameters<typeof onCreateEvent>[0]) => {
    await onCreateEvent(eventData);
    setShowEventForm(false);
  };

  const handleEditEvent = async (eventData: Parameters<typeof onCreateEvent>[0]) => {
    if (editingEvent) {
      await onUpdateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
    }
  };

  const handleCreateAnnouncement = async (data: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) => {
    await onCreateAnnouncement(data);
    setShowAnnouncementForm(false);
  };

  const handleEditAnnouncement = async (data: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingAnnouncement) {
      await onUpdateAnnouncement(editingAnnouncement.id, data);
      setEditingAnnouncement(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pinned Announcements */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Pin size={14} />
            Pinned Announcements
          </h3>
          {pinnedAnnouncements.map(announcement => (
            <div
              key={announcement.id}
              className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-medium text-amber-400">{announcement.title}</h4>
                  <p className="text-slate-300 text-sm mt-1 whitespace-pre-wrap">{announcement.content}</p>
                </div>
                {canManage && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingAnnouncement(announcement)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteAnnouncement(announcement.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Announcements (non-pinned) */}
      {recentAnnouncements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Megaphone size={14} />
            Recent Announcements
          </h3>
          {recentAnnouncements.map(announcement => (
            <div
              key={announcement.id}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-medium text-white">{announcement.title}</h4>
                  <p className="text-slate-400 text-sm mt-1 whitespace-pre-wrap">{announcement.content}</p>
                </div>
                {canManage && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingAnnouncement(announcement)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteAnnouncement(announcement.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header with Create buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-400" />
          Upcoming Events
          {upcomingEvents.length > 0 && (
            <span className="text-sm font-normal text-slate-400">
              ({upcomingEvents.length})
            </span>
          )}
        </h3>
        {canManage && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowAnnouncementForm(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-sm font-medium rounded-lg transition-colors cursor-pointer border border-amber-500/30"
            >
              <Megaphone size={16} />
              Announce
            </button>
            <button
              onClick={() => setShowEventForm(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Create Event
            </button>
          </div>
        )}
      </div>

      {/* Events list */}
      {upcomingEvents.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No upcoming events</p>
          {canManage && (
            <p className="text-sm mt-2">Create an event to start organizing your guild.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              timezone={timezone}
              onRsvp={(status) => onRsvp(event.id, status)}
              onEdit={canManage ? () => setEditingEvent(event) : undefined}
              onCancel={canManage ? () => onCancelEvent(event.id) : undefined}
              canManage={canManage}
            />
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      {showEventForm && (
        <EventForm
          clanId={clanId}
          userId={userId}
          onSubmit={handleCreateEvent}
          onCancel={() => setShowEventForm(false)}
        />
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <EventForm
          clanId={clanId}
          userId={userId}
          initialData={editingEvent}
          onSubmit={handleEditEvent}
          onCancel={() => setEditingEvent(null)}
          isEditing
        />
      )}

      {/* Create Announcement Modal */}
      {showAnnouncementForm && (
        <AnnouncementForm
          clanId={clanId}
          userId={userId}
          onSubmit={handleCreateAnnouncement}
          onCancel={() => setShowAnnouncementForm(false)}
        />
      )}

      {/* Edit Announcement Modal */}
      {editingAnnouncement && (
        <AnnouncementForm
          clanId={clanId}
          userId={userId}
          initialData={editingAnnouncement}
          onSubmit={handleEditAnnouncement}
          onCancel={() => setEditingAnnouncement(null)}
          isEditing
        />
      )}
    </div>
  );
}
