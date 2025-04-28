# ☀️ AnyRay — Personalized Language Learning Platform

**AnyRay** is a web-based language learning platform designed to help users learn new languages more effectively by combining immersive content with vocabulary management tools.

> Developed as a diploma project for WIUT using NestJS for the backend and Next.js (React) for the frontend.

---

##  Key Features

- 📝 Save words and phrases directly from web content via browser extension 
- 🌐 Built-in material database for learners planning to take a language profeciency test
- 💬 Vocabulary management system with custom translations, definitions and examples 
- 📊 Support for personalized progress tracking 
- 🧠Quiz generation
- 🧩Smart space repitition algorithm 

---

## ⚙️ Tech Stack

| Layer         | Technology                  |
|---------------|-----------------------------|
| Frontend      | Next.js (React), TypeScript |
| Backend       | NestJS, TypeORM, PostgreSQL |
| API Handling  | Axios                       |
| Styling       | CSS                         |
| Deployment    | TBD                         |

---

## Third-party APIs Used

📘 MyMemory Translation API
Purpose: Translate single words or phrases  
https://api.mymemory.translated.net/get?q=love%20me%20like%20you%20do&langpair=en|ru

📘 Dictionary API
Purpose: Fetch definitions, phonetics, part of speech, audio, and examples for single words  
https://api.dictionaryapi.dev/api/v2/entries/en/monkey

# AnyRay Extension 🚀

**AnyRay Extension** is a simple and lightweight Chrome extension that allows you to save highlighted words and phrases directly into your personal vocabulary hub on the AnyRay platform.

## ✨ Features

- 📚 Save any word or phrase from any website with just one click.
- ⚡ Instantly send selected text to the AnyRay server.
- 🔔 Receive notifications when words are successfully saved.
- 🎯 Manage your active Hub ID through the extension's Options page.
- 🧩 Clean and minimalist interface built with React + TypeScript.

## 🛠️ Tech Stack

- React
- TypeScript
- Webpack
- Chrome Extension APIs (`contextMenus`, `storage.local`, `notifications`)
- REST API integration

## 🚀 How to Use

1. Install the extension in Chrome Developer Mode.
2. Open any website and highlight a word or phrase.
3. Right-click → select **Save to AnyRay**.
4. The selected word will be sent and saved to your hub on the AnyRay platform.

## ⚙️ Setting the Hub ID

1. Open the extension's Options page.
2. Enter your active Hub ID and save it.
3. All future saved words will be automatically associated with the selected Hub.