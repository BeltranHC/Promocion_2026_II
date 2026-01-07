// Types for navigation
export interface NavLink {
    name: string;
    href: string;
}

// Types for events
export type EventStatus = 'upcoming' | 'past';

export interface Event {
    date: string;
    year: string;
    title: string;
    description: string;
    status: EventStatus;
    icon: string;
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
