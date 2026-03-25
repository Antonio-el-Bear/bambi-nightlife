import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Demo stub components (replace with your real ones if available)
function HeroSection() {
  return (
    <section className="hero-section" style={{padding: '2.5rem 0', textAlign: 'center'}}>
      <h1 style={{fontSize: '2.5rem', fontWeight: 700}}>Welcome to Bambi Nightlife</h1>
      <p style={{color: '#aaa', marginTop: 8}}>Discover events, clubs, and the vibe in your city.</p>
    </section>
  );
}

function SectionHeader({ title, subtitle, linkTo }) {
  return (
    <div style={{marginBottom: 18}}>
      <h2 style={{fontSize: '1.5rem', fontWeight: 600}}>{title}</h2>
      {subtitle && <p style={{color: '#aaa'}}>{subtitle}</p>}
      {linkTo && <a href={linkTo} style={{color: '#8B5CF6', fontSize: '0.98rem'}}>See all</a>}
    </div>
  );
}

function EventCard({ event, featured }) {
  return (
    <div style={{borderRadius: 18, background: featured ? 'linear-gradient(135deg, #FF5FA2 60%, #2DE2E6 100%)' : '#23202b', color: featured ? '#fff' : '#eee', padding: 18, minHeight: 120, boxShadow: featured ? '0 4px 32px #ff5fa255' : 'none'}}>
      <strong>{event.title}</strong>
      <p style={{margin: '8px 0 0 0'}}>{event.date}</p>
      <p style={{fontSize: '0.98rem', color: featured ? '#fff' : '#aaa'}}>{event.location}</p>
    </div>
  );
}

function VenueCard({ venue }) {
  return (
    <div style={{borderRadius: 14, background: '#23202b', color: '#eee', padding: 14, minHeight: 80}}>
      <strong>{venue.name}</strong>
      <p style={{fontSize: '0.95rem', color: '#aaa'}}>{venue.city}</p>
    </div>
  );
}

function PostCard({ post }) {
  return (
    <div style={{borderRadius: 14, background: '#18151f', color: '#eee', padding: 14}}>
      <strong>@{post.user}</strong>
      <p style={{margin: '8px 0 0 0'}}>{post.content}</p>
    </div>
  );
}

function CreatePostForm({ onPostCreated }) {
  const [value, setValue] = useState('');
  return (
    <form onSubmit={e => {
      e.preventDefault();
      if (!value.trim()) return;
      onPostCreated({ id: Date.now(), user: 'demo_user', content: value });
      setValue('');
    }} style={{marginBottom: 12}}>
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Share something..."
        style={{width: '100%', borderRadius: 8, padding: 10, minHeight: 48, border: '1px solid #333', color: '#eee', background: '#23202b'}}
      />
      <button type="submit" style={{marginTop: 8, background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600}}>Post</button>
    </form>
  );
}

export default function Home() {
  // Demo data
  const [events, setEvents] = useState([
    { id: 1, title: 'VIP Night', date: '2026-04-01', location: 'Bambi Club', featured: true },
    { id: 2, title: 'Ladies Night', date: '2026-04-05', location: 'Bambi Club' },
    { id: 3, title: 'Spring Bash', date: '2026-04-10', location: 'Bambi Club' },
    { id: 4, title: 'Glow Party', date: '2026-04-15', location: 'Bambi Club' },
    { id: 5, title: 'DJ Set', date: '2026-04-20', location: 'Bambi Club' },
  ]);
  const [venues, setVenues] = useState([
    { id: 1, name: 'Bambi Club', city: 'Nairobi' },
    { id: 2, name: 'Sky Lounge', city: 'Nairobi' },
    { id: 3, name: 'Velvet Room', city: 'Nairobi' },
    { id: 4, name: 'The Vault', city: 'Nairobi' },
    { id: 5, name: 'Club X', city: 'Nairobi' },
    { id: 6, name: 'Opium', city: 'Nairobi' },
  ]);
  const [posts, setPosts] = useState([
    { id: 1, user: 'alice', content: 'Had an amazing night at Bambi Club!' },
    { id: 2, user: 'bob', content: 'The DJ set was fire!' },
    { id: 3, user: 'eve', content: 'Loved the vibe and the people.' },
  ]);
  const [loading, setLoading] = useState(false);

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const featuredEvent = events.find(e => e.featured) || events[0];
  const otherEvents = events.filter(e => e.id !== featuredEvent?.id).slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto" style={{padding: '2rem 0'}}>
      <HeroSection />

      {/* Featured & Events */}
      {events.length > 0 && (
        <section className="px-4 mb-8">
          <SectionHeader title="Happening Soon" subtitle="Don't miss out" linkTo="/events" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredEvent && <EventCard event={featuredEvent} featured />}
            {otherEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Venues */}
      {venues.length > 0 && (
        <section className="px-4 mb-8">
          <SectionHeader title="Top Venues" subtitle="Explore your city" linkTo="/venues" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {venues.slice(0, 6).map((venue, i) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <VenueCard venue={venue} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Social Feed */}
      <section className="px-4 mb-8">
        <SectionHeader title="The Vibe" subtitle="What people are saying" />
        <CreatePostForm onPostCreated={(newPost) => setPosts(prev => [newPost, ...prev])} />
        <div className="space-y-4 mt-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No posts yet. Share your first moment!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
