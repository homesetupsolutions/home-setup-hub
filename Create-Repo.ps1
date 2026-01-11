
# Create-Repo.ps1 — builds the full repo structure with all files (fixed version)
Param([string]$Root = (Get-Location).Path)

$repo = Join-Path $Root "homesetupsolutions"
$folders = @(
  "src/api","src/functions/textReminders","src/functions/squareWebhooks",
  "src/functions/gpsTracker","src/functions/emailReminders","src/web/assets",
  "azure","docs","config",".github/workflows"
)
foreach ($f in $folders) { New-Item -ItemType Directory -Force -Path (Join-Path $repo $f) | Out-Null }

# .env.example (with flags)
$envExample = @'
NODE_ENV=production
PORT=8080

# Square
SQUARE_APP_ID=__SET_IN_KEYVAULT__
SQUARE_ACCESS_TOKEN=__SET_IN_KEYVAULT__
SQUARE_ENV=production
SQUARE_LOCATION_ID=__REQUIRED__
SQUARE_WEBHOOK_SIGNATURE_KEY=__REQUIRED__

# Azure Communication Services (ACS)
ACS_CONNECTION_STRING=__SET_IN_KEYVAULT__
ACS_TOLL_FREE_NUMBER=+18332302933
ACS_LOCAL_LONG_CODE=+15878994357

# Microsoft Graph / OneDrive
AZURE_TENANT_ID=__REQUIRED__
AZURE_CLIENT_ID=__REQUIRED__
AZURE_CLIENT_SECRET=__SET_IN_KEYVAULT__
ONEDRIVE_FOLDER_ID=__REQUIRED__

# Storage
AZURE_STORAGE_CONNECTION_STRING=__SET_IN_KEYVAULT__
GPS_TABLE_NAME=installer_locations

# App settings
COMPANY_NAME=Home Setup Solutions
PRIMARY_COLOR=#FF6A00
BACKGROUND_COLOR=#000000
SITE_NAME=Homesetupsolutions.ca
CUSTOMER_TERM=CX
HOSTER=GoDaddy
REGION=westus2
RESOURCE_GROUP=Homesetupsolutions_group

# Reminders feature flags
ENABLE_SMS=false
ENABLE_EMAIL=false
'@
Set-Content -Path (Join-Path $repo ".env.example") -Value $envExample -Encoding UTF8

# README
$readme = @'
# Home Setup Solutions — Azure App & Website

Sleek, high-tech site + backend integrating Square (Bookings, Team, Labor, Catalog),
Azure Communication Services (SMS/Chat), Microsoft Graph/OneDrive (gallery),
and day-of GPS tracking.

## Stack
- Frontend: HTML/CSS/JS (black + bright orange)
- Backend: Node.js (Express) on Azure App Service
- Serverless: Azure Functions (JavaScript v4)
- Messaging: Azure Communication Services (SMS/Chat)
- Storage: Azure Storage Tables (GPS)
- Secrets: Azure Key Vault (managed identity)

## Deploy
See `azure/setup.ps1` or `azure/setup.sh`
'@
Set-Content -Path (Join-Path $repo "README.md") -Value $readme -Encoding UTF8

# Basic Express API
$serverJs = @'
const express = require(''express'');
const helmet = require(''helmet'');
const path = require(''path'');
const bodyParser = require(''body-parser'');

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, ''../web'')));

// Health
app.get(''/api/health'', (req,res)=> res.json({status:''ok''}));

// Catalog (stub)
app.get(''/api/catalog'', async (req,res)=> { res.json({items: []}); });

// Gallery (stub)
app.get(''/api/gallery'', async (req,res)=> { res.json({files: []}); });

// GPS (stub)
app.post(''/api/gps'', async (req,res)=> { res.json({ok:true}); });

const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log(`API listening on ${port}`));
'@
Set-Content -Path (Join-Path $repo "src/api/server.js") -Value $serverJs -Encoding UTF8

# Frontend pages & CSS
$indexHtml = @'
<!doctype html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Home Setup Solutions</title><link rel="stylesheet" href="/assets/style.css"/></head>
<body><header><img src="/assets/logo.png" class="logo" alt="Logo"/>
<nav><a href="/index.html">Home</a><a href="/booking.html">Booking</a><a href="/staff.html">Staff</a>
<a href="/customer.html">Customer</a><a href="/gallery.html">Gallery</a><a href="/policy.html">Policy</a></nav></header>
<section class="hero"><h1>Simplify Your Space, Amplify Your Comfort</h1><p>All-in-one home setup, smart tech, and organization in Calgary.</p>
<a class="cta" href="/booking.html">Book Now</a></section><footer><p>© Home Setup Solutions</p></footer></body></html>
'@
Set-Content -Path (Join-Path $repo "src/web/index.html") -Value $indexHtml -Encoding UTF8

