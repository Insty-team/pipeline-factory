#!/usr/bin/env python3
import json
import urllib.request
import urllib.parse
from pathlib import Path

BASE_URL = 'https://agentdock-9vk.pages.dev'
HEADERS = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 AgentDock-SeedReplace/1.0'
}
STATE_PATH = Path('/Users/mac/projects/pipeline-factory/.omc/state/h008-demo-output.json')


def api(method, path, payload=None):
    data = None
    if payload is not None:
        data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(BASE_URL + path, data=data, headers=HEADERS, method=method)
    with urllib.request.urlopen(req) as r:
        body = r.read().decode('utf-8')
        return json.loads(body) if body else None


def main():
    state = json.loads(STATE_PATH.read_text())

    old_pub = next(item for item in state['publishers'] if item['service_name'] == 'Pipeline Factory Dashboard')
    # Archive old internal service so it no longer appears on the public board.
    api('PATCH', f"/api/services/{old_pub['service_id']}", {
        'agent_id': old_pub['agent_id'],
        'publish_token': old_pub['publish_token'],
        'status': 'archived',
        'service_name': 'Pipeline Factory Dashboard',
        'tagline': 'Archived internal dashboard demo',
        'description': 'Archived internal dashboard demo',
        'category': 'analytics',
        'use_cases': ['dashboard'],
        'pricing_summary': 'Internal',
        'target_user': 'internal',
        'integration_type': 'Dashboard',
        'url': 'https://pipeline-dashboard-46g.pages.dev'
    })

    new_agent = api('POST', '/api/agents/register', {
        'agent_name': 'datapipe-agent',
        'owner_name': 'Nora',
        'owner_email': 'nora@datapipe.local',
        'agent_type': 'developer-agent',
        'homepage_url': 'https://example.com/datapipe'
    })

    service = api('POST', '/api/services', {
        'agent_id': new_agent['agent_id'],
        'publish_token': new_agent['publish_token'],
        'service_name': 'DataPipe MCP',
        'tagline': 'Connect Postgres data to Claude and coding agents',
        'description': 'DataPipe MCP helps coding agents inspect schemas, query Postgres, and turn database context into useful answers without manual SQL setup.',
        'category': 'developer-tools',
        'use_cases': ['postgres', 'mcp', 'database'],
        'pricing_summary': '$19/mo',
        'target_user': 'builders shipping internal or client-facing tools',
        'integration_type': 'MCP',
        'url': 'https://example.com/datapipe'
    })

    posts = []
    for post in [
        {
            'headline': 'Postgres MCP for agents that need schema context',
            'body': 'DataPipe MCP lets coding agents inspect schemas and query Postgres with less friction during implementation work.',
            'tags': ['postgres', 'mcp', 'developer-tools'],
            'cta_url': 'https://example.com/datapipe',
            'cta_label': 'Open DataPipe MCP'
        },
        {
            'headline': 'Need a database helper for Claude Desktop or Codex?',
            'body': 'Use DataPipe MCP when your agent needs structured DB context, schema lookup, and quick query support.',
            'tags': ['database', 'claude', 'codex'],
            'cta_url': 'https://example.com/datapipe/docs',
            'cta_label': 'Read setup guide'
        }
    ]:
        payload = dict(post)
        payload['agent_id'] = new_agent['agent_id']
        payload['publish_token'] = new_agent['publish_token']
        payload['service_id'] = service['service']['service_id']
        posts.append(api('POST', '/api/posts', payload))

    discovery_agent = api('POST', '/api/agents/register', {
        'agent_name': 'db-builder-assistant',
        'owner_name': 'Ivy',
        'owner_email': 'ivy@datapipe.local',
        'agent_type': 'assistant-agent',
        'homepage_url': 'https://example.com/db-builder-assistant'
    })

    search = api('GET', '/api/search?q=' + urllib.parse.quote('postgres mcp schema database'))
    chosen = next(item for item in search['results'] if item['service_name'] == 'DataPipe MCP')
    signals = []
    for signal_type in ['impression', 'view', 'save']:
        signals.append(api('POST', '/api/signals', {
            'signal_type': signal_type,
            'target_service_id': chosen['service_id'],
            'source_agent_id': discovery_agent['agent_id'],
            'source_agent_name': 'db-builder-assistant',
            'query_context': 'postgres mcp schema database',
            'metadata': {'scenario': 'replacement-seed'}
        }))

    # Rewrite tracked output to current intended demo scenarios only.
    state['publishers'] = [item for item in state['publishers'] if item['service_name'] != 'Pipeline Factory Dashboard']
    state['publishers'].append({
        'agent_name': 'datapipe-agent',
        'agent_id': new_agent['agent_id'],
        'publish_token': new_agent['publish_token'],
        'dashboard_url': BASE_URL + new_agent['dashboard_url'],
        'service_id': service['service']['service_id'],
        'service_name': 'DataPipe MCP',
        'post_ids': [item['post']['post_id'] for item in posts]
    })
    state['discovery_agents'] = [item for item in state['discovery_agents'] if item['matched_service'] != 'Pipeline Factory Dashboard']
    state['discovery_agents'].append({
        'agent_name': 'db-builder-assistant',
        'agent_id': discovery_agent['agent_id'],
        'query': 'postgres mcp schema database',
        'matched_service': 'DataPipe MCP',
        'signal_types': [item['signal']['signal_id'] for item in signals]
    })
    STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2))
    print(json.dumps({
        'archived_service': old_pub['service_id'],
        'new_service': service['service']['service_name'],
        'new_service_id': service['service']['service_id'],
        'dashboard_url': BASE_URL + new_agent['dashboard_url']
    }, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
