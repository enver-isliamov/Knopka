document.addEventListener('DOMContentLoaded', () => {
    const talkButton = document.getElementById('talkButton');
    const statusDiv = document.getElementById('status');
    const diaryDiv = document.getElementById('diary');

    // Проверяем, поддерживает ли браузер Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        statusDiv.textContent = 'Ваш браузер не поддерживает распознавание речи. Попробуйте Google Chrome.';
        talkButton.disabled = true;
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU'; // Язык распознавания
    recognition.interimResults = false; // Показывать только финальный результат

    // Загружаем дневник из локального хранилища
    loadDiary();

    talkButton.addEventListener('mousedown', () => {
        statusDiv.textContent = 'Слушаю...';
        recognition.start();
    });

    talkButton.addEventListener('mouseup', () => {
        statusDiv.textContent = 'Обработка...';
        recognition.stop();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addDiaryEntry('Вы', transcript);
        processUserInput(transcript);
    };

    recognition.onerror = (event) => {
        statusDiv.textContent = `Ошибка распознавания: ${event.error}`;
    };

    recognition.onend = () => {
        statusDiv.textContent = 'Ожидание...';
    };

    function processUserInput(text) {
        // --- Здесь будет логика настоящего ИИ на следующих этапах ---
        // Пока что простые ответы-заглушки
        let response = 'Интересная мысль. Расскажи подробнее.';
        
        if (text.toLowerCase().includes('привет')) {
            response = 'Привет! Как прошел твой день?';
        } else if (text.toLowerCase().includes('как дела')) {
            response = 'Я в порядке, я программа. А как твои дела?';
        } else if (text.toLowerCase().includes('спасибо')) {
            response = 'Всегда пожалуйста!';
        }

        speak(response);
        addDiaryEntry('Ментор', response);
    }

    function speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';
        window.speechSynthesis.speak(utterance);
    }

    function addDiaryEntry(author, text) {
        const entry = document.createElement('div');
        entry.classList.add('diary-entry');

        const authorSpan = document.createElement('span');
        authorSpan.classList.add(author === 'Вы' ? 'user-message' : 'ai-message');
        authorSpan.textContent = `${author}: `;
        
        entry.appendChild(authorSpan);
        entry.append(text);

        diaryDiv.appendChild(entry);
        diaryDiv.scrollTop = diaryDiv.scrollHeight; // Автопрокрутка вниз

        saveDiary();
    }
    
    function saveDiary() {
        localStorage.setItem('aiMentorDiary', diaryDiv.innerHTML);
    }

    function loadDiary() {
        const savedDiary = localStorage.getItem('aiMentorDiary');
        if (savedDiary) {
            diaryDiv.innerHTML = savedDiary;
            diaryDiv.scrollTop = diaryDiv.scrollHeight;
        }
    }
});