$styleCss = @'
:root{ --bg:#000; --accent:#FF6A00; --text:#fff; }
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,Roboto}
header{display:flex;align-items:center;justify-content:space-between;padding:1rem;border-bottom:1px solid #222;background:#000}
nav a{color:#fff;margin:0 0.75rem;text-decoration:none}
nav a:hover{color:var(--accent)}
.logo{height:48px}
.hero{padding:4rem 2rem;text-align:center}
.hero h1{font-size:2.2rem;margin-bottom:0.5rem}
.cta{display:inline-block;margin-top:1rem;padding:0.75rem 1.25rem;background:var(--accent);color:#000;border-radius:6px;font-weight:700;text-decoration:none}
footer{padding:2rem;text-align:center;border-top:1px solid #222}
'@
Set-Content -Path (Join-Path $repo "src/web/assets/style.css") -Value $styleCss -Encoding UTF8

Set-Content -Path (Join-Path $repo "src/web/booking.html") -Value '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/assets/style.css"><title>Booking</title></head><body><header><nav><a href="/index.html">Home</a></nav></header><main style="padding:2rem"><h2>Booking</h2><div id="booking-root">Loading availability…</div></main></body></html>' -Encoding UTF8
Set-Content -Path (Join-Path $repo "src/web/staff.html") -Value '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/assets/style.css"><title>Staff Portal</title></head><body><header><nav><a href="/index.html">Home</a></nav></header><main style="padding:2rem"><h2>Staff Portal</h2><p>Login to view schedule, payments, tax docs, and upload photos.</p></main></body></html>' -Encoding UTF8
Set-Content -Path (Join-Path $repo "src/web/customer.html") -Value '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/assets/style.css"><title>Customer Portal</title></head><body><header><nav><a href="/index.html">Home</a></nav></header><main style="padding:2rem"><h2>Customer Portal</h2><p>View your bookings, availability, and message your installer.</p></main></body></html>' -Encoding UTF8
Set-Content -Path (Join-Path $repo "src/web/gallery.html") -Value '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/assets/style.css"><title>Gallery</title></head><body><header><nav><a href="/index.html">Home</a></nav></header><main style="padding:2rem"><h2>Project Gallery</h2><div id="gallery"></div></main></body></html>' -Encoding UTF8
Set-Content -Path (Join-Path $repo "src/web/policy.html") -Value '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/assets/style.css"><title>Policy</title></head><body><header><nav><a href="/index.html">Home</a></nav></header><main style="padding:2rem"><h2>Texting Policy (Canada)</h2><div id="policy"></div></main></body></html>' -Encoding UTF8

# Azure Functions (SMS disabled by feature flag; email stub)
$textFunc = @'
// Azure Functions v4 (Node.js)
const { app } = require('@azure/functions');

const enableSms = (process.env.ENABLE_SMS || 'false').toLowerCase() === 'true';

if (enableSms) {
  app.timer('textReminders', {
    schedule: '0 */5 * * * *',
    handler: async (timer, context) => {
      context.log('SMS reminders are ENABLED');
      // TODO: Pull today appointments via Square Bookings API and send via ACS
    }
  });
} else {
  app.timer('textRemindersDisabled', {
    schedule: '0 0 3 * * *',
    handler: async (timer, context) => {
      context.log('SMS reminders are DISABLED');
    }
  });
}
'@
Set-Content -Path (Join-Path $repo "src/functions/textReminders/index.js") -Value $textFunc -Encoding UTF8

$emailFunc = @'
const { app } = require('@azure/functions');
const enableEmail = (process.env.ENABLE_EMAIL || 'false').toLowerCase() === 'true';
app.timer('emailReminders', {
  schedule: '0 */15 * * * *',
  handler: async (timer, context) => {
    if (!enableEmail) { context.log('Email reminders are DISABLED'); return; }
    context.log('Email reminders running');
    // TODO: Fetch upcoming bookings from Square and send transactional emails
  }
});
'@
Set-Content -Path (Join-Path $repo "src/functions/emailReminders/index.js") -Value $emailFunc -Encoding UTF8

$webhookFunc = @'
const { app } = require('@azure/functions');
app.http('squareWebhook', {
  methods: ['POST'],
  authLevel: 'function',
  handler: async (req, context) => {
    context.log('Square webhook received');
    return { status: 200, jsonBody: { ok: true } };
  }
});
'@
Set-Content -Path (Join-Path $repo "src/functions/squareWebhooks/index.js") -Value $webhookFunc -Encoding UTF8

$gpsFunc = @'
const { app } = require('@azure/functions');
app.http('gpsTracker', {
  methods: ['POST'],
  authLevel: 'function',
  handler: async (req, context) => {
    const data = await req.json();
    context.log('GPS update', data);
    return { status: 200, jsonBody: { ok: true } };
  }
});
'@
Set-Content -Path (Join-Path $repo "src/functions/gpsTracker/index.js") -Value $gpsFunc -Encoding UTF8

# Azure Bicep (single-quoted here-string to avoid interpolation)
$bicep = @'
param location string = 'westus2'
param namePrefix string = 'hss'
param skuName string = 'B1'

resource kv 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: '${namePrefix}-kv'
  location: location
  properties: {
    tenantId: '<TENANT_ID>'
    sku: { name: 'standard', family: 'A' }
    enableSoftDelete: true
    enablePurgeProtection: true
  }
}

resource comms 'Microsoft.Communication/CommunicationServices@2023-03-31' = {
  name: '${namePrefix}-comms'
  location: location
  properties: { dataLocation: 'UnitedStates' }
}

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: '${namePrefix}-plan'
  location: location
  sku: { name: skuName, capacity: 1, tier: 'Basic' }
}

resource web 'Microsoft.Web/sites@2023-12-01' = {
  name: '${namePrefix}-web'
  location: location
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: { appSettings: [
      { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '18.20.0' },
      { name: 'SQUARE_APP_ID', value: '@Microsoft.KeyVault(SecretUri=https://${namePrefix}-kv.vault.azure.net/secrets/SQUARE_APP_ID)' },
      { name: 'SQUARE_ACCESS_TOKEN', value: '@Microsoft.KeyVault(SecretUri=https://${namePrefix}-kv.vault.azure.net/secrets/SQUARE_ACCESS_TOKEN)' },
      { name: 'ACS_CONNECTION_STRING', value: '@Microsoft.KeyVault(SecretUri=https://${namePrefix}-kv.vault.azure.net/secrets/ACS_CONNECTION_STRING)' }
    ]}
  }
}

resource func 'Microsoft.Web/sites@2023-12-01' = {
  name: '${namePrefix}-func'
  location: location
  properties: {
    serverFarmId: plan.id
    siteConfig: { appSettings: [
      { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~4' },
      { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'node' },
      { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '18.20.0' }
    ]}
  }
}
'@
Set-Content -Path (Join-Path $repo "azure/deploy.bicep") -Value $bicep -Encoding UTF8

# Azure setup scripts
$setupPs1 = @'
Param([string]$ResourceGroup=''Homesetupsolutions_group'',[string]$Location=''westus2'',[string]$Prefix=''hss'')
Write-Host ''Logging into Azure...'' -ForegroundColor Cyan
az login
Write-Host ''Creating resource group...'' -ForegroundColor Cyan
az group create -n $ResourceGroup -l $Location --output table
Write-Host ''Deploying core resources...'' -ForegroundColor Cyan
$DeploymentName = ''hss-core-'' + (Get-Date -Format ''yyyyMMddHHmmss'')
az deployment group create -g $ResourceGroup -n $DeploymentName -f azure/deploy.bicep -p location=$Location namePrefix=$Prefix --output table
Write-Host ''Provisioned.'' -ForegroundColor Green
'@
Set-Content -Path (Join-Path $repo "azure/setup.ps1") -Value $setupPs1 -Encoding UTF8

$setupSh = @'
#!/usr/bin/env bash
set -e
RESOURCE_GROUP=${RESOURCE_GROUP:-Homesetupsolutions_group}
LOCATION=${LOCATION:-westus2}
PREFIX=${PREFIX:-hss}
az group create -n "$RESOURCE_GROUP" -l "$LOCATION"
az deployment group create -g "$RESOURCE_GROUP" -f azure/deploy.bicep -p location="$LOCATION" namePrefix="$PREFIX"
echo 'Provisioned.'
'@
Set-Content -Path (Join-Path $repo "azure/setup.sh") -Value $setupSh -Encoding UTF8

# QuickStart doc
$quick = @'
# QuickStart — Home Setup Solutions

1) Provision Azure:
   - Windows: PowerShell `azure/setup.ps1`
   - Mac/Linux: `bash azure/setup.sh`

2) Key Vault secrets:
   SQUARE_APP_ID, SQUARE_ACCESS_TOKEN, AZURE_CLIENT_SECRET, AZURE_STORAGE_CONNECTION_STRING
   *(ACS not needed until you re-enable SMS)*

