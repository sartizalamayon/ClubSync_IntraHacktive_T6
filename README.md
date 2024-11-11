# ClubSync - Streamlining Club Management at BRAC University 🎓

## 🌟 Overview

ClubSync is a comprehensive digital solution designed to revolutionize how BRAC University's Office of Co-curricular Activities (OCA) and club panel members manage their operations. Born from a thorough analysis of pain points in the current system, ClubSync addresses critical challenges in event management, communication, room booking, and budget tracking.

### 🎯 Key Problems Solved

| Problem | Statistics | Solution |
|---------|------------|----------|
| Event Management Delays | 69.6% took 3-7 days | Real-time digital approval system |
| Communication Inefficiencies | 100% in-person meetings | Centralized communication platform |
| Room Booking Struggles | 56.5% availability issues | Automated booking system |
| Budget Approval Transparency | 78.3% lack of transparency | Real-time budget tracking |
| Data-Driven Insights | 87% needed reporting | Comprehensive analytics dashboard |


## ✨ Features

### 🏢 OCA Dashboard
- **Real-time Analytics Dashboard**
  - Event distribution visualization
  - Budget allocation tracking
  - Active clubs monitoring
  - Guest passes management
- **Centralized Approval System**
  - Quick event review and response
  - Feedback mechanism for rejections
- **Announcement Management**
  - Create and manage announcements
  - Delete any announcement

### 🎨 Club Dashboard
- **Comprehensive Event Planning**
  - Room availability checking
  - Budget request submission
  - Guest access management
  - Advisor notification system
- **Club Statistics**
  - Event success metrics
  - Budget utilization
  - Member engagement tracking
- **Profile Management**
  - Update club information
  - Manage executive committee
  - Track notable alumni

### 💬 Communication Hub
- **Direct Messaging System**
  - OCA-Club direct communication
  - Real-time messaging
  - File sharing capabilities
- **Announcement Board**
  - Important updates
  - Event notifications
  - Policy changes

## 🛡️ Security & Scalability

### Security Implementation
- **Authentication & Authorization**
  - JWT-based secure authentication
  - Role-based access control
  - Session management
  - Password stored in firebase
  
- **Data Protection**
  - End-to-end data encryption
  - Secure API endpoints

### Scalability Features
- **Architecture**
  - Microservices-ready structure
  
- **Performance**
  - Optimized database queries
  - Lazy loading implementation
  - Resource optimization

## 🛠️ Technical Stack

### Frontend
```javascript
{
  "core": ["React.js", "Tailwind CSS", "DaisyUI"],
  "state-management": ["Tanstack Query", "Axios"],
  "ui-enhancement": ["framer-motion"],
  "visualization": ["Recharts"]
}
```


### Backend
```javascript
{
  "server": ["Node.js", "Express"],
  "security": ["JWT"],
  "communications": ["NodeMailer"],
  "database": ["MongoDB"]
}
```

[→ Backend Repository](https://github.com/sartizalamayon/ClubSyncBackend_IntraHacktive_T6)

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone <repository_url>

2. Install dependencies
   ```bash
   cd clubsync
   npm install

3. Set up environment variables
   ```bash
   cp .env.example .env

4. Start the development server:
  ```bash
   npm run dev
  ```


## 💡 Possible Future Enhancements
- Event feedback reporting
- Integration with university's academic calendar
- Advanced Analytics
- Load balancing for scalability
 
## 👥 Team
- Sartiz Alam Ayon - Full Stack Developer
- Riyajul Islam - Frontend Developer
- Niaz Morshed - Web Design and Research

<div align="center">
Built with ❤️ by Team IntraHacktive for BRAC University Hackathon 2024
</div>
