# React + Vite

UFO Sightings React App
Overview
This React app visualizes UFO sightings data by week, displaying charts and allowing navigation through weeks. It fetches data from a JSON API, processes it by week, and renders interactive charts using D3.

Features
Fetches and processes UFO sightings data grouped by week

Interactive weekly charts showing sightings counts

Forward and backward navigation to browse weeks

Responsive design using Tailwind CSS

Modular components for easy maintenance

Getting Started
Prerequisites
Node.js (v14 or higher recommended)

npm or yarn package manager

Installation
Clone the repo:

bash
Copy
Edit
git clone https://github.com/andyjalex/ufo-sightings.git
Install dependencies:

bash
Copy
Edit
npm install
# or
yarn install
Running the App
bash
Copy
Edit
npm run dev
# or
yarn start
Then open http://localhost:5174 in your browser.

Project Structure
/src - Main source folder

/components - React components like ChartWrapper, ControlPanel, DateDisplay

/api - API utilities (fetching data)

/utils - Helper functions for date calculations

/public - Static assets

App.jsx - Main app component

Testing
Uses Vitest and React Testing Library.

Run tests with:

bash
Copy
Edit
npm test
# or
yarn test
Technologies Used
React

D3.js for data visualization

Tailwind CSS for styling

Vitest + React Testing Library for tests

JSON server for mock API
