import { useState } from 'react';

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

const sampleIdeas = [
  { id: 1, text: "An app that tells you which friends are awake right now", upvotes: 24, downvotes: 3, created_at: new Date(now - 2 * DAY).toISOString() },
  { id: 2, text: "A website that generates fake but realistic meeting excuses", upvotes: 18, downvotes: 7, created_at: new Date(now - 5 * DAY).toISOString() },
  { id: 3, text: "Smart glasses that blur your ex if you see them in public", upvotes: 41, downvotes: 12, created_at: new Date(now - 1 * DAY).toISOString() },
];

const TIME_FILTERS = [
  { key: 'today', label: 'Today', ms: DAY },
  { key: 'week', label: 'This Week', ms: 7 * DAY },
  { key: 'month', label: 'This Month', ms: 30 * DAY },
  { key: 'all', label: 'All Time', ms: Infinity },
];

export default function WouldYouUseThis() {
  const [ideas, setIdeas] = useState(sampleIdeas);
  const [userVotes, setUserVotes] = useState({});
  const [newIdea, setNewIdea] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [user, setUser] = useState(null);

  function handleSignIn() {
    setUser({ email: 'you@example.com' });
  }

  function handleSignOut() {
    setUser(null);
    setUserVotes({});
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!newIdea.trim() || !user) return;

    const idea = {
      id: Date.now(),
      text: newIdea.trim(),
      upvotes: 0,
      downvotes: 0,
      created_at: new Date().toISOString(),
    };

    setIdeas([idea, ...ideas]);
    setNewIdea('');
  }

  function handleVote(ideaId, voteType) {
    if (!user || userVotes[ideaId]) return;

    setUserVotes({ ...userVotes, [ideaId]: voteType });
    setIdeas(ideas.map(idea => {
      if (idea.id === ideaId) {
        return {
          ...idea,
          upvotes: voteType === 'up' ? idea.upvotes + 1 : idea.upvotes,
          downvotes: voteType === 'down' ? idea.downvotes + 1 : idea.downvotes,
        };
      }
      return idea;
    }));
  }

  const getScore = (idea) => idea.upvotes - idea.downvotes;

  const activeFilter = TIME_FILTERS.find(f => f.key === timeFilter);
const cutoff = activeFilter.ms === Infinity ? '' : new Date(Date.now() - activeFilter.ms).toISOString();

  const filteredIdeas = ideas
    .filter(idea => timeFilter === 'all' || idea.created_at >= cutoff)
    .sort((a, b) => getScore(b) - getScore(a));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-xl mx-auto px-4 py-12">
        
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Would You Use This?
          </h1>
          <p className="text-zinc-500 text-sm">
            Post an idea. See if anyone cares.
          </p>
        </header>

        <div className="flex justify-center mb-8">
          {user ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-zinc-400">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-sm hover:border-zinc-700 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in to post & vote
            </button>
          )}
        </div>

        {user && (
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

        <div className="space-y-3">
          {filteredIdeas.length === 0 ? (
            <div className="text-center py-12 text-zinc-600">
              No ideas yet for this time period.<br />
              Be the first.
            </div>
          ) : (
            filteredIdeas.map((idea) => {
              const score = getScore(idea);
              const hasVoted = !!userVotes[idea.id];
              const userVoteType = userVotes[idea.id];

              return (
                <div
                  key={idea.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="flex flex-col items-center gap-1 min-w-[48px]">
                    <button
                      onClick={() => handleVote(idea.id, 'up')}
                      disabled={!user || hasVoted}
                      className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                        userVoteType === 'up'
                          ? 'text-emerald-400'
                          : !user || hasVoted
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
                      onClick={() => handleVote(idea.id, 'down')}
                      disabled={!user || hasVoted}
                      className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                        userVoteType === 'down'
                          ? 'text-red-400'
                          : !user || hasVoted
                          ? 'text-zinc-700 cursor-not-allowed'
                          : 'text-zinc-500 hover:text-red-400 hover:bg-zinc-800'
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 4V12M8 12L4 8M8 12L12 8" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-zinc-200 leading-relaxed">
                    {idea.text}
                  </p>
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