# Milo Ertugrul - College & Soccer Recruiting Hub

**Built by Milo Ertugrul** - A personalized, comprehensive platform to manage college applications and soccer recruiting in one powerful system.

This isn't just an app - it's **Milo's command center** for achieving his college and athletic goals. Built with React, TypeScript, and Vite for a fast, modern experience.

## 🎓 Features

### 🆕 Soccer / Football Recruiting Module

A comprehensive recruiting management system fully integrated with the college application tracker:

**Player Profile Management**
- Create and maintain your player profile with position, height, dominant foot
- Track languages spoken and club history
- Personal bio and playing style summary

**Highlight Package Management**
- Store multiple highlight videos (YouTube, Vimeo, full match links)
- Tag videos by season, tournament, or other categories
- Track video notes and descriptions
- Quick access links for sharing with coaches

**Soccer Program Research**
- Add soccer programs for each university
- Track division level (D1, D2, D3, Club)
- Store conference, team URLs, roster links
- Record international player ratios
- Document playing style tags (possession, high press, etc.)
- Track recent team records

**Coach Database**
- Detailed coach profiles with contact information
- Store coaching history and playing background
- Track recruiting focus and preferred formations
- Save alma mater and personal connection points
- Link to bios and LinkedIn profiles
- Personal research notes for each coach

**Smart Email Generator**
- AI-powered email drafting using stored coach and program data
- Automatically incorporates relevant talking points
- References coach's background and recruiting focus
- Includes player profile highlights
- One-click copy to clipboard
- Logs sent emails automatically

**Coach Contact Tracking**
- Track all communications with coaches
- Record contact channel (email, phone, meeting, ID camp, campus visit)
- Monitor response status (sent, opened, replied, no response)
- Set follow-up reminders
- Full contact history per coach

**Soccer Analytics**
- Program breakdown by division
- Coach contact statistics
- Response rate tracking
- Reply metrics
- Integrated with main analytics dashboard

### 1. Dashboard Overview
- **University Cards**: Visual cards displaying all universities with key information
- **Smart Filters**: Filter by region, school size, and application status
- **Advanced Sorting**: Sort by name, deadline, status, or region
- **Search Functionality**: Quickly find universities by name or location
- **Status Tracking**: Monitor application progress (Not Started, In Progress, Submitted, Accepted, Rejected, Waitlisted)
- **Urgent Alerts**: Automatic alerts for approaching deadlines and overdue applications

### 2. University Detail Pages
- **Comprehensive Information**: Track location, region, school size, and deadlines
- **Custom Notes**: Add personal notes and impressions about each university
- **Interactive Checklists**: Create and manage application tasks with completion tracking
- **Essay Management**: 
  - Store multiple essays per university
  - Track essay status (Not Started, Draft, In Review, Final)
  - Built-in word counter
  - Save prompts and responses
- **Interview Tracking**:
  - Schedule and track interviews
  - Record type (virtual, in-person, phone)
  - Store interviewer information and notes
  - Mark interviews as completed

### 3. Communication Hub
- **Message Templates**:
  - Pre-written email templates for common scenarios
  - Categories: Inquiry, Recommendation Request, Follow-up, Thank You
  - One-click copy to clipboard
  - Customizable templates
- **Communication History**:
  - Log all communications with universities
  - Track emails, phone calls, and mail
  - Follow-up reminders
  - Searchable history

### 4. Reminders & Notifications
- **Smart Reminders**: Create reminders for deadlines, interviews, follow-ups, and tasks
- **Priority Levels**: High, Medium, and Low priority classification
- **Visual Alerts**: Color-coded urgent and overdue reminders
- **University Linking**: Associate reminders with specific universities
- **Statistics Dashboard**: Overview of active, overdue, and completed reminders
- **Filtering & Sorting**: View all, active, or completed reminders

### 5. Progress Analytics
- **Visual Statistics**:
  - Total universities tracked
  - Completion rate percentage
  - Acceptance count
  - Overdue applications
- **Status Distribution**: Visual breakdown of application statuses
- **Geographic Analysis**: Distribution by region
- **School Size Analysis**: Breakdown by school size
- **Task Completion Tracker**: Overall progress across all applications
- **Upcoming Deadlines**: Next 30 days deadline overview
- **Motivational Messages**: Encouraging feedback based on progress

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the repository:
```bash
cd "Milo college application interface"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

5. **For detailed setup instructions**, see `docs/QUICK_START.md`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 💾 Data Storage

All data is stored locally in your browser using `localStorage`. This means:
- ✅ No internet connection required
- ✅ Complete privacy - data never leaves your device
- ✅ Fast performance
- ⚠️ Data is browser-specific (clearing browser data will reset the app)
- ⚠️ Consider backing up important information externally

## 🎨 Technology Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Styling**: Custom CSS with CSS Variables

## 📱 Features Breakdown

### Dashboard
- Add unlimited universities
- Real-time search and filtering
- Quick statistics overview
- Deadline alerts and warnings
- Responsive grid layout

### University Details
- Full information management
- Status updates
- Custom notes with auto-save
- Checklist with progress tracking
- Essay drafts with word counting
- Interview scheduling and notes

### Communications
- Template library for common emails
- Communication logging by type
- Follow-up tracking
- Quick copy-to-clipboard
- Searchable history

### Reminders
- Multiple reminder types
- Priority-based organization
- Due date tracking
- Completion toggling
- Statistics overview

### Analytics
- Real-time statistics
- Visual progress bars
- Distribution charts
- Upcoming deadlines
- Motivational insights

## 🔧 Customization

### Adding Sample Data
The app starts empty. To add your first university:
1. Click "Add University" on the dashboard
2. Fill in the required information
3. Start tracking your application!

### Color Scheme
The app uses CSS variables for easy customization. Edit `src/index.css` to change colors:
- `--primary`: Main brand color
- `--success`: Success/accepted color
- `--warning`: Warning/urgent color
- `--danger`: Error/overdue color

## 📝 Tips for Best Use

### General Application Tracking
1. **Start Early**: Add all universities you're considering right away
2. **Set Reminders**: Create reminders for every important deadline
3. **Use Checklists**: Break down each application into manageable tasks
4. **Track Communications**: Log every interaction with admissions offices
5. **Regular Updates**: Keep your status and notes current
6. **Check Analytics**: Review your progress regularly for motivation

### Soccer Recruiting Best Practices
1. **Build Your Profile First**: Start by creating your player profile and uploading highlight videos
2. **Research Programs Thoroughly**: For each university, add the soccer program and research their playing style, conference, and recent performance
3. **Know Your Coaches**: Add detailed coach information including their background, recruiting focus, and coaching philosophy
4. **Personalize Outreach**: Use the email generator's talking points to craft personalized messages
5. **Track Everything**: Log every interaction with coaches to maintain a professional relationship
6. **Follow Up Strategically**: Set follow-up reminders and track response rates
7. **Link Programs to Applications**: Use the Soccer tab in each university's detail page to connect recruiting with academics

## 🤝 Support

For any questions or issues, please refer to the documentation within the app or contact support.

## 📄 License

This is a custom application built specifically for Milo Ertugrul's college application process.

---

**Good luck with your applications, Milo! 🎓**

You've got this! Remember to stay organized, meet your deadlines, and don't hesitate to reach out for help when needed.

