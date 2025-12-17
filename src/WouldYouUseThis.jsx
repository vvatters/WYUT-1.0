import { useState } from 'react';

const now = Date.now();
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

const sampleIdeas = [
  { 
    id: 1, 
    text: "An app that tells you which friends are awake right now", 
    upvotes: 24, 
    downvotes: 3, 
    createdAt: now - 45 * DAY,
    comparables: ["Zenly", "Snapchat Maps", "Find My Friends"],
    isOwn: false
  },
  { 
    id: 2, 
    text: "A website that generates fake but realistic meeting excuses", 
    upvotes: 18, 
    downvotes: 7, 
    createdAt: now - 20 * DAY,
    comparables: ["ChatGPT", "Excuse Generator"],
    isOwn: false
  },
  { 
    id: 3, 
    text: "Smart glasses that blur your ex if you see them in public", 
    upvotes: 41, 
    downvotes: 12, 
    createdAt: now - 5 * DAY,
    comparables: ["Ray-Ban Meta", "Snapchat Spectacles"],
    isOwn: true
  },
  { 
    id: 4, 
    text: "A service that sends you a physical letter from your future self", 
    upvotes: 33, 
    downvotes: 5, 
    createdAt: now - 2 * DAY,
    comparables: ["FutureMe", "Letters to My Future Self"],
    isOwn: false
  },
  { 
    id: 5, 
    text: "An extension that hides all prices online until checkout", 
    upvotes: 8, 
    downvotes: 29, 
    createdAt: now - 12 * HOUR,
    comparables: ["Honey", "Capital One Shopping"],
    isOwn: true
  },
  { 
    id: 6, 
    text: "A dating app that only matches people with the same coffee order", 
    upvotes: 19, 
    downvotes: 2, 
    createdAt: now - 2 * HOUR,
    comparables: ["Hinge", "Thursday", "Bumble"],
    isOwn: false
  },
];

const generateComparables = (text) => {
  return ["Searching...", "for similar apps"];
};

const TIME_FILTERS = [
  { key: 'today', label: 'Today', ms: DAY },
  { key: 'week', label: 'This Week', ms: 7 * DAY },
  { key: 'month', label: 'This Month', ms: 30 * DAY },
  { key: 'all', label: 'All Time', ms: Infinity },
];

const FIRE_THRESHOLD = 3;

