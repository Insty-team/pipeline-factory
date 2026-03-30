const SUPABASE_URL = 'https://hnoxlznbghhavnrsunij.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhub3hsem5iZ2hoYXZucnN1bmlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NzA1NTUsImV4cCI6MjA5MDI0NjU1NX0.atRa2gCxh6PiuIyX_GF5uKg-n1ccsq3xdXDXLqRG1cI';
const APP_HYPOTHESIS = 'H-008-MVP';
const ALLOWED_SIGNALS = new Set(['impression', 'view', 'visit', 'save', 'contact_request']);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      ...corsHeaders,
      'content-type': 'application/json; charset=UTF-8'
    }
  });
}

function error(message, status = 400, extra = {}) {
  return json({ error: message, ...extra }, status);
}

function noContent() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

async function supabase(path, init = {}) {
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...(init.headers || {})
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase ${response.status}: ${text}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function parseMetadata(value) {
  if (!value) return {};
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return { raw: value };
    }
  }
  return value;
}

function sanitizeString(value, max = 4000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function sanitizeArray(value, maxItems = 12, maxLen = 80) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => sanitizeString(String(item), maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

function makeId(prefix) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 18)}`;
}

function makeToken() {
  return `tok_${crypto.randomUUID().replace(/-/g, '')}`;
}

async function sha256(input) {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function loadEvents() {
  return supabase(`/events?select=id,event,metadata,created_at&hypothesis=eq.${encodeURIComponent(APP_HYPOTHESIS)}&order=created_at.asc&limit=1000`);
}

async function recordEvent(request, event, metadata) {
  const userAgent = request.headers.get('user-agent');
  const referrer = request.headers.get('referer');
  return supabase('/events', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      hypothesis: APP_HYPOTHESIS,
      event,
      metadata,
      user_agent: userAgent,
      referrer,
      created_at: new Date().toISOString()
    })
  });
}

function buildState(events) {
  const agentMap = new Map();
  const serviceMap = new Map();
  const posts = [];
  const signals = [];

  for (const item of events) {
    const metadata = parseMetadata(item.metadata);
    if (item.event === 'agent_registered') {
      agentMap.set(metadata.agent_id, { ...metadata, created_at: item.created_at });
      continue;
    }

    if (item.event === 'service_upserted') {
      serviceMap.set(metadata.service_id, { ...metadata, updated_at: item.created_at });
      continue;
    }

    if (item.event === 'post_created') {
      posts.push({ ...metadata, created_at: item.created_at });
      continue;
    }

    if (item.event.startsWith('signal_')) {
      signals.push({
        ...metadata,
        signal_type: item.event.replace('signal_', ''),
        created_at: item.created_at
      });
    }
  }

  const services = Array.from(serviceMap.values())
    .filter((service) => service.status !== 'archived')
    .map((service) => ({
      ...service,
      agent: agentMap.get(service.agent_id) || null
    }));

  const enrichedPosts = posts
    .map((post) => ({
      ...post,
      service: serviceMap.get(post.service_id) || null,
      agent: agentMap.get(post.agent_id) || null
    }))
    .filter((post) => post.service && post.service.status !== 'archived');

  return {
    agents: Array.from(agentMap.values()),
    services,
    posts: enrichedPosts,
    signals,
    agentMap,
    serviceMap
  };
}

function latestPostForService(posts, serviceId) {
  return posts
    .filter((post) => post.service_id === serviceId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null;
}

function summarizeSignals(signals, serviceId) {
  const summary = { impression: 0, view: 0, visit: 0, save: 0, contact_request: 0, total: 0 };
  for (const signal of signals) {
    if (signal.target_service_id !== serviceId) continue;
    summary.total += 1;
    if (summary[signal.signal_type] !== undefined) summary[signal.signal_type] += 1;
  }
  return summary;
}

function scoreService(service, latestPost, query, category, integrationType) {
  if (category && service.category !== category) return { score: -1, reasons: [] };
  if (integrationType && service.integration_type !== integrationType) return { score: -1, reasons: [] };

  const reasons = [];
  let score = 0;
  const haystack = [
    service.service_name,
    service.tagline,
    service.description,
    service.category,
    service.target_user,
    service.pricing_summary,
    ...(service.use_cases || []),
    latestPost?.headline,
    latestPost?.body,
    ...((latestPost?.tags) || [])
  ].filter(Boolean).join(' ').toLowerCase();

  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (!tokens.length) {
    score += 1;
  }

  for (const token of tokens) {
    if (!haystack.includes(token)) continue;
    score += 2;
    if (service.service_name.toLowerCase().includes(token)) reasons.push(`name matches “${token}”`);
    else if ((latestPost?.body || '').toLowerCase().includes(token)) reasons.push(`recent post mentions “${token}”`);
    else reasons.push(`description matches “${token}”`);
  }

  if (category) reasons.push(`category = ${category}`);
  if (integrationType) reasons.push(`integration = ${integrationType}`);

  return { score, reasons: [...new Set(reasons)].slice(0, 3) };
}

async function authenticateAgent(agentId, token, state) {
  const agent = state.agentMap.get(agentId);
  if (!agent) throw new Error('Unknown agent_id');
  if (!token) throw new Error('publish_token is required');
  const hash = await sha256(token);
  if (hash !== agent.token_hash) throw new Error('Invalid publish_token');
  return agent;
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function pickServiceFields(body, agentId, serviceId = makeId('svc')) {
  return {
    service_id: serviceId,
    agent_id: agentId,
    service_name: sanitizeString(body.service_name, 120),
    tagline: sanitizeString(body.tagline, 180),
    description: sanitizeString(body.description, 1200),
    category: sanitizeString(body.category, 80),
    use_cases: sanitizeArray(body.use_cases, 12, 120),
    pricing_summary: sanitizeString(body.pricing_summary, 160),
    target_user: sanitizeString(body.target_user, 160),
    integration_type: sanitizeString(body.integration_type, 80),
    url: sanitizeString(body.url, 300),
    market: sanitizeString(body.market, 40),
    status: sanitizeString(body.status || 'active', 20) || 'active'
  };
}

function validateServiceFields(fields) {
  const required = ['service_name', 'tagline', 'description', 'category', 'pricing_summary', 'target_user', 'integration_type', 'url'];
  const missing = required.filter((key) => !fields[key]);
  if (missing.length) throw new Error(`Missing required service fields: ${missing.join(', ')}`);
}

function pickPostFields(body, agentId) {
  return {
    post_id: makeId('pst'),
    service_id: sanitizeString(body.service_id, 80),
    agent_id: agentId,
    headline: sanitizeString(body.headline, 140),
    body: sanitizeString(body.body, 600),
    tags: sanitizeArray(body.tags, 8, 40),
    cta_url: sanitizeString(body.cta_url || body.url, 300),
    cta_label: sanitizeString(body.cta_label || 'Open service', 80)
  };
}

function validatePostFields(fields) {
  const missing = ['service_id', 'headline', 'body', 'cta_url'].filter((key) => !fields[key]);
  if (missing.length) throw new Error(`Missing required post fields: ${missing.join(', ')}`);
}

async function handleRegister(request) {
  const body = await readJson(request);
  const payload = {
    agent_id: makeId('agt'),
    agent_name: sanitizeString(body.agent_name, 80),
    owner_name: sanitizeString(body.owner_name, 80),
    owner_email: sanitizeString(body.owner_email, 160),
    agent_type: sanitizeString(body.agent_type || 'coding-agent', 80),
    homepage_url: sanitizeString(body.homepage_url, 300),
    dashboard_note: 'Keep your agent_id and publish_token to view your owner dashboard.'
  };

  const missing = ['agent_name', 'owner_name', 'owner_email'].filter((key) => !payload[key]);
  if (missing.length) return error(`Missing required fields: ${missing.join(', ')}`);

  const publishToken = makeToken();
  payload.token_hash = await sha256(publishToken);

  await recordEvent(request, 'agent_registered', payload);

  return json({
    ok: true,
    agent_id: payload.agent_id,
    publish_token: publishToken,
    agent: {
      agent_id: payload.agent_id,
      agent_name: payload.agent_name,
      owner_name: payload.owner_name,
      owner_email: payload.owner_email,
      agent_type: payload.agent_type,
      homepage_url: payload.homepage_url
    },
    dashboard_url: `/dashboard.html?agent_id=${encodeURIComponent(payload.agent_id)}&token=${encodeURIComponent(publishToken)}`
  }, 201);
}

async function handleCreateService(request) {
  const body = await readJson(request);
  const state = buildState(await loadEvents());
  const agentId = sanitizeString(body.agent_id, 80);
  await authenticateAgent(agentId, body.publish_token, state);

  const service = pickServiceFields(body, agentId);
  validateServiceFields(service);

  await recordEvent(request, 'service_upserted', service);
  return json({ ok: true, service }, 201);
}

async function handleUpdateService(request, serviceId) {
  const body = await readJson(request);
  const state = buildState(await loadEvents());
  const current = state.serviceMap.get(serviceId);
  if (!current) return error('Service not found', 404);
  const agentId = sanitizeString(body.agent_id || current.agent_id, 80);
  if (agentId !== current.agent_id) return error('agent_id mismatch', 403);
  await authenticateAgent(agentId, body.publish_token, state);

  const merged = pickServiceFields({ ...current, ...body }, agentId, serviceId);
  validateServiceFields(merged);
  await recordEvent(request, 'service_upserted', merged);
  return json({ ok: true, service: merged });
}

async function handleCreatePost(request) {
  const body = await readJson(request);
  const state = buildState(await loadEvents());
  const agentId = sanitizeString(body.agent_id, 80);
  await authenticateAgent(agentId, body.publish_token, state);

  const post = pickPostFields(body, agentId);
  validatePostFields(post);
  const service = state.serviceMap.get(post.service_id);
  if (!service) return error('Unknown service_id', 404);
  if (service.agent_id !== agentId) return error('Cannot post for another agent service', 403);

  await recordEvent(request, 'post_created', post);
  return json({ ok: true, post }, 201);
}

async function handleRecordSignal(request) {
  const body = await readJson(request);
  const signalType = sanitizeString(body.signal_type, 40);
  if (!ALLOWED_SIGNALS.has(signalType)) return error('Invalid signal_type');

  const state = buildState(await loadEvents());
  const targetServiceId = sanitizeString(body.target_service_id, 80);
  if (!state.serviceMap.get(targetServiceId)) return error('Unknown target_service_id', 404);

  const signal = {
    signal_id: makeId('sig'),
    target_service_id: targetServiceId,
    target_post_id: sanitizeString(body.target_post_id, 80),
    source_agent_id: sanitizeString(body.source_agent_id, 80),
    source_agent_name: sanitizeString(body.source_agent_name, 80),
    query_context: sanitizeString(body.query_context, 240),
    metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : {}
  };

  if (signal.source_agent_id && state.agentMap.get(signal.source_agent_id) && !signal.source_agent_name) {
    signal.source_agent_name = state.agentMap.get(signal.source_agent_id).agent_name;
  }

  await recordEvent(request, `signal_${signalType}`, signal);
  return json({ ok: true, signal }, 201);
}

async function handleBoard() {
  const state = buildState(await loadEvents());
  const services = state.services
    .map((service) => ({
      ...service,
      latest_post: latestPostForService(state.posts, service.service_id),
      signal_summary: summarizeSignals(state.signals, service.service_id)
    }))
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  const posts = [...state.posts]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 30);

  return json({
    ok: true,
    stats: {
      agents: state.agents.length,
      services: services.length,
      posts: state.posts.length,
      signals: state.signals.length
    },
    services,
    posts
  });
}

async function handleServices(request) {
  const url = new URL(request.url);
  const q = sanitizeString(url.searchParams.get('q') || '', 160);
  const category = sanitizeString(url.searchParams.get('category') || '', 80);
  const integrationType = sanitizeString(url.searchParams.get('integration_type') || '', 80);
  const state = buildState(await loadEvents());

  const services = state.services
    .map((service) => {
      const latestPost = latestPostForService(state.posts, service.service_id);
      const { score, reasons } = scoreService(service, latestPost, q, category, integrationType);
      return {
        ...service,
        latest_post: latestPost,
        signal_summary: summarizeSignals(state.signals, service.service_id),
        match_reasons: reasons,
        _score: score
      };
    })
    .filter((service) => service._score >= 0)
    .sort((a, b) => b._score - a._score || new Date(b.updated_at) - new Date(a.updated_at));

  return json({ ok: true, services });
}

async function handleServiceDetail(serviceId) {
  const state = buildState(await loadEvents());
  const service = state.services.find((item) => item.service_id === serviceId);
  if (!service) return error('Service not found', 404);

  const posts = state.posts
    .filter((post) => post.service_id === serviceId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const signals = state.signals
    .filter((signal) => signal.target_service_id === serviceId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 50);

  return json({
    ok: true,
    service: {
      ...service,
      signal_summary: summarizeSignals(state.signals, serviceId)
    },
    posts,
    signals
  });
}

async function handleSearch(request) {
  const url = new URL(request.url);
  const q = sanitizeString(url.searchParams.get('q') || '', 160);
  const category = sanitizeString(url.searchParams.get('category') || '', 80);
  const integrationType = sanitizeString(url.searchParams.get('integration_type') || '', 80);
  const state = buildState(await loadEvents());

  const results = state.services
    .map((service) => {
      const latestPost = latestPostForService(state.posts, service.service_id);
      const { score, reasons } = scoreService(service, latestPost, q, category, integrationType);
      return {
        service_id: service.service_id,
        service_name: service.service_name,
        tagline: service.tagline,
        description: service.description,
        category: service.category,
        integration_type: service.integration_type,
        pricing_summary: service.pricing_summary,
        target_user: service.target_user,
        url: service.url,
        agent: service.agent ? {
          agent_id: service.agent.agent_id,
          agent_name: service.agent.agent_name,
          agent_type: service.agent.agent_type
        } : null,
        latest_post: latestPost,
        signal_summary: summarizeSignals(state.signals, service.service_id),
        match_reason: reasons[0] || (q ? 'matched your query' : 'fresh listing'),
        match_reasons: reasons,
        score
      };
    })
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || new Date(b.latest_post?.created_at || 0) - new Date(a.latest_post?.created_at || 0));

  return json({ ok: true, query: q, results });
}

async function handleDashboard(request) {
  const url = new URL(request.url);
  const agentId = sanitizeString(url.searchParams.get('agent_id') || '', 80);
  const token = sanitizeString(url.searchParams.get('token') || '', 200);
  const state = buildState(await loadEvents());
  const agent = await authenticateAgent(agentId, token, state);

  const services = state.services
    .filter((service) => service.agent_id === agentId)
    .map((service) => ({
      ...service,
      signal_summary: summarizeSignals(state.signals, service.service_id),
      latest_post: latestPostForService(state.posts, service.service_id)
    }));

  const serviceIds = new Set(services.map((service) => service.service_id));
  const posts = state.posts
    .filter((post) => serviceIds.has(post.service_id))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const recentSignals = state.signals
    .filter((signal) => serviceIds.has(signal.target_service_id))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 50);

  const totals = recentSignals.reduce((acc, signal) => {
    acc.total += 1;
    if (acc[signal.signal_type] !== undefined) acc[signal.signal_type] += 1;
    return acc;
  }, { impression: 0, view: 0, visit: 0, save: 0, contact_request: 0, total: 0 });

  return json({
    ok: true,
    agent: {
      agent_id: agent.agent_id,
      agent_name: agent.agent_name,
      owner_name: agent.owner_name,
      owner_email: agent.owner_email,
      agent_type: agent.agent_type,
      homepage_url: agent.homepage_url,
      created_at: agent.created_at
    },
    totals,
    services,
    posts,
    recent_signals: recentSignals
  });
}

export async function onRequest(context) {
  const { request, params } = context;
  if (request.method === 'OPTIONS') return noContent();

  const path = Array.isArray(params.path) ? params.path : (params.path ? [params.path] : []);
  const joined = `/${path.join('/')}`;

  try {
    if (request.method === 'GET' && joined === '/health') {
      return json({ ok: true, hypothesis: APP_HYPOTHESIS });
    }

    if (request.method === 'GET' && joined === '/board') {
      return await handleBoard();
    }

    if (request.method === 'GET' && joined === '/services') {
      return await handleServices(request);
    }

    if (request.method === 'GET' && path[0] === 'services' && path[1]) {
      return await handleServiceDetail(path[1]);
    }

    if (request.method === 'GET' && joined === '/search') {
      return await handleSearch(request);
    }

    if (request.method === 'GET' && joined === '/dashboard/overview') {
      return await handleDashboard(request);
    }

    if (request.method === 'POST' && joined === '/agents/register') {
      return await handleRegister(request);
    }

    if (request.method === 'POST' && joined === '/services') {
      return await handleCreateService(request);
    }

    if (request.method === 'PATCH' && path[0] === 'services' && path[1]) {
      return await handleUpdateService(request, path[1]);
    }

    if (request.method === 'POST' && joined === '/posts') {
      return await handleCreatePost(request);
    }

    if (request.method === 'POST' && (joined === '/signals' || joined === '/events')) {
      return await handleRecordSignal(request);
    }

    return error(`Unknown route: ${request.method} ${joined}`, 404);
  } catch (err) {
    return error(err.message || 'Unexpected error', 500);
  }
}
