# To-Do List Application

A modern, feature-rich to-do list application with local storage functionality.

## Features

✨ **Core Features:**
- ➕ Add new tasks with ease
- ✅ Mark tasks as complete/incomplete
- 🗑️ Delete individual tasks
- 💾 Persistent storage using browser's Local Storage
- 🎯 Filter tasks (All, Active, Completed)
- 📊 Real-time statistics (Total, Active, Completed)
- 🧹 Clear completed tasks or all tasks at once
- 📱 Fully responsive design
- 🌈 Beautiful gradient UI with smooth animations

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required

### Installation

1. Clone the repository:
```bash
git clone https://github.com/clydemerline-blip/osiris-five-cycle.git
cd osiris-five-cycle
```

2. Open `index.html` in your web browser:
   - Simply double-click `index.html`, or
   - Serve using a local server (recommended for better experience)

### Using a Local Server

**Python 3:**
```bash
python -m http.server 8000
```

**Node.js (with http-server):**
```bash
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## Usage

1. **Add a Task**: Type in the input field and click "Add Task" or press Enter
2. **Complete a Task**: Check the checkbox next to a task
3. **Delete a Task**: Click the "Delete" button
4. **Filter Tasks**: Use the filter buttons (All, Active, Completed)
5. **Clear Completed**: Remove all completed tasks with one click
6. **Clear All**: Delete all tasks (requires confirmation)

## Local Storage

Your tasks are automatically saved to your browser's Local Storage. This means:
- ✅ Tasks persist when you close and reopen the browser
- ✅ No server or internet connection required
- ✅ Data is stored locally on your device
- ⚠️ Clearing browser data will delete your tasks
- ⚠️ Tasks are device and browser-specific

## Technical Details

### Files

- **index.html** - Application structure and layout
- **styles.css** - Styling and responsive design
- **script.js** - Application logic and Local Storage management

### Local Storage Key

The application uses the key `todoAppData` to store tasks in Local Storage.

### Data Structure

Each task object contains:
```json
{
  "id": 1234567890,
  "text": "Task description",
  "completed": false,
  "createdAt": "2026-05-25T12:00:00.000Z"
}
```

## Browser Compatibility

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Features Roadmap

- 📅 Due dates for tasks
- 🏷️ Categories/Tags
- 🔍 Search functionality
- 🎨 Theme customization
- 📤 Export/Import tasks
- 🔔 Notifications for upcoming tasks
- ☁️ Cloud synchronization

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Support

For issues or questions, please open an issue on GitHub.

---

**Happy organizing! 🚀**