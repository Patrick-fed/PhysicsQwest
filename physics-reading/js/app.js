(function() {
  'use strict';

  const STORAGE_KEYS = {
    USER_LEVEL: 'physicsquest_user_level',
    RECOMMENDATIONS: 'physicsquest_recommendations',
    PROGRESS: 'physicsquest_progress_'
  };

  const QUIZ_DATA = {
    'ex-001': {
      lesson: 'Lição 1: Átomos em Movimento',
      questions: [
        {
          question: 'Do que são feitas todas as coisas?',
          options: ['Água', 'Átomos', 'Energia', 'Luz'],
          correct: 1
        },
        {
          question: 'Quando os átomos estão muito próximos, eles se:',
          options: ['Atraem', 'Repelem', 'Paralisam', 'Desaparecem'],
          correct: 1
        },
        {
          question: 'Como os átomos se movem?',
          options: ['Parados', 'Jiggling (vibrando)', 'Em linha reta', 'Em círculo'],
          correct: 1
        },
        {
          question: 'Qual movimento os átomos realizam continuamente?',
          options: ['Parecem estar parados', 'Jiggling (vibrando)', 'Movimento lento', 'Nenhum movimento'],
          correct: 1
        },
        {
          question: 'Quando os átomos estão a uma pequena distância, eles se:',
          options: ['Repelem', 'Atraem', 'Ficam parados', 'Se multiplicam'],
          correct: 1
        }
      ]
    },
    'ex-002': {
      lesson: 'Lição 2: Física Básica',
      questions: [
        {
          question: 'A física é a ciência mais:',
          options: ['Complexa', 'Fundamental', 'Fácil', 'Antiga'],
          correct: 1
        },
        {
          question: 'A física é equivalente à antiga:',
          options: ['Química', 'Filosofia Natural', 'Biologia', 'Matemática'],
          correct: 1
        },
        {
          question: 'Por que estudantes estudam física?',
          options: ['É obrigatória', 'Tem papel fundamental', 'É fácil', 'É curta'],
          correct: 1
        },
        {
          question: 'A física estuda:',
          options: ['Apenas átomos', 'O mundo funciona', 'Apenas química', 'Apenas matemática'],
          correct: 1
        },
        {
          question: 'A física teve efeito profundo em:',
          options: ['Todas as ciências', 'Apenas química', 'Apenas biologia', 'Nenhuma ciência'],
          correct: 0
        }
      ]
    }
  };

  const EMBEDDED_DATA = {
    sources: [
      { id: "feynman-vol1", name: "The Feynman Lectures on Physics", author: "Richard P. Feynman", year: 1964, volumes: 3 }
    ],
    excerpts: [
      {
        id: "ex-001",
        title: "Atoms in Motion",
        source: "feynman-vol1",
        chapter: "Chapter 1: Atoms in Motion",
        level: "beginner",
        content: "All things are made of atoms — little particles that move around in perpetual motion, attracting each other when they are a little distance apart, but repelling each other when they are pressed together. In that one sentence, there is an enormous amount of information about the world, but it takes a great many years to learn that all this is contained in the statement.\n\nIf, in some cataclysm, all of scientific knowledge were to be destroyed, and only one sentence passed on to the next generation of creatures, what statement would contain the most information in the fewest words? I believe it is the atomic hypothesis (or call it the atomic fact, if you wish) that all things are made of atoms — little particles that move around in perpetual motion, attracting each other when they are a little distance apart, but repelling each other when they are pressed together.\n\nThe atoms come many times closer together than the 1/1000th part of the diameter of the thing. So we have a great paste of these atomic balls. The atoms are always 'jiggling' and trying to get to us, so we feel it as roughness; it is not smooth as far as the atoms are concerned."
      },
      {
        id: "ex-002",
        title: "Basic Physics",
        source: "feynman-vol1",
        chapter: "Chapter 2: Basic Physics",
        level: "beginner",
        content: "Physics is the most fundamental and all-inclusive of the sciences, and has had a profound effect on all scientific development. In fact, physics is the present day equivalent of what used to be called natural philosophy, from which most of our modern sciences arose.\n\nStudents of many fields find themselves studying physics because of the basic role it plays in all phenomena. There are fields like engineering, where a knowledge of physics before will enable an ability to see new things.\n\nPerhaps the most exciting, the most pitiably ridiculous, and the most profound discovery of all science is the way the world works - and we call that knowledge 'physics'. A poet once said, 'The whole world is in a glass of wine.' He probably never tried to work it out, but the ingredients are there, just the same."
      },
      {
        id: "ex-003",
        title: "The Relation of Physics to Other Sciences",
        source: "feynman-vol1",
        chapter: "Chapter 3: The Relation of Physics to Other Sciences",
        level: "intermediate",
        content: "Physics is the foundation of every other science and may be applied to many different problems in other fields. But we must not suppose that physics is the only field, or that every problem can be approached through a study of physics.\n\nChemistry deals with the combinations of atoms, and so does most of the material world. Chemical analysis tells us which atoms are present in the composition of the earth, how they are arranged.\n\nBiology is more complicated than chemistry. The living thing is made of atoms, which are complicated and extremely complicated organizations. The processes in living creatures are performed by an enormously complicated ensemble of atoms."
      },
      {
        id: "ex-004",
        title: "Conservation of Energy",
        source: "feynman-vol1",
        chapter: "Chapter 4: Conservation of Energy",
        level: "intermediate",
        content: "There is a certain quantity which we call energy. It is not a created thing; it is a number. When something happens, the number changes, but if we keep track of all the forms, the number will stay the same.\n\nEnergy has many different forms, and there is a formula for each one. There is gravitational potential energy, kinetic energy, thermal energy, elastic energy, electrical energy, chemical energy, radiant energy, nuclear energy, mass energy.\n\nLet us consider a simple example: a ball is dropped from a height. As it falls, its potential energy is converted to kinetic energy. When it hits the ground, it stops, and all the energy is transferred to the ground and the ball, making them slightly hotter."
      }
    ]
  };

  let appData = {
    excerpts: [],
    sources: [],
    currentExcerpt: null,
    userLevel: 'beginner',
    currentQuestionIndex: 0,
    quizScore: 0,
    quizStarted: false
  };

  function loadExcerpts() {
    appData.excerpts = EMBEDDED_DATA.excerpts;
    appData.sources = EMBEDDED_DATA.sources;
  }

  function getRecommendedExcerpt() {
    const level = appData.userLevel;
    const eligible = appData.excerpts.filter(e => e.level === level);
    if (eligible.length === 0) return appData.excerpts[0];
    const randomIndex = Math.floor(Math.random() * eligible.length);
    return eligible[randomIndex];
  }

  function saveRecommendation(excerptId) {
    const recommendations = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS) || '[]');
    recommendations.push({
      excerptId,
      timestamp: new Date().toISOString(),
      viewed: false
    });
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recommendations));
  }

  function saveProgress(excerptId, scrollPosition, completed = false) {
    const key = STORAGE_KEYS.PROGRESS + excerptId;
    const progress = {
      scrollPosition,
      completed,
      lastReadAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(progress));
  }

  function getProgress(excerptId) {
    const key = STORAGE_KEYS.PROGRESS + excerptId;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  function getAllProgress() {
    const progress = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(STORAGE_KEYS.PROGRESS)) {
        const excerptId = key.replace(STORAGE_KEYS.PROGRESS, '');
        const data = JSON.parse(localStorage.getItem(key));
        progress.push({ excerptId, ...data });
      }
    }
    return progress;
  }

  function renderExcerpt(excerpt) {
    const titleEl = document.getElementById('excerpt-title');
    const sourceEl = document.getElementById('excerpt-source');
    const chapterEl = document.getElementById('excerpt-chapter');
    const contentEl = document.getElementById('excerpt-content');

    titleEl.textContent = excerpt.title;
    sourceEl.textContent = 'Feynman Lectures';
    chapterEl.textContent = excerpt.chapter;
    contentEl.innerHTML = excerpt.content.replace(/\n\n/g, '<br><br>') + '<div style="margin-top: 2rem; text-align: center;"><button id="do-quiz-btn" class="quiz-btn" style="background: #e94560;">Fazer Quiz desta Lição</button></div>';

    const savedProgress = getProgress(excerpt.id);
    if (savedProgress) {
      contentEl.scrollTop = savedProgress.scrollPosition || 0;
    }

    const quizBtn = document.getElementById('do-quiz-btn');
    if (quizBtn && QUIZ_DATA[excerpt.id]) {
      quizBtn.addEventListener('click', () => startQuiz(excerpt.id));
      quizBtn.style.display = 'inline-block';
    } else if (quizBtn) {
      quizBtn.style.display = 'none';
    }
  }

  function renderExcerptList() {
    const listEl = document.getElementById('excerpt-list');
    const level = appData.userLevel;
    const filtered = appData.excerpts.filter(e => e.level === level);
    const excerpts = filtered.length > 0 ? filtered : appData.excerpts;

    listEl.innerHTML = excerpts.map(ex => `
      <div class="excerpt-card" data-id="${ex.id}">
        <h3>${ex.title}</h3>
        <span>${ex.chapter}</span>
      </div>
    `).join('');

    listEl.querySelectorAll('.excerpt-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const excerpt = appData.excerpts.find(e => e.id === id);
        if (excerpt) {
          appData.currentExcerpt = excerpt;
          renderExcerpt(excerpt);
          saveRecommendation(excerpt.id);
        }
      });
    });
  }

  function renderProgressList() {
    const listEl = document.getElementById('progress-list');
    const progress = getAllProgress();

    if (progress.length === 0) {
      listEl.innerHTML = '<p>No reading progress yet. Start reading!</p>';
      return;
    }

    listEl.innerHTML = progress.map(p => {
      const excerpt = appData.excerpts.find(e => e.id === p.excerptId);
      if (!excerpt) return '';
      const statusClass = p.completed ? 'completed' : 'in-progress';
      const statusText = p.completed ? 'Completed' : 'In Progress';
      return `
        <div class="progress-item">
          <h3>${excerpt.title}</h3>
          <p class="${statusClass}">${statusText}</p>
        </div>
      `;
    }).join('');
  }

  function showReadingSection() {
    document.getElementById('quiz-section').classList.remove('active');
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('progress-section').classList.remove('active');
    document.getElementById('success-section').classList.remove('active');
    document.getElementById('reading-section').classList.add('active');

    document.getElementById('nav-read').classList.add('active');
    document.getElementById('nav-progress').classList.remove('active');
    document.getElementById('nav-quiz').classList.remove('active');
  }

  function showProgressSection() {
    document.getElementById('quiz-section').classList.remove('active');
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('reading-section').classList.remove('active');
    document.getElementById('success-section').classList.remove('active');
    document.getElementById('progress-section').classList.add('active');

    document.getElementById('nav-read').classList.remove('active');
    document.getElementById('nav-progress').classList.add('active');
    document.getElementById('nav-quiz').classList.remove('active');
    renderProgressList();
  }

  function showQuizSection() {
    document.getElementById('reading-section').classList.remove('active');
    document.getElementById('progress-section').classList.remove('active');
    document.getElementById('success-section').classList.remove('active');
    document.getElementById('quiz-section').classList.remove('hidden');
    document.getElementById('quiz-section').classList.add('active');

    document.getElementById('nav-read').classList.remove('active');
    document.getElementById('nav-progress').classList.remove('active');
    document.getElementById('nav-quiz').classList.add('active');
  }

  function setupNavigation() {
    document.getElementById('nav-read').addEventListener('click', showReadingSection);
    document.getElementById('nav-progress').addEventListener('click', showProgressSection);
    document.getElementById('nav-quiz').addEventListener('click', () => {
      showQuizSection();
      if (appData.quizStarted && appData.currentExcerpt && QUIZ_DATA[appData.currentExcerpt.id]) {
        renderQuizQuestion();
      } else {
        renderStartScreen();
      }
    });
  }

  function setupLevelSelector() {
    const levelSelect = document.getElementById('level');
    const savedLevel = localStorage.getItem(STORAGE_KEYS.USER_LEVEL);

    if (savedLevel) {
      levelSelect.value = savedLevel;
      appData.userLevel = savedLevel;
    }

    levelSelect.addEventListener('change', (e) => {
      appData.userLevel = e.target.value;
      localStorage.setItem(STORAGE_KEYS.USER_LEVEL, e.target.value);
      renderExcerptList();
    });
  }

  function setupScrollTracking() {
    const contentEl = document.getElementById('excerpt-content');

    contentEl.addEventListener('scroll', () => {
      if (!appData.currentExcerpt) return;

      const scrollPosition = contentEl.scrollTop;
      const isAtBottom = contentEl.scrollHeight - contentEl.scrollTop <= contentEl.clientHeight + 50;

      saveProgress(appData.currentExcerpt.id, scrollPosition, isAtBottom);
    });
  }

  function startQuiz(excerptId) {
    const excerpt = appData.excerpts.find(e => e.id === excerptId);
    if (!excerpt || !QUIZ_DATA[excerptId]) return;

    appData.currentExcerpt = excerpt;
    appData.currentQuestionIndex = 0;
    appData.quizScore = 0;
    appData.quizStarted = true;
    showQuizSection();
    renderQuizQuestion();
  }

  function renderStartScreen() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
      <div class="quiz-start-screen">
        <h2>Quiz de Física</h2>
        <p>Selecione uma lição na aba Leitura e clique em "Fazer Quiz".</p>
        <p>Você precisa de 80% (4 de 5) para passar para o próximo texto.</p>
      </div>
    `;
  }

  function renderQuizQuestion() {
    const container = document.getElementById('quiz-container');
    const quiz = QUIZ_DATA[appData.currentExcerpt.id];
    const question = quiz.questions[appData.currentQuestionIndex];

    const progress = `[${quiz.lesson}] Questão ${appData.currentQuestionIndex + 1}/${quiz.questions.length}`;

    container.innerHTML = `
      <div class="quiz-header">
        <span class="quiz-progress">${progress}</span>
      </div>
      <div class="quiz-question">
        <p>${question.question}</p>
      </div>
      <div class="quiz-options">
        ${question.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}">${opt}</button>
        `).join('')}
      </div>
      <div id="quiz-feedback" class="quiz-feedback hidden"></div>
    `;

    container.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', handleAnswer);
    });
  }

  function handleAnswer(e) {
    const selectedIndex = parseInt(e.target.dataset.index);
    const quiz = QUIZ_DATA[appData.currentExcerpt.id];
    const question = quiz.questions[appData.currentQuestionIndex];
    const isCorrect = selectedIndex === question.correct;

    if (isCorrect) appData.quizScore++;

    const buttons = document.querySelectorAll('.quiz-option');
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === question.correct) {
        btn.classList.add('correct');
      } else if (i === selectedIndex && !isCorrect) {
        btn.classList.add('incorrect');
      }
    });

    const feedback = document.getElementById('quiz-feedback');
    feedback.classList.remove('hidden');
    feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.innerHTML = isCorrect 
      ? '<span class="feedback-icon">✓</span> Correto!' 
      : '<span class="feedback-icon">✗</span> Incorreto. A resposta correta era: ' + question.options[question.correct];

    const nextBtn = document.createElement('button');
    nextBtn.className = 'quiz-btn next-btn';
    nextBtn.textContent = appData.currentQuestionIndex < quiz.questions.length - 1 ? 'Próxima Questão' : 'Ver Resultado';
    feedback.appendChild(nextBtn);

    nextBtn.addEventListener('click', () => {
      appData.currentQuestionIndex++;
      if (appData.currentQuestionIndex >= quiz.questions.length) {
        checkQuizPass();
      } else {
        renderQuizQuestion();
      }
    });
  }

  function checkQuizPass() {
    const quiz = QUIZ_DATA[appData.currentExcerpt.id];
    const passed = appData.quizScore >= 4;

    const container = document.getElementById('quiz-container');
    container.innerHTML = `
      <div class="quiz-result ${passed ? 'passed' : 'failed'}">
        <div class="result-icon">${passed ? '✓' : '✗'}</div>
        <h3>${quiz.lesson}</h3>
        <p>Você acertou ${appData.quizScore}/${quiz.questions.length} questões!</p>
        ${passed 
          ? '<p class="result-message">Parabéns! Você passou para o próximo texto!</p><button id="next-text-btn" class="quiz-btn">Próximo Texto</button>'
          : '<p class="result-message">Você precisa de 4/5 para passar. Tente novamente!</p><button id="retry-quiz-btn" class="quiz-btn">Tentar Novamente</button>'
        }
      </div>
    `;

    if (passed) {
      const currentIndex = appData.excerpts.findIndex(e => e.id === appData.currentExcerpt.id);
      const eligibleExcerpts = appData.excerpts.filter(e => e.level === appData.userLevel);
      const nextIndex = eligibleExcerpts.findIndex(e => e.id === appData.currentExcerpt.id) + 1;
      const nextExcerpt = eligibleExcerpts[nextIndex];
      
      document.getElementById('next-text-btn').addEventListener('click', () => {
        if (nextExcerpt) {
          appData.currentExcerpt = nextExcerpt;
          renderExcerpt(nextExcerpt);
          showReadingSection();
        } else {
          showSuccessSection();
        }
      });
    } else {
      document.getElementById('retry-quiz-btn').addEventListener('click', () => {
        startQuiz(appData.currentExcerpt.id);
      });
    }
  }

  function showSuccessSection() {
    document.getElementById('quiz-section').classList.remove('active');
    document.getElementById('reading-section').classList.remove('active');
    document.getElementById('success-section').classList.add('active');
    document.getElementById('nav-quiz').classList.remove('active');
  }

  function init() {
    loadExcerpts();

    const savedLevel = localStorage.getItem(STORAGE_KEYS.USER_LEVEL);
    if (savedLevel) appData.userLevel = savedLevel;

    renderExcerptList();
    setupNavigation();
    setupLevelSelector();
    setupScrollTracking();

    const firstExcerpt = getRecommendedExcerpt();
    appData.currentExcerpt = firstExcerpt;
    renderExcerpt(firstExcerpt);
  }

  document.addEventListener('DOMContentLoaded', init);
})();