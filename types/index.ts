// Types for navigation
export interface NavLink {
    name: string;
    href: string;
}

// Types for events
export type EventStatus = 'upcoming' | 'past';

export interface ScheduleItem {
    time: string;
    activity: string;
}

export interface EventImage {
    id: string;
    url: string;
    publicId: string;
    caption?: string;
    order: number;
}

export interface Event {
    id?: string;
    date: string;
    year: string;
    title: string;
    description: string;
    status: EventStatus;
    icon: string;
    order?: number;
    isActive?: boolean;

    // Campos detallados
    fullDescription?: string;
    location?: string;
    time?: string;
    ticketPrice?: number;
    maxTickets?: number;
    hasTickets?: boolean;
    schedule?: ScheduleItem[];
    instructions?: string;
    images?: EventImage[];
}

// Types for info section
export interface InfoCard {
    icon: string;
    title: string;
    description: string;
    gradient: string;
}

// Types for fund section
export interface FundData {
    goal: number;
    collected: number;
    weeklyAmount: number;
    totalMembers: number;
    contributingMembers: number;
}

export interface Contributor {
    name: string;
    amount: number;
    weeks: number;
}

// Types for gallery
export interface GalleryImage {
    id: number;
    category: string;
    color: string;
    label: string;
}

export interface Category {
    id: string;
    label: string;
}

// Types for stats
export interface Stat {
    value: string;
    label: string;
}

// Types for contribution system
export interface Payment {
    id: string;
    weekNumber: number;
    amount: number;
    paidAt: string;
}

export interface StudentResult {
    id: string;
    name: string;
    photoUrl: string | null;
    totalPaid: number;
    weeksPaid: number;
    weeksPending: number;
    amountOwed: number;
    currentWeek: number;
    weeklyAmount: number;
    isUpToDate: boolean;
    payments: Payment[];
}

export interface FundStats {
    totalStudents: number;
    studentsUpToDate: number;
    studentsPending: number;
    totalCollected: number;
    currentWeek: number;
    weeklyAmount: number;
    goal: number;
}

export interface ProgressBarProps {
    percentage: number;
}
