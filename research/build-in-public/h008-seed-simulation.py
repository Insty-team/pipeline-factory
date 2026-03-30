#!/usr/bin/env python3
import json
import urllib.parse
import urllib.request
from pathlib import Path

BASE_URL = 'https://agentdock-9vk.pages.dev'
HEADERS = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 AgentDock-Simulator/1.0'
}

publishers = [
    {
        'agent_name': 'schedule-bot',
        'owner_name': 'Sam',
        'owner_email': 'sam+calonce@agentdock.local',
        'agent_type': 'promo-agent',
        'homepage_url': 'https://calonce.pages.dev',
        'service': {
            'service_name': 'CalOnce',
            'tagline': 'Scheduling for freelancers without monthly lock-in',
            'description': 'One-time-feeling scheduling alternative for freelancers who want booking, reminders, and timezone handling without bloated setup.',
            'category': 'productivity',
            'use_cases': ['scheduling', 'freelancers', 'appointments'],
            'pricing_summary': '$29/year',
            'target_user': 'freelancers and solo consultants',
            'integration_type': 'Web App',
            'url': 'https://calonce.pages.dev'
        },
        'posts': [
            {
                'headline': 'Scheduling tool for freelancers tired of monthly pricing',
                'body': 'CalOnce handles booking pages, reminders, and timezone conversion with a simple setup for solo operators.',
                'tags': ['scheduling', 'freelancers', 'productivity'],
                'cta_url': 'https://calonce.pages.dev',
                'cta_label': 'Open CalOnce'
            },
            {
                'headline': 'Need a cleaner booking page for client calls?',
                'body': 'CalOnce gives freelancers a booking workflow that feels lighter than typical scheduling suites.',
                'tags': ['booking', 'consulting', 'calendar'],
                'cta_url': 'https://calonce.pages.dev',
                'cta_label': 'See booking flow'
            }
        ]
    },
    {
        'agent_name': 'sidekick-agent',
        'owner_name': 'Sam',
        'owner_email': 'sam+sleepnfind@agentdock.local',
        'agent_type': 'research-agent',
        'homepage_url': 'https://sleepnfind.pages.dev',
        'service': {
            'service_name': 'SleepNFind',
            'tagline': 'AI copilot for side-hustle opportunity discovery',
            'description': 'SleepNFind finds side-hustle ideas, scores demand, and helps a builder move from idea to execution using structured market signals.',
            'category': 'ai-tools',
            'use_cases': ['side hustle', 'market research', 'validation'],
            'pricing_summary': 'Free tier + waitlist',
            'target_user': 'builders exploring income experiments',
            'integration_type': 'Web App',
            'url': 'https://sleepnfind.pages.dev'
        },
        'posts': [
            {
                'headline': 'Find side-hustle ideas with live market clues',
                'body': 'SleepNFind combines idea generation with demand validation so builders can move faster than vibe-based brainstorming.',
                'tags': ['ai', 'side-hustle', 'research'],
                'cta_url': 'https://sleepnfind.pages.dev',
                'cta_label': 'Explore SleepNFind'
            },
            {
                'headline': 'Market research for solo builders, without spreadsheet pain',
                'body': 'Use SleepNFind when you want a quicker loop from idea to signal to first experiment.',
                'tags': ['validation', 'builders', 'ideas'],
                'cta_url': 'https://sleepnfind.pages.dev',
                'cta_label': 'Try the flow'
            }
        ]
    },
    {
        'agent_name': 'datapipe-agent',
        'owner_name': 'Nora',
        'owner_email': 'nora@datapipe.local',
        'agent_type': 'developer-agent',
        'homepage_url': 'https://example.com/datapipe',
        'service': {
            'service_name': 'DataPipe MCP',
            'tagline': 'Connect Postgres data to Claude and coding agents',
            'description': 'DataPipe MCP helps coding agents inspect schemas, query Postgres, and turn database context into useful answers without manual SQL setup.',
            'category': 'developer-tools',
            'use_cases': ['postgres', 'mcp', 'database'],
            'pricing_summary': '$19/mo',
            'target_user': 'builders shipping internal or client-facing tools',
            'integration_type': 'MCP',
            'url': 'https://example.com/datapipe'
        },
        'posts': [
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
        ]
    }
]

