/* ========================
   CALA AI — KEYWORD BASED (Pure JS)
   Bilingual: Indonesian + English
   Includes feature recommendations
======================== */

let calaHistory = [];

function toggleCala() {
  const floating = document.getElementById('calaFloating');
  const toggle = document.getElementById('calaToggle');
  if (!floating) return;
  floating.classList.toggle('minimized');
  if (toggle) {
    toggle.textContent = floating.classList.contains('minimized') ? '▲' : '▼';
  }
}

function handleCalaEnter(event) {
  if (event.key === 'Enter') sendCalaMessage();
}

/* ── DEEP FEELING DETECTOR ── */
function isDeepEmotional(text) {
  const l = text.toLowerCase();
  const deepKeywords = [
    'for so long', 'months', 'years', 'every day', 'every single day',
    'can\'t take it', 'can\'t cope', 'so tired', 'exhausted', 'overwhelmed',
    'keep crying', 'always sad', 'can\'t be happy', 'hopeless', 'give up',
    'no hope', 'anxiety', 'panic attack', 'trauma', 'abuse', 'broken',
    'worthless', 'nobody cares', 'always alone', 'want to die', 'suicide',
    'self harm', 'hurt myself', 'depression', 'mental breakdown',
    'don\'t want to live', 'don\'t know what to do', 'stuck', 'trapped',
    'so angry', 'hate myself', 'emotionally drained', 'numb', 'empty inside',
    'losing hope', 'can\'t go on', 'no reason to live', 'falling apart',
    'can\'t sleep', 'can\'t eat', 'can\'t function', 'breaking down',
    'capek banget', 'nggak sanggup', 'udah lama', 'berbulan',
    'bertahun', 'nggak kuat', 'putus asa', 'menyerah', 'mati',
    'bunuh diri', 'nyakitin diri', 'depresi', 'hancur', 'nggak bisa tidur',
    'nggak ada harapan', 'udah capek', 'lelah banget', 'nggak tau harus gimana'
  ];
  return deepKeywords.some(k => l.includes(k));
}

const proHelp = '\n\nIf you\'d like to talk to someone more deeply or need professional support, CalaSpace has experienced psychologists on the <b><a href="professional-help.html">Professional Help</a></b> page 💜 Dr. Sari, Dr. Rafaela, and Dr. Sarah are ready to listen — safely and without judgment 🌸';

const crisis = 'I\'m here and I care about you 💜 Please reach out to <b>Into The Light Indonesia at 119 ext 8</b> — they\'re ready to help you right now. You can also book a session with a psychologist on the <b><a href="professional-help.html">Professional Help</a></b> page. You matter and you are needed 🌸';

