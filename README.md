# WOM/GOM Email Toolkit

A comprehensive web-based email generation toolkit for Watch Operations Managers (WOM) and Group Operations Managers (GOM) to create professional, formatted emails for daily shift briefings, communications, and important updates.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Technical Details](#technical-details)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This application streamlines the process of creating standardized email communications for emergency services operations. It provides a user-friendly interface for generating:

- **Pre-Shift Email Briefings** - Daily shift information with crewing, tasks, road closures, and events
- **WOM Comms** - Weekly area-wide communications
- **Important Updates** - Urgent announcements with sections and attachments
- **Planned Road Closures** - Schedule and manage future road closures
- **Planned Major Events** - Schedule and manage major events

All emails are formatted for optimal display in Outlook and can be easily copied and pasted.

## ✨ Features

### 📧 Email Types

#### Pre-Shift Email Briefing
- Date and shift selection (Day/Night)
- Customizable greeting comments
- Task management (day and shift-specific)
- Crewing status tracking with ATP (Advanced Training Program) levels
- Road closures (manual and planned)
- Major events (manual and planned)
- Fleet movements
- Duty manager information
- Area-specific content

#### WOM Comms
- Date-based title generation
- Introduction section
- Multiple customizable sections
- Attachments list
- Staff Committee feedback link
- Area-specific footer

#### Important Update
- Date-based title generation
- Introduction section
- Multiple customizable sections
- Attachments list
- Highlighted formatting for urgent communications

### 🛠️ Management Features

#### Planned Road Closures
- Schedule closures with start/finish dates
- Shift-specific timing (Day/Night/All)
- Location and description
- Active, Future, and Past views
- Auto-population in shift briefings

#### Planned Major Events
- Schedule events with start/finish dates
- Shift-specific timing (Day/Night/All)
- Event name, town/city, and description
- Active, Future, and Past views
- Auto-population in shift briefings

#### Settings
- **Callsigns Management**
  - Add/edit callsigns per area
  - Set timing preferences (24HR, Day Only, Night Only)
  - Temporary callsigns (session-only)
- **Tasks by Day & Shift**
  - Configure recurring tasks
  - Separate tasks for Day and Night shifts
- **Duty Managers**
  - Store manager contact information
  - Area-specific manager lists

### 🌍 Multi-Area Support

The application supports multiple operational areas:
- Mt Taranaki
- Mid Central
- Horowhenua
- Hawkes Bay
- Whanganui
- Ruapehu
- Central

All data is stored per area, allowing separate configurations and content for each region.

### 💾 Data Persistence

- **Cloudflare Pages Functions + KV** - Shared data storage across devices
- **LocalStorage Fallback** - Automatic fallback if API is unavailable
- **Real-time Sync** - Changes are saved automatically

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Cloudflare Pages account (for shared data storage)
- Cloudflare KV namespace (for data persistence)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wom-daily-emails.git
   cd wom-daily-emails
   ```

2. **Deploy to Cloudflare Pages**
   - Push your code to GitHub/GitLab
   - Connect your repository to Cloudflare Pages
   - Configure KV binding:
     - Go to Settings → Functions → Bindings
     - Add KV namespace binding:
       - **Type**: `KV namespace`
       - **Variable name**: `DATA_STORE`
       - **KV namespace**: Your KV namespace

3. **Access the application**
   - The application will be available at your Cloudflare Pages URL
   - No additional build steps required - it's a single HTML file!

### Local Development

For local testing without Cloudflare Pages:

1. Open `index.html` in a web browser
2. The application will use localStorage for data persistence
3. Note: Shared data features require Cloudflare Pages deployment

## 📖 Usage Guide

### Creating a Pre-Shift Email Briefing

1. Select your **Area** from the dropdown in the navigation bar
2. Navigate to **Pre-Shift Email Briefing** from the home page
3. Select the **Date** and **Shift** (Day/Night)
4. Fill in the required fields:
   - **Greeting Comment** (optional)
   - **Tasks** - Configure in Settings or add extra tasks
   - **Crewing Status** - Set status for each callsign (Fully Crewed, Single Crewed, etc.)
   - **ATP Levels** - Set Advanced Training Program levels (N/A, CCP, ECP, PARA, EMT, FR)
   - **Road Closures** - Add manually or use planned closures
   - **Major Events** - Add manually or use planned events
   - **Duty Manager** - Select from configured managers
   - **Fleet Movements** - Enter fleet information
   - **Other** - Additional notes
5. Review the **Email Preview**
6. Click **Copy Email** to copy the formatted email to clipboard
7. Paste into Outlook

### Managing Planned Road Closures

1. Navigate to **Planned Road Closures** from the home page
2. Click **Add Road Closure**
3. Fill in:
   - **Start Date** and **Finish Date**
   - **Timings** (All, Day, Night)
   - **Location** and **Description**
4. Click **Mark as Saved** to persist the closure
5. View closures in **Active**, **Future**, or **Past** tabs
6. Closures automatically appear in shift briefings when the date matches

### Managing Planned Major Events

1. Navigate to **Planned Major Events** from the home page
2. Click **Add Major Event**
3. Fill in:
   - **Start Date** and **Finish Date**
   - **Timings** (All, Day, Night)
   - **Event Name**, **Town/City**, and **Blurb**
4. Click **Mark as Saved** to persist the event
5. View events in **Active**, **Future**, or **Past** tabs
6. Events automatically appear in shift briefings when the date matches

### Configuring Settings

1. Navigate to **Settings** from the home page
2. **Callsigns Tab**:
   - Add callsigns for your area
   - Set timing preferences (24HR, Day Only, Night Only)
   - Configure ATP levels
3. **Tasks Tab**:
   - Select day and shift
   - Add recurring tasks
4. **Duty Managers Tab**:
   - Add manager contact information
   - Include name, callsign, phone, and email
5. Click **Save Settings** to persist changes

### Creating WOM Comms

1. Navigate to **WOM Comms** from the home page
2. Select the **Date** (title auto-updates)
3. Enter **Introduction** text
4. Add **Sections** with titles and content
5. Add **Attachments** (one per line)
6. Review preview and **Copy Email**

### Creating Important Updates

1. Navigate to **Important Update** from the home page
2. Select the **Date** (title auto-updates)
3. Enter **Introduction** text
4. Add **Sections** with titles and content
5. Add **Attachments** (one per line)
6. Review preview and **Copy Email**

## 🔧 Technical Details

### Architecture

- **Frontend**: Single-page application (SPA) built with vanilla JavaScript
- **Storage**: Cloudflare KV for shared data, localStorage for fallback
- **API**: Cloudflare Pages Functions (`/api/data`)
- **Styling**: Inline CSS with responsive design

### Data Structure

The application stores data in the following structure:

```javascript
{
  callsignsByArea: {
    "mt-taranaki": [...],
    "mid-central": [...],
    // ... other areas
  },
  dayTasksByArea: {
    "mt-taranaki": {
      "Monday": { "Day": [...], "Night": [...] },
      // ... other days
    },
    // ... other areas
  },
  dutyManagersByArea: {
    "mt-taranaki": [...],
    // ... other areas
  },
  plannedClosuresByArea: {
    "mt-taranaki": [...],
    // ... other areas
  },
  plannedMajorEventsByArea: {
    "mt-taranaki": [...],
    // ... other areas
  },
  crewingStatus: {},
  atpStatus: {}
}
```

### Key Functions

- `render()` - Generates the pre-shift email HTML
- `renderWomEmail()` - Generates WOM Comms email HTML
- `renderImportantEmail()` - Generates Important Update email HTML
- `saveDataToAPI()` - Saves data to Cloudflare KV
- `loadDataFromAPI()` - Loads data from Cloudflare KV
- `getCurrentArea()` - Returns the currently selected area
- `getCurrentCallsigns()` - Returns callsigns for current area
- `getCurrentPlannedClosures()` - Returns planned closures for current area
- `getCurrentPlannedMajorEvents()` - Returns planned events for current area

### Email Formatting

All emails are formatted using HTML tables for maximum compatibility with Outlook:
- Inline CSS styles
- Table-based layout
- Brand colors (St. John green: #007A33, orange: #FFB200)
- Responsive design
- Proper spacing and typography

## 🚢 Deployment

### Cloudflare Pages Setup

1. **Create KV Namespace**
   ```bash
   wrangler kv:namespace create "DATA_STORE"
   ```

2. **Configure Pages Project**
   - Connect GitHub/GitLab repository
   - Set build command: (none required)
   - Set output directory: `/`
   - Add environment variable for KV binding

3. **Deploy**
   - Push to main branch triggers automatic deployment
   - Or use Wrangler CLI:
     ```bash
     wrangler pages deploy .
     ```

### Environment Variables

No environment variables required - KV binding is configured in Cloudflare Dashboard.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Maintain consistent code style
- Test changes across different browsers
- Ensure Outlook compatibility for email formatting
- Update documentation for new features

## 📝 License

This project is proprietary software for St. John New Zealand operations.

## 🆘 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact the development team
- Use the Staff Committee feedback form (available in WOM Comms)

## 🙏 Acknowledgments

- Built for St. John New Zealand Watch Operations Managers
- Designed for seamless integration with Microsoft Outlook
- Optimized for emergency services communication workflows

---

**Version**: 1.0.0  
**Last Updated**: 2025  
**Maintained by**: St. John New Zealand Operations Team
