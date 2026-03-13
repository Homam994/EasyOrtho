// =====================================================
//  db.js  —  Shared cloud database via JSONBin.io
//  يجب تعبئة BIN_ID و API_KEY من إعدادات JSONBin
// =====================================================

const DB = (() => {
  // ⚠️  يُعبَّآن من صفحة الإدارة بعد إنشاء الـ Bin
  let BIN_ID  = localStorage.getItem('db_bin_id')  || '';
  let API_KEY = localStorage.getItem('db_api_key') || '';

  const BASE = 'https://api.jsonbin.io/v3';

  let _cache = null;
  let _lastFetch = 0;
  const CACHE_TTL = 30_000; // 30 ثانية

  // -------- DEFAULT DATA --------
  const DEFAULTS = {
    clinicInfo: {
      name:       'مركز لؤلؤة الابتسامة',
      slogan:     'لطب الأسنان المتخصص',
      whatsapp:   '966500000000',
      phone:      '920-000-000',
      address:    'شارع الأمير محمد بن عبدالعزيز، حي العليا، الرياض',
      email:      'info@pearl-dental.com',
      mapEmbed:   'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.3069641489!2d46.5390756!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2s!4v1',
      about1:     'يضم مركزنا نخبة من أمهر أطباء الأسنان المتخصصين في مختلف فروع طب الأسنان، مزوّدين بأحدث الأجهزة والتقنيات.',
      about2:     'نؤمن بأن ابتسامتك هي انعكاس لصحتك وثقتك بنفسك، لذلك نحرص على تقديم تجربة علاجية راقية في بيئة مريحة وآمنة.',
      footerDesc: 'مركز متكامل لطب الأسنان يجمع بين الخبرة العلمية والتقنيات الحديثة.',
      logoUrl:    '',
    },
    doctors: [
      { id:1, name:'د. أحمد المنصوري',  specialty:'تقويم وجراحة الفم',       img:'', workDays:[0,1,2,3,4], startTime:'9:00',  endTime:'17:00', slotDuration:30 },
      { id:2, name:'د. سارة الزهراني',  specialty:'زراعة الأسنان',            img:'', workDays:[0,1,2,4,6], startTime:'10:00', endTime:'18:00', slotDuration:45 },
      { id:3, name:'د. خالد العتيبي',   specialty:'طب الأسنان التجميلي',      img:'', workDays:[1,2,3,4,5], startTime:'8:00',  endTime:'16:00', slotDuration:30 },
      { id:4, name:'د. نورة الشمري',    specialty:'طب أسنان الأطفال',         img:'', workDays:[0,1,2,3,4,5], startTime:'9:00', endTime:'17:00', slotDuration:30 },
    ],
    specialties: [
      { icon:'fa fa-teeth',      title:'تقويم الأسنان',        desc:'علاج اعوجاج الأسنان بأحدث تقنيات التقويم الشفاف والمعدني للحصول على ابتسامة مثالية.' },
      { icon:'fa fa-tooth',      title:'زراعة الأسنان',         desc:'حلول دائمة لفقدان الأسنان باستخدام أفضل أنواع الغرسات المعتمدة عالمياً.' },
      { icon:'fa fa-star',       title:'الأسنان التجميلية',    desc:'تحسين مظهر ابتسامتك عبر الفينيرز والقشور والتركيبات الخزفية الاحترافية.' },
      { icon:'fa fa-syringe',    title:'علاج جذور الأسنان',    desc:'حل فعال ومريح لإنقاذ الأسنان المتضررة من العدوى والتلف الشديد.' },
      { icon:'fa fa-face-smile', title:'تبييض الأسنان',        desc:'جلسات احترافية لتبييض الأسنان بأنظمة مرخصة وآمنة تمنحك بريقاً ساطعاً.' },
      { icon:'fa fa-child',      title:'طب أسنان الأطفال',     desc:'رعاية متخصصة ولطيفة لأسنان أطفالك في بيئة ودية تقلل من القلق.' },
    ],
    reviews: [
      { name:'أم عبدالله',        initial:'أ', rating:5, text:'تجربة رائعة جداً! الطاقم الطبي محترف ومتفهم، والمكان نظيف وأنيق.',          date:'منذ أسبوع',    doctor:'د. أحمد المنصوري' },
      { name:'محمد الغامدي',      initial:'م', rating:5, text:'أفضل مركز لطب الأسنان زرته. الدكتورة سارة خبيرة جداً في الزراعة.',        date:'منذ شهر',      doctor:'د. سارة الزهراني' },
      { name:'نوف الحربي',        initial:'ن', rating:5, text:'جئت للتجميل وخرجت بابتسامة أحلم بها من سنوات!',                          date:'منذ 3 أسابيع', doctor:'د. خالد العتيبي' },
      { name:'عبدالرحمن الدوسري', initial:'ع', rating:4, text:'المركز ممتاز والمواعيد دقيقة. استمتعت بتجربة التبييض والنتيجة فاقت توقعاتي.', date:'منذ شهرين',  doctor:'د. خالد العتيبي' },
      { name:'هيفاء القحطاني',    initial:'ه', rating:5, text:'ابنتي كانت تخاف من طبيب الأسنان حتى جاءت هنا! الدكتورة نورة رائعة.',    date:'منذ أسبوعين', doctor:'د. نورة الشمري' },
      { name:'فهد الشهراني',      initial:'ف', rating:5, text:'زرعة الأسنان اكتملت بنجاح تام. الفريق الطبي محترف ومطمئن جداً.',        date:'منذ شهر',      doctor:'د. سارة الزهراني' },
    ],
    hoursOverride: null,
  };

  // -------- HELPERS --------
  function headers() {
    return {
      'Content-Type':   'application/json',
      'X-Master-Key':   API_KEY,
      'X-Bin-Versioning': 'false',
    };
  }

  function isConfigured() { return BIN_ID && API_KEY; }

  // -------- PUBLIC API --------
  async function read() {
    if (!isConfigured()) return JSON.parse(JSON.stringify(DEFAULTS));

    const now = Date.now();
    if (_cache && (now - _lastFetch) < CACHE_TTL) return _cache;

    try {
      const res = await fetch(`${BASE}/b/${BIN_ID}/latest`, { headers: headers() });
      if (!res.ok) throw new Error('fetch failed');
      const json = await res.json();
      _cache = { ...DEFAULTS, ...json.record };
      _lastFetch = now;
      return _cache;
    } catch(e) {
      console.warn('DB read failed, using cache/defaults', e);
      return _cache || JSON.parse(JSON.stringify(DEFAULTS));
    }
  }

  async function write(data) {
    if (!isConfigured()) throw new Error('DB not configured');
    _cache = data;
    const res = await fetch(`${BASE}/b/${BIN_ID}`, {
      method:  'PUT',
      headers: headers(),
      body:    JSON.stringify(data),
    });
    if (!res.ok) throw new Error('write failed: ' + res.status);
    return true;
  }

  function configure(binId, apiKey) {
    BIN_ID  = binId;
    API_KEY = apiKey;
    localStorage.setItem('db_bin_id',  binId);
    localStorage.setItem('db_api_key', apiKey);
    _cache = null;
  }

  function getConfig() { return { binId: BIN_ID, apiKey: API_KEY }; }
  function isReady()   { return isConfigured(); }

  return { read, write, configure, getConfig, isReady, DEFAULTS };
})();
