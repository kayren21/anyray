import React from 'react';
import { createRoot } from 'react-dom/client'; // новый импорт
import './options.css'


const test = <img src='icon.png' alt='AnyRay' />;

const div = document.createElement('div'); // создаём div
document.body.appendChild(div); // вставляем его в body

const root = createRoot(div); // создаём react-root
root.render(test); // рендерим в него
