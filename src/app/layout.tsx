@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #132337;
  font-family: 'Nunito', sans-serif;
  color: #f4f4f4;
}

.chat-container::-webkit-scrollbar {
  width: 6px;
}

.chat-container::-webkit-scrollbar-track {
  background: #1a324d;
}

.chat-container::-webkit-scrollbar-thumb {
  background: #2a4a6d;
  border-radius: 3px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: #3a5a7d;
}