/* ── FEATURE RECOMMENDATION ENGINE ── */
function getFeatureRecommendation(text) {
  const l = text.toLowerCase();
  const recs = [];

  if (l.includes('overthink') || l.includes('pikiran') || l.includes('thoughts racing') ||
      l.includes('can\'t stop thinking') || l.includes('mind won\'t stop') ||
      l.includes('banyak pikiran') || l.includes('galau') || l.includes('confused') ||
      l.includes('mixed feelings') || l.includes('express') || l.includes('write')) {
    recs.push('📖 <b><a href="journal.html">Journal</a></b> — write your thoughts privately, track your mood, and process your feelings day by day');
  }

  if (l.includes('lonely') || l.includes('alone') || l.includes('no one understands') ||
      l.includes('nobody gets me') || l.includes('sendirian') || l.includes('nggak ada yang ngerti') ||
      l.includes('isolated') || l.includes('need someone') || l.includes('want to share') ||
      l.includes('mau cerita') || l.includes('want to talk to someone')) {
    recs.push('💗 <b><a href="community.html">Community</a></b> — share your feelings anonymously with thousands of women who understand');
  }

  if (l.includes('relationship') || l.includes('boyfriend') || l.includes('girlfriend') ||
      l.includes('partner') || l.includes('pacar') || l.includes('pasangan') ||
      l.includes('toxic') || l.includes('red flag') || l.includes('gaslighting') ||
      l.includes('manipulation') || l.includes('controlling') || l.includes('unhealthy') ||
      l.includes('love bombing') || l.includes('breakup') || l.includes('heartbreak') ||
      l.includes('patah hati') || l.includes('cheating') || l.includes('selingkuh')) {
    recs.push('🚩 <b><a href="relationship-check.html">Relationship Check</a></b> — gently identify unhealthy patterns in your relationship');
  }

  if (l.includes('professional') || l.includes('therapist') || l.includes('psychologist') ||
      l.includes('psikolog') || l.includes('konseling') || l.includes('counseling') ||
      l.includes('therapy') || l.includes('mental health') || l.includes('kesehatan mental') ||
      l.includes('trauma') || l.includes('depression') || l.includes('depresi') ||
      l.includes('anxiety disorder') || l.includes('panic attack') || l.includes('need help')) {
    recs.push('💼 <b><a href="professional-help.html">Professional Help</a></b> — book a session with licensed psychologists Dr. Sari, Dr. Rafaela, or Dr. Sarah');
  }

  if (l.includes('stress') || l.includes('capek') || l.includes('need a break') ||
      l.includes('relax') || l.includes('relaxation') || l.includes('calm down') ||
      l.includes('unwind') || l.includes('butuh refreshing') || l.includes('healing') ||
      l.includes('self care') || l.includes('me time') || l.includes('burnout') ||
      l.includes('exhausted') || l.includes('tired of everything')) {
    recs.push('🌸 <b><a href="healing-hub.html">Healing Hub</a></b> — join a Pilates, Flower Arrangement, Candle Therapy, or Pottery class near you');
  }

  if (l.includes('routine') || l.includes('habit') || l.includes('every day') ||
      l.includes('daily') || l.includes('progress') || l.includes('better') ||
      l.includes('improve') || l.includes('grow') || l.includes('journey') ||
      l.includes('kebiasaan') || l.includes('setiap hari') || l.includes('konsisten')) {
    recs.push('🔥 <b>Healing Streak</b> on the Home page — check in daily and track your healing progress');
  }

  if (recs.length === 0) return '';
  if (recs.length === 1) return '\n\n✨ <b>You might also find this helpful:</b><br>' + recs[0];
  return '\n\n✨ <b>Here are some features that might help you:</b><br>' + recs.join('<br>');
}

