// Fetches public GitHub profile stats and writes a static snapshot (gh-stats.json)
// for index.js to read, replacing unauthenticated client-side calls to the
// GitHub API (which are rate-limited to 60 req/hr per visitor IP).
const USERNAME = 'pranavpankhawala';
const TOKEN = process.env.GITHUB_TOKEN;

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'gh-stats-snapshot-script',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function getJSON(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

async function main() {
  const user = await getJSON(`https://api.github.com/users/${USERNAME}`);
  const repos = await getJSON(`https://api.github.com/users/${USERNAME}/repos?per_page=100`);
  const events = await getJSON(`https://api.github.com/users/${USERNAME}/events/public`);

  const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

  const langCounts = {};
  repos.forEach(r => { if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1; });
  const languages = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  const dayCounts = {};
  events.forEach(ev => {
    const d = ev.created_at?.slice(0, 10);
    if (d) dayCounts[d] = (dayCounts[d] || 0) + 1;
  });
  const activity = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    activity.push({ date: key, count: dayCounts[key] || 0 });
  }

  const snapshot = {
    updatedAt: new Date().toISOString(),
    repos: user.public_repos ?? null,
    stars,
    languages,
    activity,
  };

  const fs = await import('node:fs/promises');
  await fs.writeFile('gh-stats.json', JSON.stringify(snapshot, null, 2) + '\n');
  console.log('Wrote gh-stats.json', snapshot);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
