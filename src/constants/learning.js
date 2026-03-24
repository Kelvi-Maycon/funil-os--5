export const WORD_STATUSES = ['desconhecida', 'reconhecida', 'em_treino', 'ativa', 'dominada'];

// Gamification: Activity XP (AP) daily cap
export const DAILY_XP_CAP = 150;

// Mastery XP awarded on first SRS status transitions (drives level progression)
export const MASTERY_XP = {
    ativa: 50,
    dominada: 150,
};

// CEFR mastery levels (A1 → B2+). Each has 3 awards unlocked at 1/3, 2/3, and 100% of the level range.
// MP thresholds are calibrated: ~200 MP per word fully dominated (50 ativa + 150 dominada).
// A1=100 words, A2=300, B1=600, B2=1000, B2+=1500 total dominated.
export const CEFR_MASTERY_LEVELS = [
    {
        id: 'A1', mpStart: 0, mpEnd: 20000,
        awards: [
            { icon: 'medal-bronze', name: 'Iniciante',    mp: 6700 },
            { icon: 'medal-silver', name: 'Descobridor',  mp: 13300 },
            { icon: 'medal-gold', name: 'Explorador',   mp: 20000 },
        ],
    },
    {
        id: 'A2', mpStart: 20000, mpEnd: 60000,
        awards: [
            { icon: 'medal-bronze', name: 'Conversador',  mp: 33300 },
            { icon: 'medal-silver', name: 'Praticante',   mp: 46700 },
            { icon: 'medal-gold', name: 'Comunicador',  mp: 60000 },
        ],
    },
    {
        id: 'B1', mpStart: 60000, mpEnd: 120000,
        awards: [
            { icon: 'medal-bronze', name: 'Articulador',  mp: 80000 },
            { icon: 'medal-silver', name: 'Fluente',      mp: 100000 },
            { icon: 'medal-gold', name: 'Refinado',     mp: 120000 },
        ],
    },
    {
        id: 'B2', mpStart: 120000, mpEnd: 200000,
        awards: [
            { icon: 'medal-bronze', name: 'Avançado',     mp: 146700 },
            { icon: 'medal-silver', name: 'Expert',       mp: 173300 },
            { icon: 'medal-gold', name: 'Mestre',       mp: 200000 },
        ],
    },
    {
        id: 'B2+', mpStart: 200000, mpEnd: 300000,
        awards: [
            { icon: 'medal-bronze', name: 'Especialista', mp: 233300 },
            { icon: 'medal-silver', name: 'Elite',        mp: 266700 },
            { icon: 'gem', name: 'Lendário',     mp: 300000 },
        ],
    },
];

// Daily streak bonus (fixed AP added on top of cap, awarded once per day)
export const STREAK_BONUS_TABLE = [
    { minDays: 365, bonus: 40 },
    { minDays: 180, bonus: 35 },
    { minDays: 90,  bonus: 30 },
    { minDays: 60,  bonus: 25 },
    { minDays: 30,  bonus: 20 },
    { minDays: 14,  bonus: 15 },
    { minDays: 7,   bonus: 10 },
    { minDays: 3,   bonus: 5 },
    { minDays: 0,   bonus: 0 },
];

// CEFR vocabulary estimate thresholds (based on ativa + dominada word count, capped at B2+)
export const CEFR_VOCAB_THRESHOLDS = [
    { min: 2000, label: 'B2+' },
    { min: 800,  label: 'B1' },
    { min: 300,  label: 'A2' },
    { min: 0,    label: 'A1' },
];

export const WORD_STATUS_META = {
    desconhecida: { label: 'Desconhecida', badgeClass: 'badge-unknown', color: 'var(--c-muted)' },
    reconhecida: { label: 'Reconhecida', badgeClass: 'badge-recognized', color: '#60A5FA' },
    em_treino: { label: 'Em Treino', badgeClass: 'badge-training', color: 'var(--c-brand-light)' },
    ativa: { label: 'Ativa', badgeClass: 'badge-active', color: '#FBBF24' },
    dominada: { label: 'Dominada', badgeClass: 'badge-mastered', color: 'var(--c-success)' },
};

export const DEFAULT_MISSIONS = {
    readerWords: 5,
    builderExercises: 6,
    flashcardReviews: 10,
    productionWrites: 2,
    recycledWords: 3,
};

export const MISSION_META = [
    { key: 'readerWords', label: 'Leitura Matinal', icon: 'book-open', desc: 'Clique em novas palavras durante a leitura.', xp: 25 },
    { key: 'builderExercises', label: 'Prática Guiada', icon: 'puzzle', desc: 'Complete construções de frase com foco na forma correta.', xp: 60 },
    { key: 'flashcardReviews', label: 'Revisão SRS Diária', icon: 'brain', desc: 'Revisite cards devidos para manter retenção alta.', xp: 80 },
    { key: 'productionWrites', label: 'Produção Livre', icon: 'pencil', desc: 'Escreva frases próprias usando o vocabulário do dia.', xp: 30 },
    { key: 'recycledWords', label: 'Reciclagem Ativa', icon: 'recycle', desc: 'Reative palavras já vistas para consolidar o ciclo.', xp: 35 },
];

export const ACHIEVEMENT_META = {
    first_discovery: { icon: 'seedling', title: 'Primeira descoberta', desc: 'Você adicionou sua primeira palavra ao ciclo.' },
    builder_apprentice: { icon: 'puzzle', title: 'Arquiteto de frases', desc: 'Completou 25 exercícios no construtor.' },
    memory_keeper: { icon: 'file-box', title: 'Guardião do banco', desc: 'Salvou 20 frases em flashcards.' },
    recycler: { icon: 'recycle', title: 'Reciclador', desc: 'Reativou 15 palavras antigas.' },
    perfect_flow: { icon: 'spark', title: 'Fluxo perfeito', desc: 'Acertou 10 exercícios de primeira.' },
    weekly_rhythm: { icon: 'calendar', title: 'Ritmo semanal', desc: 'Estudou em pelo menos 4 dias na semana.' },
    active_lexicon: { icon: 'flame', title: 'Vocabulário ativo', desc: 'Levou 10 itens até o estágio ativo.' },
    prompt_starter: { icon: 'pencil', title: 'Prompt do dia', desc: 'Concluiu seu primeiro desafio diário de produção.' },
};

export const XP_PER_LEVEL = 120;

export const ICON_MAP = {
    'medal-bronze': 'MedalBronzeIcon',
    'medal-silver': 'MedalSilverIcon',
    'medal-gold': 'MedalGoldIcon',
    'gem': 'GemIcon',
    'book-open': 'BookOpenIcon',
    'puzzle': 'PuzzleIcon',
    'brain': 'BrainIcon',
    'pencil': 'PencilIcon',
    'recycle': 'RecycleIcon',
    'seedling': 'SeedlingIcon',
    'file-box': 'FileBoxIcon',
    'spark': 'SparkIcon',
    'calendar': 'CalendarIcon',
    'flame': 'FlameIcon',
    'chat-bubble': 'ChatBubbleIcon',
    'robot': 'RobotIcon',
    'user-circle': 'UserCircleIcon',
    'lock': 'LockIcon',
    'party': 'PartyIcon',
    'check-circle': 'CheckCircleIcon',
};
