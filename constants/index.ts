import type {
    NavLink,
    Event,
    InfoCard,
    FundData,
    Contributor,
    GalleryImage,
    Category,
    Stat
} from '@/types';

// Navigation Links
export const NAV_LINKS: NavLink[] = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Información', href: '#info' },
    { name: 'Eventos', href: '#eventos' },
    { name: 'Integrantes', href: '#integrantes' },
    { name: 'Galería', href: '#galeria' },
    { name: 'Aportes', href: '#aportes' },
];

// Events Data
export const EVENTS: Event[] = [
    {
        date: '15 Mar',
        year: '2026',
        title: 'Sesión de Fotos Oficial',
        description: 'Capturamos nuestros mejores momentos en una sesión fotográfica profesional en el campus UNA.',
        status: 'upcoming',
        icon: '📸',
    },
    {
        date: '20 Abr',
        year: '2026',
        title: 'Paseo de Promoción',
        description: 'Viaje grupal para fortalecer lazos y crear nuevos recuerdos juntos. Destino por definir.',
        status: 'upcoming',
        icon: '🏖️',
    },
    {
        date: '10 Jun',
        year: '2026',
        title: 'Cena de Gala',
        description: 'Celebración elegante para despedir nuestra etapa universitaria en la UNA Puno.',
        status: 'upcoming',
        icon: '🎩',
    },
    {
        date: '15 Jul',
        year: '2026',
        title: 'Ceremonia de Graduación',
        description: 'El gran día donde recibiremos nuestros títulos como Ingenieros Estadísticos e Informáticos.',
        status: 'upcoming',
        icon: '🎓',
    },
];

// Info Cards
export const INFO_CARDS: InfoCard[] = [
    {
        icon: '🎓',
        title: 'Ingeniería Estadística e Informática',
        description: 'Formando profesionales competentes en análisis de datos, desarrollo de software y tecnologías de información.',
        gradient: 'from-una-red to-una-red-light',
    },
    {
        icon: '👥',
        title: 'Compañeros Unidos',
        description: 'Un grupo comprometido de futuros profesionales, listos para dejar huella en Puno y el mundo.',
        gradient: 'from-una-gold to-una-gold-light',
    },
    {
        icon: '🏔️',
        title: 'Orgullo Altiplánico',
        description: 'Representando con honor a la Universidad Nacional del Altiplano y a nuestra tierra puneña.',
        gradient: 'from-una-blue to-una-blue-light',
    },
    {
        icon: '🌟',
        title: 'Visión 2026 - II',
        description: 'Graduarnos con éxito y comenzar una nueva etapa llena de oportunidades profesionales.',
        gradient: 'from-una-cyan to-una-cyan-light',
    },
];

// Stats for Info Section
export const STATS: Stat[] = [
    { value: '50+', label: 'Compañeros' },
    { value: '5', label: 'Años Juntos' },
    { value: '2026', label: 'Graduación' },
    { value: '∞', label: 'Recuerdos' },
];

// Fund Data (Mock - to be replaced with real data from backend)
export const FUND_DATA: FundData = {
    goal: 5000,
    collected: 1250,
    weeklyAmount: 5,
    totalMembers: 50,
    contributingMembers: 25,
};

// Recent Contributors (Mock)
export const RECENT_CONTRIBUTORS: Contributor[] = [
    { name: 'Juan P.', amount: 20, weeks: 4 },
    { name: 'María G.', amount: 15, weeks: 3 },
    { name: 'Carlos R.', amount: 25, weeks: 5 },
    { name: 'Ana M.', amount: 10, weeks: 2 },
    { name: 'Luis S.', amount: 20, weeks: 4 },
];

// Gallery Images (Placeholder)
export const GALLERY_IMAGES: GalleryImage[] = [
    { id: 1, category: 'campus', color: 'from-una-red to-una-gold', label: 'Campus UNA' },
    { id: 2, category: 'friends', color: 'from-una-gold to-una-blue', label: 'Compañeros' },
    { id: 3, category: 'events', color: 'from-una-blue to-una-cyan', label: 'Eventos' },
    { id: 4, category: 'campus', color: 'from-una-cyan to-una-green', label: 'Campus UNA' },
    { id: 5, category: 'friends', color: 'from-una-green to-una-gold', label: 'Compañeros' },
    { id: 6, category: 'events', color: 'from-una-red to-una-blue', label: 'Eventos' },
];

// Gallery Categories
export const GALLERY_CATEGORIES: Category[] = [
    { id: 'all', label: 'Todas' },
    { id: 'campus', label: 'Campus' },
    { id: 'friends', label: 'Compañeros' },
    { id: 'events', label: 'Eventos' },
];

// Particle configuration for Hero
export const PARTICLE_COUNT = 15;
