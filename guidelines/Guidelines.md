**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
# MYPA – Design System & AI Rules

MYPA is not a productivity app.  
It is a **life operating system**.

Design must feel:
- Calm
- Intelligent
- Premium
- Trustworthy
- Human
- Non-corporate

Avoid:
- Clutter
- SaaS dashboards
- Neon colors
- Dense lists
- Gamified ugliness


# Layout Rules
- Use vertical flow, not grid overload.
- Everything lives inside cards.
- Use an 8pt spacing system (8 / 16 / 24 / 32).
- Prefer flexible stacks over absolute positioning.
- UI must feel breathable and calm.



Rules:
- Voice is always visible
- No floating action button
- Hub is the control center
- Inbox is tasks & messages
- Circles is the social layer


# Colors
Background: #F6F7FA (soft off-white)

Primary accent:
Soft gradient (Purple → Blue)

Use gradients ONLY for:
- Voice
- Hero cards
- Important tiles

Never use gradients for:
- Lists
- Full pages
- Text backgrounds

Success: Soft green  
Failure: Muted red  
Neutral: Light gray / slate

Never use neon or hard colors.


# Typography
- SF Pro style
- Headings: medium weight
- Body: regular
- Numbers slightly bolder

Never use ALL CAPS for headings.


# Cards
Everything lives in cards.

Cards:
- Rounded corners (16–24px)
- Subtle shadow
- White or very light fill

Card types:
- Hero (Daily Briefing, Wallet Ring)
- Info (Plan, Inbox, Challenges)
- Social (Feed, Circles)
- Action (Start Mission, Record Proof)


# Voice Screen
Voice must be immersive:
- Dark background
- Glowing orb
- No lists or clutter
- Only voice feedback


# Time Wallet
Time is MYPA’s core currency.

Always show:
+42m  
+2h 10m  

Never decimals.

Wallet must show:
- Today
- This week
- This month
- Streak
- Where time came from


# Inbox
Inbox contains:
- Tasks
- Reminders
- Challenge invites
- Social requests

Every item:
- One clear action
- Green = done
- Red = needs action
- No long reading


# Challenges
Every challenge shows:
- Title
- Members
- Your status
- Proof action (camera)

Proof = photo, short video, or check-in


# Circles
Circles are private groups.

They must:
- Look like rooms
- Show avatars inside
- Feel social and alive

Circle feed:
- Only proof-of-progress
- No long posts
- No Twitter-style comments


# Hub
The Hub is not a feed.

It shows:
- Daily Briefing
- Progress ring
- Plan tile
- Wallet
- Inbox
- Challenges

No infinite scrolling.


# AI Tone
AI should feel:
- Calm
- Supportive
- Human
- Intelligent

Good:
“Let’s get you back on track.”
Bad:
“Your productivity score is 73%.”


# Components
Always reuse:
- Mission Card
- Challenge Card
- Feed Card
- Plan Block
- Wallet Ring
- Circle Bubble

No one-off UI.


# Final Rule
If it looks like:
- A dashboard
- A spreadsheet
- A SaaS tool

It is wrong.

MYPA must feel like:
**A calm, intelligent life companion.**