export default function WouldYouUseThis() {
  const [ideas, setIdeas] = useState(sampleIdeas);
  const [newIdea, setNewIdea] = useState('');
  const [votedOn, setVotedOn] = useState(new Set());
  const [timeFilter, setTimeFilter] = useState('all');
  const [signedIn, setSignedIn] = useState(false);
  const [showYourIdeas, setShowYourIdeas] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newIdea.trim() || !signedIn) return;
    
    const idea = {
      id: Date.now(),
      text: newIdea.trim(),
      upvotes: 0,
      downvotes: 0,
      createdAt: Date.now(),
      comparables: generateComparables(newIdea.trim()),
      isOwn: true,
    };
    
    setIdeas([idea, ...ideas]);
    setNewIdea('');
  };

  const handleVote = (id, isUpvote) => {
    if (votedOn.has(id) || !signedIn) return;
    
    setVotedOn(new Set([...votedOn, id]));
    setIdeas(ideas.map(idea => {
      if (idea.id === id) {
        return {
          ...idea,
          upvotes: isUpvote ? idea.upvotes + 1 : idea.upvotes,
          downvotes: !isUpvote ? idea.downvotes + 1 : idea.downvotes,
        };
      }
      return idea;
    }));
  };

  const getScore = (idea) => idea.upvotes - idea.downvotes;
  
  const getVelocity = (idea) => {
    const hoursOld = Math.max((Date.now() - idea.createdAt) / HOUR, 1);
    return getScore(idea) / hoursOld;
  };
  
  const isOnFire = (idea) => {
    const hoursOld = (Date.now() - idea.createdAt) / HOUR;
    return hoursOld < 48 && getVelocity(idea) >= FIRE_THRESHOLD;
  };

  const activeFilter = TIME_FILTERS.find(f => f.key === timeFilter);
  const cutoff = Date.now() - activeFilter.ms;

  let filteredIdeas = ideas
    .filter(idea => idea.createdAt >= cutoff)
    .sort((a, b) => getScore(b) - getScore(a));

  if (showYourIdeas) {
    filteredIdeas = ideas.filter(idea => idea.isOwn).sort((a, b) => b.createdAt - a.createdAt);
  }

  const yourIdeasCount = ideas.filter(idea => idea.isOwn).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Nav */}
      <nav className="border-b border-zinc-800 sticky top-0 bg-zinc-950/90 backdrop-blur-sm z-10">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <button 
            onClick={() => setShowYourIdeas(false)}
            className="font-bold text-lg tracking-tight hover:text-white transition-colors"
          >
            WYUT?
          </button>
          
          <div className="flex items-center gap-2">
            {signedIn ? (
              <>
                {/* Your Ideas Button */}
                <button
                  onClick={() => setShowYourIdeas(!showYourIdeas)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    showYourIdeas 
                      ? 'bg-zinc-800 text-zinc-100' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>Your Ideas</span>
                  {yourIdeasCount > 0 && (
                    <span className="bg-zinc-700 text-zinc-300 text-xs px-1.5 py-0.5 rounded-full">
                      {yourIdeasCount}
                    </span>
                  )}
                </button>

                {/* Profile Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-zinc-900"
                  >
                    Y
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1">
                      <div className="px-3 py-2 border-b border-zinc-800">
                        <p className="text-sm text-zinc-100">you@example.com</p>
                        <p className="text-xs text-zinc-500">Signed in with Google</p>
                      </div>
                      <button
                        onClick={() => {
                          setSignedIn(false);
                          setShowProfileMenu(false);
                          setShowYourIdeas(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => setSignedIn(true)}
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-sm hover:border-zinc-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-4 py-8">
        {/* Header - only show on main feed */}
        {!showYourIdeas && (
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Would You Use This?
            </h1>
            <p className="text-zinc-500 text-sm">
              Post an idea. See if anyone cares.
            </p>
          </header>
        )}

        {/* Your Ideas Header */}
        {showYourIdeas && (
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <button 
                onClick={() => setShowYourIdeas(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold tracking-tight">Your Ideas</h1>
            </div>
            <p className="text-zinc-500 text-sm">
              {yourIdeasCount} idea{yourIdeasCount !== 1 ? 's' : ''} posted
            </p>
          </header>
        )}

        {/* Post form */}
        {signedIn && !showYourIdeas && (
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                placeholder="An app that..."
                maxLength={140}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
              />
              <button
                type="submit"
                className="bg-zinc-100 text-zinc-900 font-medium px-5 py-3 rounded-lg hover:bg-white transition-colors"
              >
                Post
              </button>
            </div>
            <p className="text-zinc-600 text-xs mt-2 text-right">
              {newIdea.length}/140
            </p>
          </form>
        )}

        {/* Time filter - only show on main feed */}
        {!showYourIdeas && (
          <div className="flex gap-1 mb-6 bg-zinc-900 p-1 rounded-lg">
            {TIME_FILTERS.map(filter => (
              <button
                key={filter.key}
                onClick={() => setTimeFilter(filter.key)}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                  timeFilter === filter.key
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* Ideas list */}
        <div className="space-y-3">
          {filteredIdeas.length === 0 ? (
            <div className="text-center py-12 text-zinc-600">
              {showYourIdeas ? (
                <>You haven't posted any ideas yet.<br />Go share something!</>
              ) : (
                <>No ideas yet for this time period.<br />Be the first.</>
              )}
            </div>
          ) : (
            filteredIdeas.map((idea) => {
              const score = getScore(idea);
              const hasVoted = votedOn.has(idea.id);
              const onFire = isOnFire(idea);

              return (
                <div
                  key={idea.id}
                  className={`bg-zinc-900 border rounded-lg p-4 flex items-start gap-4 ${
                    onFire ? 'border-orange-500/50' : idea.isOwn && signedIn ? 'border-zinc-700' : 'border-zinc-800'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1 min-w-[48px]">
                    <button
                      onClick={() => handleVote(idea.id, true)}
                      disabled={!signedIn || hasVoted}
                      className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                        !signedIn || hasVoted
                          ? 'text-zinc-700 cursor-not-allowed'
                          : 'text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800'
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 12V4M8 4L4 8M8 4L12 8" />
                      </svg>
                    </button>
                    <span className={`text-sm font-medium ${
                      score > 0 ? 'text-emerald-400' : score < 0 ? 'text-red-400' : 'text-zinc-500'
                    }`}>
                      {score > 0 ? '+' : ''}{score}
                    </span>
                    <button
                      onClick={() => handleVote(idea.id, false)}
                      disabled={!signedIn || hasVoted}
                      className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                        !signedIn || hasVoted
                          ? 'text-zinc-700 cursor-not-allowed'
                          : 'text-zinc-500 hover:text-red-400 hover:bg-zinc-800'
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 4V12M8 12L4 8M8 12L12 8" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {onFire && (
                        <span className="inline-flex items-center gap-1 text-xs text-orange-400 font-medium">
                          <span>🔥</span> Rising
                        </span>
                      )}
                      {idea.isOwn && signedIn && (
                        <span className="text-xs text-zinc-600">Your idea</span>
                      )}
                    </div>
                    <p className="text-zinc-200 leading-relaxed mb-2">
                      {idea.text}
                    </p>
                    {idea.comparables && idea.comparables.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-zinc-600 text-xs">Similar:</span>
                        {idea.comparables.map((app, i) => (
                          <span 
                            key={i}
                            className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded"
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <footer className="mt-16 text-center text-zinc-600 text-xs">
          sign in to vote · one vote per idea · no takebacks
        </footer>
      </div>
    </div>
  );
}