function getCalaResponse(text) {
  const l = text.toLowerCase();

  /* ── CRISIS FIRST ── */
  if (l.includes('mati') || l.includes('bunuh diri') || l.includes('suicide') ||
      l.includes('nyakitin diri') || l.includes('self harm') || l.includes('nggak mau hidup') ||
      l.includes('want to die') || l.includes('kill myself') || l.includes('hurt myself') ||
      l.includes('end my life') || l.includes('no reason to live') || l.includes('can\'t go on')) {
    return crisis;
  }

  /* ── WEBSITE / FEATURES (Bilingual) ── */
  if (l.includes('reminder') || l.includes('jadwal') || l.includes('schedule')) {
    return 'Reminder is in your account dropdown 💜 There you can see your consultation schedules and healing class bookings!';
  }
  if (l.includes('healing hub') || l.includes('kelas') || l.includes('class') || l.includes('workshop')) {
    return 'Healing Hub has 4 classes: Pilates 🧘, Flower Arrangement 🌸, Candle Therapy 🕯️, and Pottery 🏺 Just pick your city and join!';
  }
  if (l.includes('pilates') || l.includes('movement class') || l.includes('body movement')) {
    return 'Pilates is available in many cities across Indonesia 🧘 Open the <a href="pilates.html">Pilates</a> page, choose your city, then select a session and add to cart!';
  }
  if (l.includes('flower') || l.includes('bunga') || l.includes('rangkai') || l.includes('floral') || l.includes('bouquet')) {
    return 'Flower Arrangement is available in Jakarta, Bandung, Semarang, Surabaya, and Bali 🌸 Open the page, pick a session, and add to cart!';
  }
  if (l.includes('candle') || l.includes('lilin') || l.includes('aromatherapy') || l.includes('scent therapy')) {
    return 'Candle Therapy is available in Jakarta, Bandung, and Bali 🕯️ Healing through scent and candlelight — perfect for deep relaxation!';
  }
  if (l.includes('pottery') || l.includes('keramik') || l.includes('tanah liat') || l.includes('clay') || l.includes('ceramics')) {
    return 'Pottery is available in Jakarta, Bandung, Surabaya, and Bali 🏺 Creating something with your own hands is truly therapeutic!';
  }
  if (l.includes('psikolog') || l.includes('therapist') || l.includes('konsultasi') ||
      l.includes('professional help') || l.includes('psychologist') || l.includes('counseling') ||
      l.includes('therapy session') || l.includes('mental health professional')) {
    return 'You can book a session with a licensed psychologist on the <a href="professional-help.html">Professional Help</a> page 💜 We have Dr. Sari Wijaya, Dr. Rafaela Putri, and Dr. Sarah Pratiwi!';
  }
  if (l.includes('cart') || l.includes('checkout') || l.includes('bayar') ||
      l.includes('payment') || (l.includes('pay') && !l.includes('okay')) || l.includes('purchase') || l.includes('buy')) {
    return 'Add a class to your cart, then checkout by filling in your name, email, and choosing your payment method (QRIS, Dana, OVO, GoPay, Bank Transfer) ✨';
  }
  if (l.includes('add to cart') || l.includes('how to book') || l.includes('how to join') || l.includes('cara daftar kelas')) {
    return 'Here\'s how: go to Healing Hub → choose a class → click View Details → select a session → click Add to Cart 🛒 Easy!';
  }
  if (l.includes('journal') || l.includes('diary') || l.includes('write feelings') || l.includes('tulis perasaan')) {
    return 'Journal is in the navbar menu 📖 Write your feelings every day and choose your mood. This is your private space — no one else can read it!';
  }
  if (l.includes('community') || l.includes('forum') || l.includes('share stories') ||
      l.includes('komunitas') || l.includes('anonymous sharing')) {
    return 'Community is a safe space to share your feelings anonymously 💗 You\'re not alone — thousands of women feel the same!';
  }
  if (l.includes('relationship') || l.includes('red flag') || l.includes('redflag') ||
      l.includes('pasangan') || l.includes('toxic') || l.includes('pacar') ||
      l.includes('partner') || l.includes('boyfriend') || l.includes('girlfriend') ||
      l.includes('love bombing') || l.includes('gaslighting') || l.includes('manipulation') ||
      l.includes('brokenhearted') || l.includes('heartbreak') || l.includes('breakup') ||
      l.includes('patah hati') || l.includes('cheating') || l.includes('selingkuh') ||
      l.includes('abusive relationship') || l.includes('controlling partner')) {
    return 'It sounds like you\'re going through something in a relationship 💜 Try the <b><a href="relationship-check.html">Relationship Check</a></b> feature — it can help you recognize unhealthy patterns gently and safely 🌸 Sometimes we need a little help to see things more clearly.';
  }
  if (l.includes('streak') || l.includes('healing streak') || l.includes('check-in') ||
      l.includes('daily habit') || l.includes('progress tracker')) {
    return 'Healing Streak is on the Home page 🔥 Check in every day to build your healing habit. See your progress in the calendar!';
  }
  if (l.includes('affirmation') || l.includes('afirmasi') || l.includes('positive words') ||
      l.includes('daily quote') || l.includes('motivasi') || l.includes('motivational')) {
    return 'Daily Affirmation is on the Home page ✨ Swipe or click the dots below it to see different affirmations. Read them slowly and let them sink in 💜';
  }
  if (l.includes('dark mode') || l.includes('gelap') || l.includes('night mode') || l.includes('tampilan gelap')) {
    return 'Click the 🌙 icon in the top right navbar to enable dark mode. Click again to switch back to light mode ✨';
  }
  if (l.includes('fitur') || l.includes('feature') || l.includes('what can') || l.includes('what do') ||
      l.includes('what does calaspace') || l.includes('apa saja') || l.includes('ada apa') || l.includes('what\'s available')) {
    return 'CalaSpace has: Community 💗, Journal 📖, Healing Hub 🌸 (Pilates, Flower, Candle, Pottery), Professional Help 💼, Reminder 🔔, Relationship Check 🚩, Healing Streak 🔥, Daily Affirmation, and me — Cala AI 💜';
  }
  if (l.includes('login') || l.includes('log in') || l.includes('register') ||
      l.includes('daftar') || l.includes('sign up') || l.includes('create account') || l.includes('buat akun')) {
    return 'You can Register first in the top right corner of the navbar, then Log In 🌸 Your data is safe and stored on your device!';
  }
  if (l.includes('profile') || l.includes('profil') || l.includes('my account') ||
      l.includes('badges') || l.includes('achievement') || l.includes('my stats')) {
    return 'Your profile is in the avatar dropdown on the top right 👤 There you can see your healing journey stats, badges, and account info!';
  }
  if (l.includes('calaspace') || l.includes('platform') || l.includes('this app') || l.includes('this site')) {
    return 'CalaSpace is a wellness platform exclusively for women 💜 A safe place to heal, breathe, and grow. I\'m Cala, your AI companion here 🌸';
  }

  /* ── EMOTIONAL — FULL BILINGUAL + FEATURE RECS ── */

  if (l.includes('sad') || l.includes('sedih') || l.includes('nangis') ||
      l.includes('cry') || l.includes('crying') || l.includes('tears') ||
      l.includes('heartbroken') || l.includes('devastated') || l.includes('grief') ||
      l.includes('mourning') || l.includes('duka') || l.includes('berduka')) {
    const base = 'I\'m here for you 🌧️ Crying is not weakness — it\'s courage. You\'re allowed to feel this way 💜';
    const recs = getFeatureRecommendation(text);
    return isDeepEmotional(l) ? base + proHelp + recs : base + ' Want to talk more about it?' + recs;
  }

  if (l.includes('stress') || l.includes('capek') || l.includes('exhausted') ||
      l.includes('tired') || l.includes('burnout') || l.includes('burn out') ||
      l.includes('drained') || l.includes('worn out') || l.includes('overworked') ||
      l.includes('kelelahan') || l.includes('lelah') || l.includes('penat') ||
      l.includes('too much') || l.includes('overwhelmed') || l.includes('under pressure')) {
    const base = 'Take a slow breath with me... Inhale for 4 counts... Exhale slowly 🌙 Rest is productive. You\'ve done enough for today 💜';
    const recs = getFeatureRecommendation(text);
    return isDeepEmotional(l) ? base + proHelp + recs : base + recs;
  }

  if (l.includes('anxious') || l.includes('cemas') || l.includes('khawatir') ||
      l.includes('scared') || l.includes('panic') || l.includes('anxiety') ||
      l.includes('nervous') || l.includes('worried') || l.includes('fear') ||
      l.includes('dread') || l.includes('overthink') || l.includes('overthinking') ||
      l.includes('gelisah') || l.includes('takut') || l.includes('bingung') || l.includes('was-was')) {
    const base = 'You\'re safe right now 💙 Try grounding: name 5 things you see, 4 you hear, 3 you can touch. Just one step at a time 🌿';
    const recs = getFeatureRecommendation(text);
    return isDeepEmotional(l) ? base + proHelp + recs : base + recs;
  }

  if (l.includes('lonely') || l.includes('sendirian') || l.includes('alone') ||
      l.includes('isolated') || l.includes('no friends') || l.includes('left out') ||
      l.includes('excluded') || l.includes('kesepian') || l.includes('ditinggal') ||
      l.includes('nggak punya teman') || l.includes('nggak ada yang peduli')) {
    const base = 'You\'re never truly alone 🌸 Thousands of women in the CalaSpace Community feel the same. Come share in that space 💗';
    const recs = getFeatureRecommendation(text);
    return isDeepEmotional(l) ? base + proHelp + recs : base + recs;
  }

  if (l.includes('angry') || l.includes('marah') || l.includes('mad') ||
      l.includes('frustrated') || l.includes('rage') || l.includes('furious') ||
      l.includes('irritated') || l.includes('annoyed') || l.includes('kesal') ||
      l.includes('gondok') || l.includes('emosi') || l.includes('fed up') || l.includes('resent')) {
    const recs = getFeatureRecommendation(text);
    return 'Your feelings are 100% valid 🔥 Anger is human. Try writing it out in your Journal — it can be really relieving 📖' + recs;
  }

  if (l.includes('happy') || l.includes('senang') || l.includes('bahagia') ||
      l.includes('excited') || l.includes('great') || l.includes('wonderful') ||
      l.includes('amazing') || l.includes('proud') || l.includes('grateful') ||
      l.includes('blessed') || l.includes('bersyukur') || l.includes('bangga') ||
      l.includes('lega') || l.includes('thrilled') || l.includes('joyful')) {
    return 'Yay, I\'m so happy for you!! 😭💗 Celebrate this happiness, no matter how small. You deserve this joy!';
  }

  if (l.includes('hopeless') || l.includes('putus asa') || l.includes('menyerah') ||
      l.includes('give up') || l.includes('giving up') || l.includes('no point') ||
      l.includes('what\'s the point') || l.includes('nothing matters') || l.includes('sia-sia')) {
    const recs = getFeatureRecommendation(text);
    return 'I hear you 💜 Hopelessness feels so heavy. You don\'t have to go through this alone.' + proHelp + recs;
  }

  if (l.includes('worthless') || l.includes('not enough') || l.includes('nggak cukup') ||
      l.includes('not good enough') || l.includes('failure') || l.includes('failed') ||
      l.includes('hate myself') || l.includes('benci diri sendiri') ||
      l.includes('unlovable') || l.includes('nobody loves me') || l.includes('nggak ada yang sayang')) {
    const recs = getFeatureRecommendation(text);
    return 'You are enough. You are worthy. Always 💗 Not because of productivity or achievement — but simply because you exist and you are you ✨' + proHelp + recs;
  }

  if (l.includes('talk') || l.includes('vent') || l.includes('need to tell') ||
      l.includes('curhat') || l.includes('cerita') || l.includes('mau cerita') ||
      l.includes('need to share') || l.includes('want to talk') || l.includes('someone to listen') ||
      l.includes('pengen cerita')) {
    return 'I\'m ready to listen 💜 Go ahead, this is a safe space. If you need deeper support, the psychologists at <a href="professional-help.html">Professional Help</a> are always ready too 🌸';
  }

  if (l.includes('depression') || l.includes('depresi') || l.includes('trauma') ||
      l.includes('broken') || l.includes('ptsd') || l.includes('abuse') ||
      l.includes('mental health') || l.includes('kesehatan mental') || l.includes('mental illness')) {
    const recs = getFeatureRecommendation(text);
    return 'Thank you for trusting me with this 💜 What you\'re feeling is real and valid.' + proHelp + recs;
  }

  if (l.includes('body image') || l.includes('nggak percaya diri') || l.includes('insecure') ||
      l.includes('gemuk') || l.includes('kurus') || l.includes('berat badan') ||
      l.includes('penampilan') || l.includes('appearance')) {
    return 'Your body is not the problem 💜 You are worthy of love and care exactly as you are. Would you like to talk more?' + proHelp;
  }

  if (l.includes('work') || l.includes('job') || l.includes('career') ||
      l.includes('boss') || l.includes('deadline') || l.includes('study') ||
      l.includes('exam') || l.includes('grades') || l.includes('kerja') ||
      l.includes('kantor') || l.includes('kuliah') || l.includes('ujian') ||
      l.includes('skripsi') || l.includes('tugas') || l.includes('dosen')) {
    const recs = getFeatureRecommendation(text);
    return 'That sounds really heavy 💜 The pressure at work or school can be so draining. You\'re doing your best and that matters 🌸' + recs;
  }

  if (l.includes('family') || l.includes('mom') || l.includes('dad') ||
      l.includes('parents') || l.includes('keluarga') || l.includes('ibu') ||
      l.includes('ayah') || l.includes('orang tua') || l.includes('kakak') ||
      l.includes('adik') || l.includes('family problems') || l.includes('masalah keluarga')) {
    const recs = getFeatureRecommendation(text);
    return 'Family situations can be really complex and emotionally heavy 💜 Whatever you\'re going through — you don\'t have to face it alone 🌸' + recs;
  }

  if (l.includes('loss') || l.includes('lost someone') || l.includes('someone died') ||
      l.includes('passed away') || l.includes('grieving') || l.includes('meninggal') ||
      l.includes('kehilangan') || l.includes('rindu') || l.includes('ditinggal pergi')) {
    const recs = getFeatureRecommendation(text);
    return 'I\'m so sorry for your loss 🕊️ Grief has no timeline — allow yourself to feel it fully. I\'m here with you 💜' + proHelp + recs;
  }

  /* ── CALA IDENTITY ── */
  if (l.includes('who are you') || l.includes('siapa kamu') || l.includes('what are you') ||
      l.includes('siapa cala') || l.includes('what is cala') || l.includes('cala ai')) {
    return 'Hi! I\'m Cala 💜 CalaSpace\'s AI companion — here to listen, answer your questions about the platform, or just be with you today 🌸 I understand both Indonesian and English!';
  }
  if (l.includes('how are you') || l.includes('apa kabar') || l.includes('are you okay')) {
    return 'I\'m doing well and so happy to meet you today! 💗 How are you? What\'s on your mind?';
  }

  /* ── GREETINGS ── */
  if (l.includes('hello') || l.includes('hi') || l.includes('hey') ||
      l.includes('halo') || l.includes('hai') || l.includes('good morning') ||
      l.includes('good afternoon') || l.includes('good evening') || l.includes('selamat pagi') ||
      l.includes('selamat siang') || l.includes('selamat malam') || l.includes('assalamualaikum')) {
    return 'Hi beautiful 🌸 So glad you stopped by. How are you feeling today?';
  }
  if (l.includes('thank') || l.includes('terima kasih') || l.includes('makasih') || l.includes('thanks')) {
    return 'Of course 💜 I\'m always here for you. Don\'t hesitate to share anything 🌸';
  }
  if (l.includes('bye') || l.includes('goodbye') || l.includes('dadah') ||
      l.includes('take care') || l.includes('see you') || l.includes('sampai jumpa')) {
    return 'Take care, beautiful 🌸 Remember — you\'re never alone. See you soon 💜';
  }

  /* ── DEFAULT ── */
  const defaults = [
    'I hear you 💗 Want to share more? I\'m here to listen.',
    'Hmm, I\'m not sure I have the best answer for that 🌸 But if you want to talk or ask about CalaSpace features, I\'m ready!',
    'Thank you for sharing that with me 💜 Is there anything I can help you with further?',
    'You\'re amazing for seeking support 🌸 What are you feeling right now?'
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

function sendCalaMessage() {
  const input = document.getElementById('calaInput');
  const box = document.getElementById('calaChat');
  if (!input || !box) return;

  const userText = input.value.trim();
  if (!userText) return;

  box.innerHTML += '<div class="user-msg message">' + escapeHtml(userText) + '</div>';
  input.value = '';
  box.scrollTop = box.scrollHeight;

  /* Typing indicator */
  const loadId = 'cala-load-' + Date.now();
  box.innerHTML += '<div class="ai-msg message cala-typing" id="' + loadId + '"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
  box.scrollTop = box.scrollHeight;

  setTimeout(function () {
    const loadEl = document.getElementById(loadId);
    if (loadEl) loadEl.remove();
    const reply = getCalaResponse(userText);
    const msgDiv = document.createElement('div');
    msgDiv.className = 'ai-msg message';
    msgDiv.innerHTML = reply;
    box.appendChild(msgDiv);
    box.scrollTop = box.scrollHeight;
  }, 700 + Math.random() * 400);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}
