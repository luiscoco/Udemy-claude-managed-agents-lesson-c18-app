# C18 · Enabled versus Permitted

Classifies locally supplied permission observations; it does not enforce a cloud tool permission. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- Enablement differs from permission
- Ask is a host handoff
- Deny without evaluation can mean unavailable

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3018`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3018
```

## How the app was build

### 1. Classify availability before permission

A disabled tool is unavailable regardless of its permission label. Enabled ask becomes a handoff; deny is classified as a server denial only when evaluation evidence exists.

Source: [src/lesson.ts](src/lesson.ts#L13) · selected statements

```typescript
const enabled = flag(input, "enabled"),
  p = text(input, "permission"),
  evaluated = flag(input, "hasEvaluation");

const classification = !enabled
  ? "unavailable"
  : p === "allow"
    ? "allowed"
    : p === "ask"
      ? "asked"
      : p === "deny" && evaluated
        ? "denied-server"
        : "unknown";
```

### 2. Keep unhandled states outside success

Allowed maps to passed, asked maps to paused, and other classifications map to rejected. Inspect classification alongside the original enablement and permission fields instead of treating every deny label as equivalent.

Source: [src/lesson.ts](src/lesson.ts#L15)

```typescript
return report(
  classification === "allowed"
    ? "passed"
    : classification === "asked"
      ? "paused"
      : "rejected",
  "Classified availability separately from the permission decision",
  { classification, enabled, permission: p },
  [
    "Check tool availability",
    "Read the evaluated permission",
    "Keep unhandled observations non-successful",
  ],
);
```

### Check your understanding

Run **An enabled tool asks** in the application. Compare the result with these scenario expectations:

```json
{
  "input": {
    "enabled": true,
    "permission": "ask",
    "hasEvaluation": true
  },
  "expectedOutcome": "paused",
  "checkEvidence": {
    "classification": "asked"
  }
}
```

Then try **An unavailable tool**. Its expected outcome is `rejected`; identify the condition or evidence field that explains the difference.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