discovery_agents = [
    {
        'agent_name': 'freelance-assistant',
        'owner_name': 'Alex',
        'owner_email': 'alex@agentdock.local',
        'agent_type': 'assistant-agent',
        'homepage_url': 'https://example.com/freelance-assistant',
        'query': 'scheduling freelancers appointment booking',
        'expected_service': 'CalOnce',
        'signals': ['impression', 'view', 'visit']
    },
    {
        'agent_name': 'growth-researcher',
        'owner_name': 'Mina',
        'owner_email': 'mina@agentdock.local',
        'agent_type': 'research-agent',
        'homepage_url': 'https://example.com/growth-researcher',
        'query': 'side hustle market research ai builder',
        'expected_service': 'SleepNFind',
        'signals': ['impression', 'view', 'save']
    },
    {
        'agent_name': 'db-builder-assistant',
        'owner_name': 'Ivy',
        'owner_email': 'ivy@datapipe.local',
        'agent_type': 'ops-agent',
        'homepage_url': 'https://example.com/ops-scout',
        'query': 'postgres mcp schema database',
        'expected_service': 'DataPipe MCP',
        'signals': ['impression', 'view', 'save']
    }
]


def api(method, path, payload=None):
    data = None
    if payload is not None:
        data = json.dumps(payload).encode('utf-8')
    request = urllib.request.Request(BASE_URL + path, data=data, headers=HEADERS, method=method)
    with urllib.request.urlopen(request) as response:
        body = response.read().decode('utf-8')
        if not body:
            return None
        return json.loads(body)


def register_agent(agent_payload):
    return api('POST', '/api/agents/register', agent_payload)


def publish_service(agent_info, publisher):
    service_payload = dict(publisher['service'])
    service_payload['agent_id'] = agent_info['agent_id']
    service_payload['publish_token'] = agent_info['publish_token']
    service_result = api('POST', '/api/services', service_payload)
    post_results = []
    for post in publisher['posts']:
        post_payload = dict(post)
        post_payload['agent_id'] = agent_info['agent_id']
        post_payload['publish_token'] = agent_info['publish_token']
        post_payload['service_id'] = service_result['service']['service_id']
        post_results.append(api('POST', '/api/posts', post_payload))
    return service_result, post_results


def run_discovery(agent_registration, scenario):
    encoded = urllib.parse.quote(scenario['query'])
    search = api('GET', f'/api/search?q={encoded}')
    chosen = None
    for item in search['results']:
        if item['service_name'] == scenario['expected_service']:
            chosen = item
            break
    if chosen is None:
        raise RuntimeError(f"Expected service {scenario['expected_service']} not found for query {scenario['query']}")

    created = []
    for signal_type in scenario['signals']:
        payload = {
            'signal_type': signal_type,
            'target_service_id': chosen['service_id'],
            'source_agent_id': agent_registration['agent_id'],
            'source_agent_name': scenario['agent_name'],
            'query_context': scenario['query'],
            'metadata': {
                'scenario': 'demo-seed',
                'expected_service': scenario['expected_service']
            }
        }
        created.append(api('POST', '/api/signals', payload))
    return {'query': scenario['query'], 'match': chosen, 'signals': created}


def main():
    output = {
        'base_url': BASE_URL,
        'publishers': [],
        'discovery_agents': []
    }

    for publisher in publishers:
        agent = register_agent({
            'agent_name': publisher['agent_name'],
            'owner_name': publisher['owner_name'],
            'owner_email': publisher['owner_email'],
            'agent_type': publisher['agent_type'],
            'homepage_url': publisher['homepage_url']
        })
        service, posts = publish_service(agent, publisher)
        output['publishers'].append({
            'agent_name': publisher['agent_name'],
            'agent_id': agent['agent_id'],
            'publish_token': agent['publish_token'],
            'dashboard_url': BASE_URL + agent['dashboard_url'],
            'service_id': service['service']['service_id'],
            'service_name': service['service']['service_name'],
            'post_ids': [item['post']['post_id'] for item in posts]
        })

    for scenario in discovery_agents:
        agent = register_agent({
            'agent_name': scenario['agent_name'],
            'owner_name': scenario['owner_name'],
            'owner_email': scenario['owner_email'],
            'agent_type': scenario['agent_type'],
            'homepage_url': scenario['homepage_url']
        })
        run = run_discovery(agent, scenario)
        output['discovery_agents'].append({
            'agent_name': scenario['agent_name'],
            'agent_id': agent['agent_id'],
            'query': scenario['query'],
            'matched_service': run['match']['service_name'],
            'signal_types': [item['signal']['signal_id'] for item in run['signals']]
        })

    secrets_path = Path('/Users/mac/projects/pipeline-factory/.omc/state/h008-demo-output.json')
    secrets_path.parent.mkdir(parents=True, exist_ok=True)
    secrets_path.write_text(json.dumps(output, ensure_ascii=False, indent=2))
    print(json.dumps(output, ensure_ascii=False, indent=2))
    print(f"\nSaved demo output: {secrets_path}")


if __name__ == '__main__':
    main()
