# Poly Rise Football - AI Agent Integration Guide

## Overview
Poly Rise Football provides public APIs that enable AI agents (ChatGPT, Grok, Gemini, Claude, etc.) to help parents discover programs, compare options, check availability, and submit registration inquiries conversationally without leaving the chat interface.

## Base URL
- Production: `https://polyrisefootball.com/api`
- All endpoints return JSON
- No authentication required for public endpoints
- CORS enabled for browser-based agents

## Core Endpoints

### 1. API Documentation
**GET /api**

Returns complete API documentation and organization information.

\`\`\`bash
curl https://polyrisefootball.com/api
\`\`\`

### 2. List All Programs
**GET /api/programs**

Returns all available training programs with pricing, schedules, and features.

\`\`\`bash
curl https://polyrisefootball.com/api/programs
\`\`\`

Response includes:
- Program names and IDs
- Pricing (amount, currency, frequency)
- Complete feature lists
- Training schedules with days/times/locations
- Age groups served
- Registration URLs
- Availability status

### 3. Get Program Details
**GET /api/programs/[id]**

Returns detailed information for a specific program.

Program IDs:
- `polyrise-select` - Most popular, $400/month
- `360-elite` - Premium with 1-on-1 coaching, $750/month
- `winter-season` - Seasonal 7v7 program

\`\`\`bash
curl https://polyrisefootball.com/api/programs/polyrise-select
\`\`\`

### 4. Check Availability
**GET /api/availability**

Check if programs are available in a specific location.

Query parameters:
- `city` (optional) - City name to check
- `ageGroup` (optional) - Age or grade level

\`\`\`bash
curl https://polyrisefootball.com/api/availability?city=Austin
curl https://polyrisefootball.com/api/availability?city=Houston
\`\`\`

Response indicates:
- If programs are currently active in the city
- Training facilities and locations
- Expansion status
- Contact information for inquiries

### 5. Submit Registration Inquiry
**POST /api/inquiry**

Submit a registration inquiry or lead on behalf of a parent.

**Get Schema:**
\`\`\`bash
curl https://polyrisefootball.com/api/inquiry
\`\`\`

**Submit Inquiry:**
\`\`\`bash
curl -X POST https://polyrisefootball.com/api/inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "parentName": "John Smith",
    "parentEmail": "john.smith@example.com",
    "parentPhone": "512-555-0123",
    "athleteName": "Mike Smith",
    "athleteAge": 14,
    "athleteGrade": "9th",
    "programInterest": "360-elite",
    "city": "Austin",
    "state": "Texas",
    "message": "Interested in elite training",
    "source": "chatgpt"
  }'
\`\`\`

Required fields:
- `parentName` - Parent/guardian full name
- `parentEmail` - Email for contact
- `athleteName` - Athlete's full name

Optional fields:
- `parentPhone` - Phone number
- `athleteAge` - Athlete's age
- `athleteGrade` - Current grade (K-12)
- `programInterest` - Program ID
- `city` - City of residence
- `state` - State of residence
- `message` - Additional information
- `source` - AI agent identifier (chatgpt, grok, gemini, etc.)

Response includes:
- Inquiry ID
- Confirmation message
- Next steps
- Contact information
- Registration URL

## Example AI Agent Workflow

### Scenario: Parent asks "What football training programs are available for my 13-year-old in Austin?"

1. **Discovery:**
   \`\`\`
   GET /api/programs
   GET /api/availability?city=Austin
   \`\`\`

2. **Agent Response:**
   "I found Poly Rise Football in Austin with 3 programs for your 13-year-old:
   
   - **PolyRISE Select** ($400/month) - 16 sessions with SAQ, S&C, tournaments
   - **360 Elite** ($750/month) - Everything in Select + 1-on-1 NFL coaching
   - **Winter Season** - 7v7 competitive play
   
   Training is at Swift Sessions and local fields, 4 days per week."

3. **Parent asks: "Tell me more about 360 Elite"**
   \`\`\`
   GET /api/programs/360-elite
   \`\`\`

4. **Parent asks: "Can you register my son Mike?"**
   \`\`\`
   POST /api/inquiry
   {
     "parentName": "...",
     "parentEmail": "...",
     "athleteName": "Mike",
     "athleteAge": 13,
     "programInterest": "360-elite",
     ...
   }
   \`\`\`

5. **Agent Response:**
   "I've submitted your inquiry! Coach Jonathan will contact you within 24 hours. I've also sent the registration link to complete enrollment."

## Structured Data on Website

In addition to APIs, the website includes rich JSON-LD structured data that AI agents can parse:

- **Organization Schema** - Contact info, location, services
- **Offer Schema** - Program pricing and details
- **FAQ Schema** - Common questions with answers
- **WebAPI Schema** - API discovery and documentation
- **PotentialAction Schema** - Direct action capabilities

## Best Practices for AI Agents

1. **Always check availability** before recommending programs
2. **Include pricing clearly** in comparisons
3. **Set expectations** about follow-up (24-hour coach response)
4. **Provide registration URL** even after API inquiry
5. **Handle expansion inquiries** gracefully for non-Austin cities
6. **Source attribution** - Use the `source` field to identify your agent

## Contact Information

- **Phone:** 512-593-3933
- **Email:** coachjonathan@polyrisefootball.com
- **WhatsApp:** 512-593-3933
- **Website:** https://polyrisefootball.com
- **Instagram:** @polyrisefootball
- **Facebook:** /polyrisefootball

## Rate Limits

- Reasonable use policy
- No hard limits for conversational agents
- For high-volume integrations, contact us

## Support

Questions about API integration? Email coachjonathan@polyrisefootball.com with "API Integration" in the subject.