3) Function App configuration:
   ENABLE_SMS=false, ENABLE_EMAIL=false

4) Deployment Center:
   Connect App Service (hss-web) & Function App (hss-func)
   to GitHub repo `homesetupsolutions/Main` on branch `main`.

5) GoDaddy DNS:
   TXT verify, CNAME (www), A record (apex or use Azure DNS).
'@
Set-Content -Path (Join-Path $repo "docs/README-QuickStart.md") -Value $quick -Encoding UTF8

# GitHub Actions workflow (single-quoted here-string to preserve ${{ ... }})
$workflow = @'
name: Deploy to Azure
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "18"

      - name: Install API deps
        working-directory: src/api
        run: |
          npm init -y || true
          npm install express helmet body-parser

      - name: Azure WebApp Deploy (API)
        uses: azure/webapps-deploy@v3
        with:
          app-name: hss-web
          slot-name: production
          package: src/api
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}

      - name: Azure Functions Deploy
        uses: Azure/functions-action@v1
        with:
          app-name: hss-func
          package: src/functions
          publish-profile: ${{ secrets.AZURE_FUNCTIONAPP_PUBLISH_PROFILE }}
'@
Set-Content -Path (Join-Path $repo ".github/workflows/azure-deploy.yml") -Value $workflow -Encoding UTF8

# Taskrabbit config placeholder
Set-Content -Path (Join-Path $repo "config/taskrabbit_profile.md") -Value '# Paste Taskrabbit profile text here to auto-generate testimonials/services.' -Encoding UTF8

Write-Host "Repo created at: $repo" -ForegroundColor Green
