import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Home, CalendarDays, User, BookOpen, Search, ChevronLeft,
  Star, MapPin, Clock, Plus, ChevronRight, Check, Edit3,
  TrendingUp, Users, DollarSign, X, LogOut, Bell, Shield,
  Scissors, Sparkles, Flower2, Dumbbell, Brain, Tag,
  Heart, Gift, UserPlus, Info, Share2, Copy, Camera,
  Navigation, LayoutGrid, CalendarRange,
  BarChart2, AlertCircle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────
type View =
  | "splash" | "login" | "signup" | "forgot-password"
  | "client-home" | "search-results" | "category-results"
  | "provider-profile" | "booking-flow"
  | "my-appointments" | "business-bookings"
  | "provider-dashboard" | "provider-calendar"
  | "service-setup" | "business-profile"
  | "settings" | "edit-account" | "privacy" | "about-us"
  | "gift-cards" | "invite-friends" | "favorites" | "revenue-detail";

type AccountType = "personal" | "business";
type Gender = "women" | "men";
type SortKey = "rating" | "price" | "distance";
type CalFormat = "week" | "month";

interface Account {
  id: string; name: string; email: string; phone: string;
  type: AccountType; avatar: string; active: boolean;
  photoUrl?: string;
}
interface Provider {
  id: string; name: string; categoryKey: string; gender: Gender;
  rating: number; reviews: number; location: string; region: string;
  price: string; priceValue: number; distanceKm: number; image: string; bio: string;
  services: { name: string; duration: string; price: string }[];
}
interface CalendarAppt {
  id: string; time: string; client: string; service: string;
  duration: string; price: string; date: string; type: "appointment" | "break";
}
interface BookingRequest {
  id: string; providerId: string; providerName: string; providerLocation: string;
  service: string; date: string; dateIdx: number; time: string; price: string;
  status: "pending" | "confirmed" | "cancelled" | "rejected";
}
interface UserReview {
  id: string; providerId: string; reviewerName: string;
  rating: number; text: string; date: string;
}
interface ServiceItem {
  id: string; name: string; duration: string; price: string;
  description: string; group: string; active: boolean;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const MOCK_ACCOUNTS: Account[] = [
  { id: "1", name: "Reem Al-Rashidi", email: "reem@gmail.com", phone: "+965 9111 2233", type: "personal", avatar: "RA", active: true },
  { id: "2", name: "Burak Barbershop", email: "burak@gmail.com", phone: "+965 9876 5432", type: "business", avatar: "BB", active: false },
];

const ALL_PROVIDERS: Provider[] = [
  { id: "b1", name: "The Blade Barbershop", categoryKey: "barber", gender: "men", rating: 4.9, reviews: 428, location: "Salmiya", region: "Salmiya", price: "4 KWD", priceValue: 4, distanceKm: 1.2, image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=280&fit=crop&auto=format", bio: "Kuwait's most celebrated barbershop, blending classic cuts with modern style since 2015.", services: [{ name: "Classic Haircut", duration: "30 min", price: "4 KWD" }, { name: "Haircut & Beard", duration: "45 min", price: "6 KWD" }, { name: "Hot Towel Shave", duration: "30 min", price: "5 KWD" }, { name: "Beard Trim", duration: "20 min", price: "3 KWD" }] },
  { id: "b2", name: "Cuts & Culture", categoryKey: "barber", gender: "men", rating: 4.7, reviews: 183, location: "Kuwait City", region: "Kuwait City", price: "5 KWD", priceValue: 5, distanceKm: 3.4, image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=280&fit=crop&auto=format", bio: "Street-culture inspired barbershop where every fade tells a story.", services: [{ name: "Fade & Style", duration: "40 min", price: "5 KWD" }, { name: "Full Groom Package", duration: "1 hr", price: "9 KWD" }, { name: "Kids Cut", duration: "20 min", price: "3 KWD" }] },
  { id: "b3", name: "Crown Barbers", categoryKey: "barber", gender: "men", rating: 4.8, reviews: 267, location: "Hawalli", region: "Hawalli", price: "4 KWD", priceValue: 4, distanceKm: 2.1, image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=280&fit=crop&auto=format", bio: "Premium grooming for the modern Kuwaiti gentleman.", services: [{ name: "Classic Cut", duration: "30 min", price: "4 KWD" }, { name: "Shape Up", duration: "20 min", price: "3 KWD" }, { name: "Color & Style", duration: "1 hr", price: "12 KWD" }] },
  { id: "ms1", name: "Sultan Spa", categoryKey: "spa", gender: "men", rating: 4.8, reviews: 312, location: "Mishref", region: "Mishref", price: "15 KWD", priceValue: 15, distanceKm: 4.8, image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=280&fit=crop&auto=format", bio: "An oasis of calm for the gentleman who values restoration.", services: [{ name: "Swedish Massage", duration: "1 hr", price: "15 KWD" }, { name: "Deep Tissue", duration: "1 hr", price: "20 KWD" }, { name: "Sports Recovery", duration: "45 min", price: "18 KWD" }, { name: "Sauna & Steam", duration: "1 hr", price: "10 KWD" }] },
  { id: "ms2", name: "Al-Hamra Gents Spa", categoryKey: "spa", gender: "men", rating: 4.6, reviews: 198, location: "Rumaithiya", region: "Rumaithiya", price: "12 KWD", priceValue: 12, distanceKm: 3.9, image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=280&fit=crop&auto=format", bio: "Traditional hammam meets modern wellness.", services: [{ name: "Relaxation Massage", duration: "1 hr", price: "12 KWD" }, { name: "Hot Stone Therapy", duration: "1.5 hr", price: "22 KWD" }, { name: "Foot Reflexology", duration: "45 min", price: "10 KWD" }] },
  { id: "mpt1", name: "Flex Kuwait", categoryKey: "personalTrainer", gender: "men", rating: 4.9, reviews: 156, location: "Salmiya", region: "Salmiya", price: "20 KWD", priceValue: 20, distanceKm: 1.8, image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=280&fit=crop&auto=format", bio: "Elite personal training with certified coaches.", services: [{ name: "PT Session", duration: "1 hr", price: "20 KWD" }, { name: "10-Session Package", duration: "10 hr", price: "170 KWD" }, { name: "Nutrition Plan", duration: "Monthly", price: "30 KWD" }] },
  { id: "mpt2", name: "Iron Will Fitness", categoryKey: "personalTrainer", gender: "men", rating: 4.7, reviews: 89, location: "Kuwait City", region: "Kuwait City", price: "18 KWD", priceValue: 18, distanceKm: 5.2, image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=280&fit=crop&auto=format", bio: "Strength-focused training for lasting results.", services: [{ name: "1-on-1 Training", duration: "1 hr", price: "18 KWD" }, { name: "Body Assessment", duration: "30 min", price: "10 KWD" }] },
  { id: "mth1", name: "Serenity Wellness", categoryKey: "therapist", gender: "men", rating: 4.8, reviews: 74, location: "Jabriya", region: "Jabriya", price: "25 KWD", priceValue: 25, distanceKm: 6.1, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=280&fit=crop&auto=format", bio: "Licensed therapists providing evidence-based support.", services: [{ name: "Initial Consultation", duration: "1 hr", price: "25 KWD" }, { name: "Therapy Session", duration: "50 min", price: "30 KWD" }, { name: "Stress Management", duration: "45 min", price: "22 KWD" }] },
  { id: "mth2", name: "Mind & Body Center", categoryKey: "therapist", gender: "men", rating: 4.6, reviews: 52, location: "Hawalli", region: "Hawalli", price: "22 KWD", priceValue: 22, distanceKm: 2.7, image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=280&fit=crop&auto=format", bio: "Holistic mental wellness through counseling and mindfulness.", services: [{ name: "Counseling Session", duration: "1 hr", price: "22 KWD" }, { name: "Mindfulness Training", duration: "45 min", price: "18 KWD" }] },
  { id: "wbs1", name: "Al-Salam Beauty", categoryKey: "beautySalon", gender: "women", rating: 4.9, reviews: 312, location: "Salmiya", region: "Salmiya", price: "12 KWD", priceValue: 12, distanceKm: 1.5, image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=280&fit=crop&auto=format", bio: "Kuwait's premier destination for hair, nails, and beauty.", services: [{ name: "Blow Dry & Style", duration: "45 min", price: "12 KWD" }, { name: "Full Highlights", duration: "2 hr", price: "35 KWD" }, { name: "Keratin Treatment", duration: "3 hr", price: "55 KWD" }, { name: "Nail Gel Set", duration: "1 hr", price: "18 KWD" }, { name: "Manicure & Pedicure", duration: "1.5 hr", price: "22 KWD" }] },
  { id: "wbs2", name: "Farah Brow Studio", categoryKey: "beautySalon", gender: "women", rating: 5.0, reviews: 87, location: "Hawalli", region: "Hawalli", price: "8 KWD", priceValue: 8, distanceKm: 2.3, image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=280&fit=crop&auto=format", bio: "Specialist brow and lash studio. Precision artistry.", services: [{ name: "Brow Lamination", duration: "45 min", price: "15 KWD" }, { name: "Microblading", duration: "2 hr", price: "65 KWD" }, { name: "Lash Lift", duration: "1 hr", price: "20 KWD" }, { name: "Tinting", duration: "30 min", price: "8 KWD" }] },
  { id: "wbs3", name: "Glow Skin Studio", categoryKey: "beautySalon", gender: "women", rating: 4.7, reviews: 241, location: "Rumaithiya", region: "Rumaithiya", price: "22 KWD", priceValue: 22, distanceKm: 3.6, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=280&fit=crop&auto=format", bio: "Science-backed skincare treatments for radiant skin.", services: [{ name: "Hydra Facial", duration: "1 hr", price: "35 KWD" }, { name: "Chemical Peel", duration: "45 min", price: "28 KWD" }, { name: "LED Therapy", duration: "30 min", price: "22 KWD" }] },
  { id: "ws1", name: "Noura Spa & Wellness", categoryKey: "spa", gender: "women", rating: 4.8, reviews: 198, location: "Kuwait City", region: "Kuwait City", price: "18 KWD", priceValue: 18, distanceKm: 4.2, image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=280&fit=crop&auto=format", bio: "A sanctuary for women. Luxurious treatments by expert therapists.", services: [{ name: "Aromatherapy", duration: "1 hr", price: "18 KWD" }, { name: "Hot Stone Massage", duration: "1.5 hr", price: "30 KWD" }, { name: "Body Scrub", duration: "45 min", price: "22 KWD" }, { name: "Facial & Massage", duration: "2 hr", price: "40 KWD" }] },
  { id: "ws2", name: "Serenity Ladies Spa", categoryKey: "spa", gender: "women", rating: 4.9, reviews: 164, location: "Mishref", region: "Mishref", price: "20 KWD", priceValue: 20, distanceKm: 5.1, image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=400&h=280&fit=crop&auto=format", bio: "Award-winning ladies spa offering hammam, massage, and wellness.", services: [{ name: "Full Body Massage", duration: "1 hr", price: "20 KWD" }, { name: "Couples Spa", duration: "2 hr", price: "70 KWD" }, { name: "Moroccan Hammam", duration: "1.5 hr", price: "25 KWD" }] },
  { id: "wpt1", name: "FitHer Kuwait", categoryKey: "personalTrainer", gender: "women", rating: 4.8, reviews: 112, location: "Salmiya", region: "Salmiya", price: "18 KWD", priceValue: 18, distanceKm: 2.0, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=280&fit=crop&auto=format", bio: "Women-only fitness coaching in a supportive environment.", services: [{ name: "PT Session", duration: "1 hr", price: "18 KWD" }, { name: "Pilates Class", duration: "1 hr", price: "12 KWD" }, { name: "Nutrition Coaching", duration: "Monthly", price: "25 KWD" }] },
  { id: "wpt2", name: "Wellness by Sara", categoryKey: "personalTrainer", gender: "women", rating: 4.6, reviews: 78, location: "Jabriya", region: "Jabriya", price: "16 KWD", priceValue: 16, distanceKm: 5.8, image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=280&fit=crop&auto=format", bio: "Yoga, stretch, and wellness programming tailored to women.", services: [{ name: "Yoga Session", duration: "1 hr", price: "16 KWD" }, { name: "Stretch & Tone", duration: "45 min", price: "14 KWD" }] },
  { id: "wth1", name: "Inner Peace Clinic", categoryKey: "therapist", gender: "women", rating: 4.9, reviews: 93, location: "Kuwait City", region: "Kuwait City", price: "28 KWD", priceValue: 28, distanceKm: 4.5, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=280&fit=crop&auto=format", bio: "Compassionate, confidential therapy for women.", services: [{ name: "Initial Session", duration: "1 hr", price: "28 KWD" }, { name: "Follow-up Session", duration: "50 min", price: "25 KWD" }, { name: "Anxiety Workshop", duration: "2 hr", price: "40 KWD" }] },
  { id: "wth2", name: "Reem Therapy Center", categoryKey: "therapist", gender: "women", rating: 4.7, reviews: 67, location: "Rumaithiya", region: "Rumaithiya", price: "24 KWD", priceValue: 24, distanceKm: 3.8, image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=280&fit=crop&auto=format", bio: "CBT and mindfulness-based therapy in a calm, private setting.", services: [{ name: "CBT Session", duration: "1 hr", price: "24 KWD" }, { name: "Mindfulness", duration: "45 min", price: "20 KWD" }] },
];

const MEN_CATEGORIES = [{ key: "spa", label: "Spa", icon: Flower2 }, { key: "barber", label: "Barber", icon: Scissors }, { key: "personalTrainer", label: "Trainer", icon: Dumbbell }, { key: "therapist", label: "Therapist", icon: Brain }];
const WOMEN_CATEGORIES = [{ key: "spa", label: "Spa", icon: Flower2 }, { key: "beautySalon", label: "Beauty", icon: Sparkles }, { key: "personalTrainer", label: "Trainer", icon: Dumbbell }, { key: "therapist", label: "Therapist", icon: Brain }];

const SPECIAL_OFFERS = [
  { id: "o1", title: "20% Off First Visit", providerId: "wbs1", provider: "Al-Salam Beauty", expiry: "30 Jun", image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=360&h=200&fit=crop&auto=format" },
  { id: "o2", title: "Free Consultation", providerId: "mth1", provider: "Serenity Wellness", expiry: "15 Jul", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=360&h=200&fit=crop&auto=format" },
  { id: "o3", title: "3 Sessions + 1 Free", providerId: "mpt1", provider: "Flex Kuwait", expiry: "31 Jul", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=360&h=200&fit=crop&auto=format" },
  { id: "o4", title: "Hammam for 2 — 15% Off", providerId: "ws2", provider: "Serenity Ladies Spa", expiry: "20 Jul", image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=360&h=200&fit=crop&auto=format" },
];

const NOTIFICATIONS = [
  { id: "n1", title: "Special offer from Al-Salam Beauty", body: "20% off your next appointment this week!", time: "2h ago", dot: "bg-accent", targetView: "provider-profile" as View, targetProviderId: "wbs1", forPersonal: true },
  { id: "n2", title: "Noura Spa replied to your review", body: "Thank you! We look forward to seeing you again.", time: "1d ago", dot: "bg-primary", targetView: "provider-profile" as View, targetProviderId: "ws1", forPersonal: true },
  { id: "n3", title: "Appointment reminder", body: "Farah Brow Studio tomorrow at 2:00 PM", time: "1d ago", dot: "bg-primary/60", targetView: "my-appointments" as View, targetProviderId: null, forPersonal: true },
  { id: "n4", title: "New booking request", body: "Noura Al-Hamad requested Nail Gel Set on Fri 20 Jun at 10:00 AM", time: "30m ago", dot: "bg-accent", targetView: "business-bookings" as View, targetProviderId: null, forPersonal: false },
  { id: "n5", title: "Booking confirmed", body: "Reem Al-Rashidi confirmed her Blow Dry & Style appointment", time: "2h ago", dot: "bg-primary", targetView: "business-bookings" as View, targetProviderId: null, forPersonal: false },
  { id: "n6", title: "New review received", body: "A client left you a 5-star review. Keep up the great work!", time: "1d ago", dot: "bg-primary/60", targetView: "provider-dashboard" as View, targetProviderId: null, forPersonal: false },
];

const NOW = new Date();
const DAY_NAMES_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const TODAY_IDX = NOW.getDay();

const REVENUE_DATA = [
  { day: "Sun", revenue: 140, dayIdx: 0 },
  { day: "Mon", revenue: 85, dayIdx: 1 },
  { day: "Tue", revenue: 120, dayIdx: 2 },
  { day: "Wed", revenue: 95, dayIdx: 3 },
  { day: "Thu", revenue: 160, dayIdx: 4 },
  { day: "Fri", revenue: 210, dayIdx: 5 },
  { day: "Sat", revenue: 185, dayIdx: 6 },
];
const TODAY_REVENUE = REVENUE_DATA.find((d) => d.dayIdx === TODAY_IDX)?.revenue ?? 140;

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const PORTFOLIO_IMAGES = [
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=600&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=600&fit=crop&auto=format",
];

const REGIONS = ["All", "Salmiya", "Kuwait City", "Hawalli", "Rumaithiya", "Jabriya", "Mishref"];

const SCHEDULE_BY_DAY: Record<number, CalendarAppt[]> = {
  0: [],
  1: [
    { id: "d1a1", time: "9:00", client: "Reem A.", service: "Blow Dry & Style", duration: "45 min", price: "12 KWD", date: "Mon, 15 Jun 2026", type: "appointment" },
    { id: "d1a2", time: "11:00", client: "Sara M.", service: "Full Highlights", duration: "2 hr", price: "35 KWD", date: "Mon, 15 Jun 2026", type: "appointment" },
    { id: "d1a3", time: "14:00", client: "Lulwa K.", service: "Nail Gel Set", duration: "1 hr", price: "18 KWD", date: "Mon, 15 Jun 2026", type: "appointment" },
    { id: "d1a4", time: "16:00", client: "Noura H.", service: "Keratin Treatment", duration: "3 hr", price: "55 KWD", date: "Mon, 15 Jun 2026", type: "appointment" },
  ],
  2: [
    { id: "d2a1", time: "10:00", client: "Dina R.", service: "Manicure & Pedicure", duration: "1.5 hr", price: "22 KWD", date: "Tue, 16 Jun 2026", type: "appointment" },
    { id: "d2a2", time: "13:00", client: "Fatima J.", service: "Brow Lamination", duration: "45 min", price: "15 KWD", date: "Tue, 16 Jun 2026", type: "appointment" },
  ],
  3: [
    { id: "d3a1", time: "9:00", client: "Sara M.", service: "Keratin Treatment", duration: "3 hr", price: "55 KWD", date: "Wed, 17 Jun 2026", type: "appointment" },
    { id: "d3a2", time: "14:00", client: "Mariam S.", service: "Blow Dry & Style", duration: "45 min", price: "12 KWD", date: "Wed, 17 Jun 2026", type: "appointment" },
  ],
  4: [
    { id: "d4a1", time: "10:00", client: "Reem A.", service: "Nail Gel Set", duration: "1 hr", price: "18 KWD", date: "Thu, 18 Jun 2026", type: "appointment" },
    { id: "d4a2", time: "15:00", client: "Lulwa K.", service: "Full Highlights", duration: "2 hr", price: "35 KWD", date: "Thu, 18 Jun 2026", type: "appointment" },
    { id: "d4a3", time: "17:00", client: "Noura H.", service: "Blow Dry & Style", duration: "45 min", price: "12 KWD", date: "Thu, 18 Jun 2026", type: "appointment" },
  ],
  5: [],
  6: [
    { id: "d6a1", time: "11:00", client: "Fatima J.", service: "Manicure & Pedicure", duration: "1.5 hr", price: "22 KWD", date: "Sat, 20 Jun 2026", type: "appointment" },
    { id: "d6a2", time: "13:00", client: "Dina R.", service: "Blow Dry & Style", duration: "45 min", price: "12 KWD", date: "Sat, 20 Jun 2026", type: "appointment" },
  ],
};

const INIT_SERVICES: ServiceItem[] = [
  { id: "s1", name: "Classic Haircut", duration: "30 min", price: "4", description: "A clean, precise haircut using scissors and clippers.", group: "Haircuts", active: true },
  { id: "s2", name: "Fade & Style", duration: "40 min", price: "5", description: "Skin or taper fade with your choice of style.", group: "Haircuts", active: true },
  { id: "s3", name: "Kids Cut", duration: "20 min", price: "3", description: "Gentle haircut for children under 12.", group: "Haircuts", active: true },
  { id: "s4", name: "Beard Trim", duration: "20 min", price: "3", description: "Shape and trim your beard to perfection.", group: "Beard & Shaving", active: true },
  { id: "s5", name: "Hot Towel Shave", duration: "30 min", price: "5", description: "Traditional straight razor shave with hot towel.", group: "Beard & Shaving", active: true },
  { id: "s6", name: "Full Groom Package", duration: "1 hr", price: "9", description: "Haircut + beard trim + hot towel — the complete experience.", group: "Packages", active: true },
  { id: "s7", name: "Color & Style", duration: "1 hr", price: "12", description: "Hair coloring with professional-grade dye and styling.", group: "Haircuts", active: false },
];

function getNextDays(count: number) {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i);
    return { label: i === 0 ? "Today" : DAY_NAMES_SHORT[d.getDay()], date: d.getDate(), month: d.getMonth(), year: d.getFullYear(), dayIdx: d.getDay() };
  });
}

function getMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<View>("splash");
  const [accountType, setAccountType] = useState<AccountType>("personal");
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [history, setHistory] = useState<View[]>([]);
  const [activeTab, setActiveTab] = useState<"home" | "bookings" | "calendar" | "profile">("home");
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [signupType, setSignupType] = useState<AccountType>("personal");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [gender, setGender] = useState<Gender>("women");
  const [selectedCategory, setSelectedCategory] = useState<{ key: string; label: string } | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [revenueDetailDay, setRevenueDetailDay] = useState<string>("Fri");
  const [services, setServices] = useState<ServiceItem[]>(INIT_SERVICES);

  const isAuthenticated = view !== "splash" && view !== "login" && view !== "signup" && view !== "forgot-password";
  const activeAccount = accounts.find((a) => a.active) ?? accounts[0];
  const days = getNextDays(14);
  const ROOT_VIEWS: View[] = ["client-home", "provider-dashboard", "settings", "my-appointments", "business-bookings", "provider-calendar"];
  const isRootView = ROOT_VIEWS.includes(view);
  const isHome = view === "client-home" || view === "provider-dashboard";

  // Booked slots for personal account (prevent double booking)
  const personalBookedSlots = bookingRequests
    .filter((r) => r.status === "pending" || r.status === "confirmed")
    .map((r) => ({ dateIdx: r.dateIdx, time: r.time }));

  function navigate(v: View) {
    setHistory((h) => [...h, view]);
    setView(v);
    if (v === "client-home" || v === "provider-dashboard") setActiveTab("home");
    if (v === "my-appointments" || v === "business-bookings") setActiveTab("bookings");
    if (v === "provider-calendar") setActiveTab("calendar");
    if (v === "settings") setActiveTab("profile");
    setShowNotifPopup(false);
  }
  function goBack() { const prev = history[history.length - 1]; if (prev) { setHistory((h) => h.slice(0, -1)); setView(prev); } }
  function openProvider(p: Provider) { setSelectedProvider(p); navigate("provider-profile"); }
  function openOfferBooking(providerId: string) { const p = ALL_PROVIDERS.find((x) => x.id === providerId); if (!p) return; setSelectedProvider(p); navigate("booking-flow"); }
  function toggleFavorite(id: string) { setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]); }
  function switchAccount(id: string) { const acc = accounts.find((a) => a.id === id); if (!acc || acc.active) return; setAccounts((prev) => prev.map((a) => ({ ...a, active: a.id === id }))); setAccountType(acc.type); navigate(acc.type === "personal" ? "client-home" : "provider-dashboard"); }
  function confirmBooking() {
    if (!selectedProvider || !selectedTime) return;
    const dayData = days[selectedDate];
    setBookingRequests((prev) => [...prev, { id: `req-${Date.now()}`, providerId: selectedProvider.id, providerName: selectedProvider.name, providerLocation: selectedProvider.location, service: selectedProvider.services[0]?.name ?? "", date: `${dayData.label}, ${dayData.date} ${MONTH_NAMES[dayData.month].slice(0, 3)} ${dayData.year}`, dateIdx: dayData.dayIdx, time: selectedTime, price: selectedProvider.services[0]?.price ?? "", status: "pending" }]);
    navigate("my-appointments");
  }
  function handleNotifClick(n: typeof NOTIFICATIONS[0]) {
    setShowNotifPopup(false);
    if (n.targetProviderId) { const p = ALL_PROVIDERS.find((x) => x.id === n.targetProviderId); if (p) { setSelectedProvider(p); navigate("provider-profile"); return; } }
    navigate(n.targetView);
  }
  function addReview(review: UserReview) { setUserReviews((prev) => [...prev, review]); }

  return (
    <div className="min-h-screen bg-foreground/5 flex items-center justify-center" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="relative bg-background w-full max-w-[430px] min-h-screen flex flex-col overflow-hidden shadow-2xl">
        {/* Top bar */}
        {isAuthenticated && (
          <div className="flex items-center justify-between px-5 pt-10 pb-2 flex-shrink-0">
            {!isRootView ? <button onClick={goBack} className="p-1.5 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft size={20} /></button> : <span className="text-xl text-primary" style={{ fontFamily: '"tgl30sansserifthinMed","Josefin Sans",sans-serif', letterSpacing: "0.05em", fontWeight: 500 }}>Ehjezly</span>}
            {isHome && (
              <div className="relative">
                <button onClick={() => setShowNotifPopup((v) => !v)} className="p-2 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors relative">
                  <Bell size={18} /><span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent border border-background" />
                </button>
                {showNotifPopup && (
                  <div className="absolute right-0 top-11 z-50 w-72 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between"><span className="text-sm font-bold text-foreground">Notifications</span><button onClick={() => setShowNotifPopup(false)} className="text-muted-foreground"><X size={14} /></button></div>
                    {NOTIFICATIONS.filter((n) => accountType === "personal" ? n.forPersonal : !n.forPersonal).map((n) => (
                      <button key={n.id} onClick={() => handleNotifClick(n)} className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border last:border-0 text-left">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.dot}`} />
                        <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-foreground leading-tight">{n.title}</p><p className="text-xs text-muted-foreground mt-0.5 leading-tight">{n.body}</p><p className="text-[10px] text-muted-foreground mt-1">{n.time}</p></div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }} className="flex-1 overflow-y-auto pb-24" style={{ scrollbarWidth: "none" }} onClick={() => showNotifPopup && setShowNotifPopup(false)}>
          {view === "splash" && <SplashScreen onStart={() => navigate("login")} />}
          {view === "login" && <LoginScreen email={loginEmail} setEmail={setLoginEmail} password={loginPassword} setPassword={setLoginPassword} accountType={accountType} setAccountType={setAccountType} onLogin={(type) => { setAccountType(type); setAccounts((prev) => prev.map((a) => ({ ...a, active: a.type === type && (type === "personal" ? a.email === "reem@gmail.com" : a.email === "burak@gmail.com") }))); navigate(type === "personal" ? "client-home" : "provider-dashboard"); }} onSignup={() => navigate("signup")} onForgot={() => navigate("forgot-password")} accounts={accounts} />}
          {view === "signup" && <SignupScreen signupType={signupType} setSignupType={setSignupType} onComplete={(name, email, phone, type) => { const newAcc: Account = { id: `acc-${Date.now()}`, name, email, phone, type, avatar: name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(), active: true }; setAccounts((prev) => [...prev.map((a) => ({ ...a, active: false })), newAcc]); setAccountType(type); navigate(type === "personal" ? "client-home" : "provider-dashboard"); }} onBack={goBack} />}
          {view === "forgot-password" && <ForgotPasswordPage onBack={goBack} />}
          {view === "client-home" && <ClientHome gender={gender} setGender={setGender} onCategory={(cat) => { setSelectedCategory(cat); navigate("category-results"); }} onSearch={() => navigate("search-results")} onProvider={openProvider} onOfferBook={openOfferBooking} accountName={activeAccount.name} />}
          {view === "search-results" && <SearchResults onProvider={openProvider} favorites={favorites} />}
          {view === "category-results" && selectedCategory && <CategoryResults category={selectedCategory} gender={gender} onProvider={openProvider} />}
          {view === "provider-profile" && selectedProvider && <ProviderProfile provider={selectedProvider} favorites={favorites} onToggleFavorite={toggleFavorite} onBook={() => navigate("booking-flow")} userReviews={userReviews.filter((r) => r.providerId === selectedProvider.id)} onAddReview={addReview} />}
          {view === "booking-flow" && selectedProvider && <BookingFlow provider={selectedProvider} accountType={accountType} days={days} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} bookedSlots={personalBookedSlots} onConfirm={confirmBooking} />}
          {view === "my-appointments" && <MyAppointments bookingRequests={bookingRequests} onSearch={() => navigate("search-results")} onProvider={openProvider} onCancelRequest={(id) => setBookingRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "cancelled" } : r))} onAddReview={addReview} />}
          {view === "business-bookings" && <BusinessBookings bookingRequests={bookingRequests} onAccept={(id) => setBookingRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "confirmed" } : r))} onReject={(id) => setBookingRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected" } : r))} />}
          {view === "provider-dashboard" && <ProviderDashboard accountName={activeAccount.name} onCalendar={() => navigate("provider-calendar")} onRevenueDay={(day) => { setRevenueDetailDay(day); navigate("revenue-detail"); }} />}
          {view === "provider-calendar" && <ProviderCalendar accountType={accountType} bookingRequests={bookingRequests} onProvider={openProvider} />}
          {view === "service-setup" && <ServiceSetup services={services} setServices={setServices} />}
          {view === "business-profile" && <BusinessProfileEditor />}
          {view === "settings" && <SettingsScreen accounts={accounts} activeAccount={activeAccount} accountType={accountType} onSwitchAccount={switchAccount} onAddAccount={() => navigate("login")} onEditAccount={() => navigate("edit-account")} onServiceSetup={() => navigate("service-setup")} onBusinessProfile={() => navigate("business-profile")} onPrivacy={() => navigate("privacy")} onAboutUs={() => navigate("about-us")} onGiftCards={() => navigate("gift-cards")} onInviteFriends={() => navigate("invite-friends")} onFavorites={() => navigate("favorites")} onRevenue={() => navigate("revenue-detail")} onLogout={() => { setView("splash"); setHistory([]); }} />}
          {view === "edit-account" && <EditAccount account={activeAccount} onSave={(u) => { setAccounts((prev) => prev.map((a) => a.id === u.id ? u : a)); goBack(); }} />}
          {view === "privacy" && <PrivacyPage />}
          {view === "about-us" && <AboutUsPage />}
          {view === "gift-cards" && <GiftCardsPage />}
          {view === "invite-friends" && <InviteFriendsPage />}
          {view === "favorites" && <FavoritesPage favorites={favorites} onProvider={openProvider} onToggleFavorite={toggleFavorite} />}
          {view === "revenue-detail" && <RevenueDetailPage selectedDay={revenueDetailDay} onBack={goBack} onDaySelect={setRevenueDetailDay} />}
        </motion.div>

        {isAuthenticated && <div className="absolute bottom-0 left-0 right-0 z-40"><BottomNav activeTab={activeTab} onTab={(tab) => { setActiveTab(tab); if (tab === "home") navigate(accountType === "personal" ? "client-home" : "provider-dashboard"); if (tab === "bookings") navigate(accountType === "personal" ? "my-appointments" : "business-bookings"); if (tab === "calendar") navigate("provider-calendar"); if (tab === "profile") navigate("settings"); }} /></div>}
      </div>
    </div>
  );
}

// ── Splash — logo only, auto-transitions to login after 3 s ──────────────────
function SplashScreen({ onStart }: { onStart: () => void }) {
  const [exiting, setExiting] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(onStart, 600);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#1B1324" }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background glow blobs */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 340, height: 340, background: "radial-gradient(circle, rgba(107,33,168,0.45) 0%, transparent 70%)", top: -60, right: -80 }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: 260, height: 260, background: "radial-gradient(circle, rgba(248,205,66,0.18) 0%, transparent 70%)", bottom: 80, left: -60 }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, delay: 0.3, ease: "easeOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: 180, height: 180, background: "radial-gradient(circle, rgba(157,78,221,0.3) 0%, transparent 70%)", bottom: 200, right: 20 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      />

      {/* Center content */}
      <div className="flex flex-col items-center gap-6 relative z-10 px-8">
        {/* Wordmark — letters animate in one by one */}
        <div className="flex flex-col items-center gap-2">
          <div style={{ display: "flex", fontFamily: '"tgl30sansserifthinMed", "Josefin Sans", sans-serif', fontWeight: 500, fontSize: "4.2rem", letterSpacing: "0.1em", lineHeight: 1, color: "#F3EDF8" }}>
            {"Ehjezly".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {char}
              </motion.span>
            ))}
          </div>
          {/* Animated underline */}
          <motion.div
            className="h-px origin-center"
            style={{ width: "6rem", background: "linear-gradient(90deg, transparent, #F8CD42, transparent)" }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.7, ease: "easeOut" }}
          />
        </div>

        {/* Tagline */}
        <motion.p
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: "rgba(243,237,248,0.45)", fontFamily: "Inter, sans-serif", letterSpacing: "0.25em" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Beauty &amp; Wellness · Kuwait
        </motion.p>

        {/* Pill badges */}
        <motion.div
          className="flex gap-3 mt-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {["Salons", "Spas", "Trainers", "Therapy"].map((label) => (
            <span
              key={label}
              className="px-3 py-1 rounded-full text-[10px] font-semibold"
              style={{ background: "rgba(107,33,168,0.25)", color: "rgba(243,237,248,0.7)", border: "1px solid rgba(107,33,168,0.4)", fontFamily: "Inter, sans-serif" }}
            >
              {label}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom loading dots */}
      <motion.div
        className="absolute bottom-16 flex gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// ── Login (with validation + email keyboard) ──────────────────────────────────
function LoginScreen({ email, setEmail, password, setPassword, accountType, setAccountType, onLogin, onSignup, onForgot, accounts }: { email: string; setEmail: (v: string) => void; password: string; setPassword: (v: string) => void; accountType: AccountType; setAccountType: (v: AccountType) => void; onLogin: (type: AccountType) => void; onSignup: () => void; onForgot: () => void; accounts: Account[] }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  function submit() {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "This field is required";
    if (!password) e.password = "This field is required";
    if (!Object.keys(e).length) {
      // Validate against known accounts
      const matched = accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
      if (!matched || password !== "1234") {
        e.password = "Incorrect email or password";
      } else {
        onLogin(matched.type);
        return;
      }
    }
    setErrors(e);
  }
  return (
    <div className="flex flex-col min-h-screen px-6 pt-16 pb-8">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-primary mb-1" style={{ fontFamily: "Inter, sans-serif", fontStyle: "normal" }}>Welcome back</h1>
        <p className="text-muted-foreground text-sm">Sign in to your account</p>
      </div>
      <div className="flex gap-1 mb-8 bg-muted rounded-2xl p-1">{(["personal", "business"] as AccountType[]).map((t) => <button key={t} onClick={() => setAccountType(t)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${accountType === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t === "personal" ? "Personal" : "Business"}</button>)}</div>
      <div className="flex flex-col gap-4 mb-2">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Email or Phone</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="reem@gmail.com" type="text" inputMode="email" autoComplete="email" autoCapitalize="none" className={`w-full px-4 py-3.5 rounded-xl bg-muted border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm ${errors.email ? "border-destructive" : "border-border"}`} />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`w-full px-4 py-3.5 rounded-xl bg-muted border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm ${errors.password ? "border-destructive" : "border-border"}`} />
          {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
        </div>
        <button onClick={onForgot} className="text-right text-xs text-primary font-semibold">Forgot password?</button>
      </div>
      <button onClick={submit} className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-opacity mb-4 mt-4">Sign In</button>
      <p className="text-center text-sm text-muted-foreground">{"Don't have an account? "}<button onClick={onSignup} className="text-primary font-bold">Create one</button></p>
    </div>
  );
}

// ── Signup (with validation) ──────────────────────────────────────────────────
function SignupScreen({ signupType, setSignupType, onComplete, onBack }: { signupType: AccountType; setSignupType: (v: AccountType) => void; onComplete: (name: string, email: string, phone: string, type: AccountType) => void; onBack: () => void }) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const personalFields = [{ key: "name", label: "Full Name", placeholder: "Reem Al-Rashidi", type: "text" }, { key: "email", label: "Email", placeholder: "reem@gmail.com", type: "text", inputMode: "email" as React.HTMLAttributes<HTMLInputElement>["inputMode"] }, { key: "phone", label: "Phone", placeholder: "+965 9XXX XXXX", type: "tel" }, { key: "password", label: "Password", placeholder: "••••••••", type: "password" }];
  const bizFields = [{ key: "bname", label: "Business Name", placeholder: "Al-Salam Beauty", type: "text" }, { key: "email", label: "Business Email", placeholder: "contact@business.kw", type: "text", inputMode: "email" as React.HTMLAttributes<HTMLInputElement>["inputMode"] }, { key: "phone", label: "Phone", placeholder: "+965 9XXX XXXX", type: "tel" }, { key: "category", label: "Category", placeholder: "Hair & Nails", type: "text" }, { key: "password", label: "Password", placeholder: "••••••••", type: "password" }];
  const fields = signupType === "personal" ? personalFields : bizFields;
  function submit() {
    const e: Record<string, string> = {};
    fields.forEach((f) => { if (!vals[f.key]?.trim()) e[f.key] = "Required"; });
    setErrors(e);
    if (!Object.keys(e).length) {
      const name = signupType === "personal" ? vals.name : vals.bname;
      onComplete(name, vals.email, vals.phone, signupType);
    }
  }
  return (
    <div className="flex flex-col min-h-screen px-6 pt-10 pb-8">
      <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground mb-8 self-start"><ChevronLeft size={18} /><span className="text-sm">Back</span></button>
      <h1 className="text-4xl font-bold text-primary mb-1" style={{ fontFamily: "Inter, sans-serif", fontStyle: "normal" }}>Create account</h1>
      <p className="text-muted-foreground text-sm mb-8">{"Join Kuwait's beauty marketplace"}</p>
      <div className="flex gap-1 mb-6 bg-muted rounded-2xl p-1">{(["personal", "business"] as AccountType[]).map((t) => <button key={t} onClick={() => setSignupType(t)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${signupType === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t === "personal" ? "Personal" : "Business"}</button>)}</div>
      <div className="flex flex-col gap-3 mb-6">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">{f.label}</label>
            <input type={f.type} inputMode={f.inputMode} value={vals[f.key] ?? ""} onChange={(e) => setVals((p) => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className={`w-full px-4 py-3.5 rounded-xl bg-muted border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm ${errors[f.key] ? "border-destructive" : "border-border"}`} />
            {errors[f.key] && <p className="text-xs text-destructive mt-1">This field is required</p>}
          </div>
        ))}
      </div>
      <button onClick={submit} className="w-full py-4 rounded-2xl bg-accent text-accent-foreground font-bold text-base hover:opacity-90 transition-opacity">Create Account</button>
    </div>
  );
}

// ── Forgot Password ───────────────────────────────────────────────────────────
function ForgotPasswordPage({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  function submit() { if (!email.trim()) { setError("Please enter your email or phone"); return; } setSent(true); }
  if (sent) return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-6"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 300 }}>
          <Check size={36} className="text-primary" />
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-foreground mb-2">Check your inbox</h1>
        <p className="text-muted-foreground mb-6">We sent a password reset link to<br /><span className="font-semibold text-foreground">{email}</span></p>
        <button onClick={onBack} className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity">Back to Sign In</button>
      </motion.div>
    </div>
  );
  return (
    <div className="flex flex-col min-h-screen px-6 pt-10 pb-8">
      <button onClick={onBack} className="flex items-center gap-1 text-muted-foreground mb-8 self-start"><ChevronLeft size={18} /><span className="text-sm">Back</span></button>
      <h1 className="text-4xl font-bold text-primary mb-2" style={{ fontFamily: "Inter, sans-serif", fontStyle: "normal" }}>Reset password</h1>
      <p className="text-muted-foreground text-sm mb-8">{"Enter your email or phone and we'll send you a reset link."}</p>
      <div className="mb-6">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Email or Phone</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="reem@gmail.com" type="text" inputMode="email" autoCapitalize="none" className={`w-full px-4 py-3.5 rounded-xl bg-muted border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm ${error ? "border-destructive" : "border-border"}`} />
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
      <button onClick={submit} className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:opacity-90 transition-opacity">Send Reset Link</button>
    </div>
  );
}

// ── Client Home ───────────────────────────────────────────────────────────────
function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function ClientHome({ gender, setGender, onCategory, onSearch, onProvider, onOfferBook, accountName }: { gender: Gender; setGender: (g: Gender) => void; onCategory: (cat: { key: string; label: string }) => void; onSearch: () => void; onProvider: (p: Provider) => void; onOfferBook: (id: string) => void; accountName: string }) {
  const firstName = accountName.split(" ")[0];
  const categories = gender === "men" ? MEN_CATEGORIES : WOMEN_CATEGORIES;
  const nearby = ALL_PROVIDERS.filter((p) => p.gender === gender).slice(0, 3);
  return (
    <div className="flex flex-col px-5 pt-2 pb-4 gap-6">
      <div><p className="text-sm text-muted-foreground">{getTimeGreeting()},</p><h1 className="text-2xl font-bold text-foreground">{firstName} ✨</h1></div>
      <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3.5 shadow-sm cursor-pointer" onClick={onSearch}><Search size={17} className="text-muted-foreground flex-shrink-0" /><span className="text-muted-foreground text-sm">Search salons, spas, treatments…</span></div>
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Special Offers</h2>
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {SPECIAL_OFFERS.map((offer) => (
            <div key={offer.id} onClick={() => onOfferBook(offer.providerId)} className="relative min-w-[240px] h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-primary cursor-pointer">
              <img src={offer.image} alt={offer.title} className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent" />
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <div className="flex items-center gap-1.5"><Tag size={11} className="text-accent" /><span className="text-[10px] font-bold text-accent uppercase tracking-widest">Offer</span></div>
                <div><p className="text-white font-bold text-sm leading-tight">{offer.title}</p><p className="text-white/70 text-xs mt-0.5">{offer.provider}</p><p className="text-white/50 text-[10px] mt-0.5">Expires {offer.expiry}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Categories</h2>
          <div className="flex gap-1 bg-muted rounded-xl p-0.5">{(["women", "men"] as Gender[]).map((g) => <button key={g} onClick={() => setGender(g)} className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${gender === g ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{g === "women" ? "Women" : "Men"}</button>)}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">{categories.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => onCategory({ key, label })} className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border bg-card border-border text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"><Icon size={20} className="text-primary" /><span className="text-[11px] font-semibold">{label}</span></button>)}</div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3"><h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nearby for {gender === "women" ? "Women" : "Men"}</h2><button onClick={onSearch} className="text-xs text-primary font-bold">See all</button></div>
        <div className="flex flex-col gap-3">{nearby.map((p, i) => <ProviderCard key={p.id} provider={p} onClick={() => onProvider(p)} index={i} />)}</div>
      </div>
    </div>
  );
}

function ProviderCard({ provider: p, onClick, index = 0 }: { provider: Provider; onClick: () => void; index?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07, duration: 0.4 }} onClick={onClick} className="flex gap-3 bg-card border border-border rounded-2xl p-3 cursor-pointer hover:border-primary/40 transition-colors active:scale-[0.98]">
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted"><img src={p.image} alt={p.name} className="w-full h-full object-cover" /></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2"><h3 className="font-bold text-foreground text-sm">{p.name}</h3><span className="text-xs font-bold text-primary whitespace-nowrap">{p.price}</span></div>
        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{p.categoryKey}</p>
        <div className="flex items-center gap-3 mt-1.5"><span className="flex items-center gap-1 text-xs font-medium"><Star size={11} className="fill-[#F8CD42] text-[#F8CD42]" />{p.rating}</span><span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin size={11} />{p.location}</span><span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={11} />{p.distanceKm} km</span></div>
      </div>
    </motion.div>
  );
}

// ── Category Results ──────────────────────────────────────────────────────────
function CategoryResults({ category, gender, onProvider }: { category: { key: string; label: string }; gender: Gender; onProvider: (p: Provider) => void }) {
  const providers = ALL_PROVIDERS.filter((p) => p.categoryKey === category.key && p.gender === gender);
  return (
    <div className="flex flex-col px-5 pt-2 pb-4 gap-5">
      <div><h1 className="text-2xl font-bold text-foreground">{category.label}</h1><p className="text-muted-foreground text-sm mt-0.5">{gender === "women" ? "Women" : "Men"} · Kuwait</p></div>
      {providers.length === 0 ? <p className="text-center text-muted-foreground text-sm py-20">No providers found.</p> : (
        <div className="flex flex-col gap-3">
          {providers.map((p) => (
            <div key={p.id} onClick={() => onProvider(p)} className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 transition-colors">
              <div className="h-36 bg-muted overflow-hidden"><img src={p.image} alt={p.name} className="w-full h-full object-cover" /></div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2"><h3 className="font-bold text-foreground">{p.name}</h3><span className="text-sm font-bold text-primary whitespace-nowrap">from {p.price}</span></div>
                <p className="text-xs text-muted-foreground mt-0.5">{p.bio.slice(0, 60)}…</p>
                <div className="flex items-center gap-4 mt-2"><span className="flex items-center gap-1 text-xs font-medium"><Star size={11} className="fill-[#F8CD42] text-[#F8CD42]" />{p.rating} ({p.reviews})</span><span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin size={11} />{p.location}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Search Results (gender filter + price sort toggle) ────────────────────────
function SearchResults({ onProvider, favorites }: { onProvider: (p: Provider) => void; favorites: string[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("rating");
  const [priceDir, setPriceDir] = useState<"asc" | "desc">("asc");
  const [region, setRegion] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState<"all" | "women" | "men">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [favOnly, setFavOnly] = useState(false);
  const allCats = ["All", "barber", "spa", "beautySalon", "personalTrainer", "therapist"];
  const catLabels: Record<string, string> = { barber: "Barber", spa: "Spa", beautySalon: "Beauty", personalTrainer: "Trainer", therapist: "Therapist" };
  const filtered = ALL_PROVIDERS.filter((p) => {
    const q = query.toLowerCase();
    return (!q || p.name.toLowerCase().includes(q) || p.categoryKey.includes(q) || p.location.toLowerCase().includes(q))
      && (region === "All" || p.region === region)
      && (catFilter === "All" || p.categoryKey === catFilter)
      && (genderFilter === "all" || p.gender === genderFilter)
      && (!favOnly || favorites.includes(p.id));
  }).sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "price") return priceDir === "asc" ? a.priceValue - b.priceValue : b.priceValue - a.priceValue;
    return a.distanceKm - b.distanceKm;
  });
  return (
    <div className="flex flex-col px-5 pt-2 pb-4 gap-4">
      <div><h1 className="text-2xl font-bold text-foreground">Search</h1><p className="text-muted-foreground text-sm mt-0.5">{filtered.length} providers</p></div>
      <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3 shadow-sm"><Search size={17} className="text-muted-foreground flex-shrink-0" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, category, area…" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" /></div>
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setSort("rating")} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${sort === "rating" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>Top Rated</button>
        <button onClick={() => { if (sort === "price") setPriceDir((d) => d === "asc" ? "desc" : "asc"); else setSort("price"); }} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${sort === "price" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>
          Price {sort === "price" ? (priceDir === "asc" ? "↑" : "↓") : "↕"}
        </button>
        <button onClick={() => setSort("distance")} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${sort === "distance" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>Nearest</button>
        <button onClick={() => setFavOnly((v) => !v)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${favOnly ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}><Heart size={11} />Fav</button>
        <button onClick={() => setShowFilters((v) => !v)} className={`ml-auto p-2 rounded-xl border transition-all ${showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground"}`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg></button>
      </div>
      {showFilters && (
        <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
          <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Gender</p><div className="flex gap-2">{(["all", "women", "men"] as const).map((g) => <button key={g} onClick={() => setGenderFilter(g)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all capitalize ${genderFilter === g ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border-border"}`}>{g === "all" ? "All" : g}</button>)}</div></div>
          <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Category</p><div className="flex gap-2 flex-wrap">{allCats.map((c) => <button key={c} onClick={() => setCatFilter(c)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${catFilter === c ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border-border"}`}>{c === "All" ? "All" : catLabels[c]}</button>)}</div></div>
          <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Region</p><div className="flex gap-2 flex-wrap">{REGIONS.map((r) => <button key={r} onClick={() => setRegion(r)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${region === r ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-foreground border-border"}`}>{r}</button>)}</div></div>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {filtered.map((p) => (
          <div key={p.id} onClick={() => onProvider(p)} className="bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 transition-colors">
            <div className="h-32 bg-muted overflow-hidden"><img src={p.image} alt={p.name} className="w-full h-full object-cover" /></div>
            <div className="p-3.5">
              <div className="flex items-start justify-between gap-2"><h3 className="font-bold text-foreground text-sm">{p.name}</h3><span className="text-sm font-bold text-primary whitespace-nowrap">from {p.price}</span></div>
              <div className="flex items-center gap-3 mt-1.5"><span className="flex items-center gap-1 text-xs font-medium"><Star size={11} className="fill-[#F8CD42] text-[#F8CD42]" />{p.rating} ({p.reviews})</span><span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin size={11} />{p.location}</span>{favorites.includes(p.id) && <Heart size={11} className="ml-auto fill-primary text-primary" />}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-12">No providers match your search.</p>}
      </div>
    </div>
  );
}

// ── Provider Profile ──────────────────────────────────────────────────────────
function ProviderProfile({ provider: p, favorites, onToggleFavorite, onBook, userReviews, onAddReview }: { provider: Provider; favorites: string[]; onToggleFavorite: (id: string) => void; onBook: () => void; userReviews: UserReview[]; onAddReview: (r: UserReview) => void }) {
  const [tab, setTab] = useState<"services" | "portfolio" | "reviews">("services");
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [showReview, setShowReview] = useState(false);
  const isFav = favorites.includes(p.id);
  const defaultReviews = [
    { name: "Noura H.", date: "Jun 2026", rating: 5, text: "Absolutely stunning results. The staff is so welcoming and professional." },
    { name: "Sara A.", date: "May 2026", rating: 5, text: "Best experience I have had. Will definitely be back!" },
  ];
  const allReviews = [...defaultReviews, ...userReviews.map((r) => ({ name: r.reviewerName, date: r.date, rating: r.rating, text: r.text }))];
  return (
    <div className="flex flex-col pb-6">
      <div className="relative h-56 bg-muted"><img src={p.image} alt={p.name} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" /><button onClick={() => onToggleFavorite(p.id)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-card/90 border border-border flex items-center justify-center hover:bg-card transition-colors"><Heart size={16} className={isFav ? "fill-primary text-primary" : "text-muted-foreground"} /></button></div>
      <div className="px-5 -mt-8 relative z-10">
        <div className="bg-card border border-border rounded-3xl p-4 mb-4 shadow-sm">
          <div className="flex items-start justify-between mb-2"><div><h1 className="text-xl font-bold text-foreground">{p.name}</h1><p className="text-sm text-muted-foreground capitalize">{p.categoryKey}</p></div><div className="flex items-center gap-1 bg-muted rounded-xl px-2.5 py-1.5"><Star size={12} className="fill-[#F8CD42] text-[#F8CD42]" /><span className="text-sm font-bold text-foreground">{p.rating}</span><span className="text-xs text-muted-foreground">({p.reviews})</span></div></div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.bio}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><MapPin size={12} />{p.location}</span><span className="flex items-center gap-1"><Clock size={12} />9 AM – 9 PM</span></div>
        </div>
        <div className="flex gap-1 bg-muted rounded-2xl p-1 mb-4">{(["services", "portfolio", "reviews"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t}</button>)}</div>
        {tab === "services" && <div className="flex flex-col gap-2">{p.services.map((s) => <div key={s.name} className="flex items-center justify-between bg-card border border-border rounded-2xl px-4 py-3"><div><p className="text-sm font-semibold text-foreground">{s.name}</p><p className="text-xs text-muted-foreground mt-0.5">{s.duration}</p></div><div className="flex items-center gap-3"><span className="text-sm font-bold text-primary">{s.price}</span><button onClick={onBook} className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">Book</button></div></div>)}</div>}
        {tab === "portfolio" && <div className="grid grid-cols-3 gap-2">{PORTFOLIO_IMAGES.map((img, i) => <button key={i} onClick={() => setViewerIndex(i)} className="aspect-square rounded-2xl overflow-hidden bg-muted"><img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" /></button>)}</div>}
        {tab === "reviews" && (
          <div className="flex flex-col gap-3">
            <button onClick={() => setShowReview(true)} className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-primary/30 text-primary text-sm font-bold hover:bg-primary/5 transition-colors"><Star size={14} />Write a Review</button>
            {allReviews.map((r, i) => <div key={i} className="bg-card border border-border rounded-2xl p-4"><div className="flex items-center justify-between mb-2"><span className="font-bold text-sm text-foreground">{r.name}</span><span className="text-xs text-muted-foreground">{r.date}</span></div><div className="flex mb-2">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={12} className="fill-[#F8CD42] text-[#F8CD42]" />)}</div><p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p></div>)}
          </div>
        )}
      </div>
      {viewerIndex !== null && (
        <div className="absolute inset-0 z-50 bg-[#1B1324] flex flex-col">
          <div className="flex items-center justify-between px-5 pt-12 pb-4"><button onClick={() => setViewerIndex(null)} className="p-2 rounded-full bg-white/10 text-white"><X size={18} /></button><span className="text-white/60 text-sm">{viewerIndex + 1} / {PORTFOLIO_IMAGES.length}</span></div>
          <div className="flex-1 flex items-center justify-center px-4"><img src={PORTFOLIO_IMAGES[viewerIndex]} alt={`Portfolio ${viewerIndex + 1}`} className="w-full max-h-full object-contain rounded-2xl" /></div>
          <div className="flex items-center justify-between px-8 pb-16 pt-6">
            <button onClick={() => setViewerIndex((i) => (i! > 0 ? i! - 1 : PORTFOLIO_IMAGES.length - 1))} className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"><ChevronLeft size={20} /></button>
            <div className="flex gap-1.5">{PORTFOLIO_IMAGES.map((_, i) => <div key={i} className={`h-1.5 rounded-full transition-all ${i === viewerIndex ? "bg-[#F8CD42] w-4" : "bg-white/30 w-1.5"}`} />)}</div>
            <button onClick={() => setViewerIndex((i) => (i! < PORTFOLIO_IMAGES.length - 1 ? i! + 1 : 0))} className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"><ChevronRight size={20} /></button>
          </div>
        </div>
      )}
      {showReview && <WriteReviewSheet providerId={p.id} providerName={p.name} onClose={() => setShowReview(false)} onSubmit={onAddReview} />}
    </div>
  );
}

function WriteReviewSheet({ providerId, providerName, onClose, onSubmit }: { providerId: string; providerName: string; onClose: () => void; onSubmit: (r: UserReview) => void }) {
  const [rating, setRating] = useState(0); const [hovered, setHovered] = useState(0); const [text, setText] = useState(""); const [submitted, setSubmitted] = useState(false);
  function submit() { if (!rating) return; onSubmit({ id: `rev-${Date.now()}`, providerId, reviewerName: "Reem A.", rating, text, date: `${MONTH_NAMES[NOW.getMonth()].slice(0, 3)} ${NOW.getFullYear()}` }); setSubmitted(true); }
  if (submitted) return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end"><div className="absolute inset-0 bg-foreground/25 backdrop-blur-sm" onClick={onClose} /><div className="relative bg-card rounded-t-3xl border-t border-border px-5 pt-8 pb-12 z-10 text-center"><div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4"><Check size={28} className="text-primary" /></div><h2 className="text-lg font-bold text-foreground mb-1">Review Submitted!</h2><p className="text-sm text-muted-foreground mb-6">Thank you for sharing your experience.</p><button onClick={onClose} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm">Done</button></div></div>
  );
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end"><div className="absolute inset-0 bg-foreground/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-t-3xl border-t border-border px-5 pt-5 pb-10 z-10 shadow-2xl">
        <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-foreground">Write a Review</h2><button onClick={onClose} className="p-1.5 rounded-full bg-muted text-muted-foreground"><X size={16} /></button></div>
        <p className="text-sm text-muted-foreground mb-4">{providerName}</p>
        <div className="flex gap-2 mb-4 justify-center">{[1,2,3,4,5].map((s) => <button key={s} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(s)}><Star size={32} className={`transition-colors ${s <= (hovered || rating) ? "fill-[#F8CD42] text-[#F8CD42]" : "text-border"}`} /></button>)}</div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your experience…" rows={4} className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-none mb-4" />
        <button onClick={submit} disabled={!rating} className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40">Submit Review</button>
      </div>
    </div>
  );
}

// ── Booking Flow (time conflict check + "Send Request") ───────────────────────
function BookingFlow({ provider, accountType, days, selectedDate, setSelectedDate, selectedTime, setSelectedTime, bookedSlots, onConfirm }: { provider: Provider; accountType: AccountType; days: ReturnType<typeof getNextDays>; selectedDate: number; setSelectedDate: (v: number) => void; selectedTime: string | null; setSelectedTime: (v: string | null) => void; bookedSlots: { dateIdx: number; time: string }[]; onConfirm: () => void }) {
  const [sent, setSent] = useState(false);
  const dayData = days[selectedDate];
  const takenTimes = accountType === "personal" ? bookedSlots.filter((s) => s.dateIdx === dayData?.dayIdx).map((s) => s.time) : [];
  if (sent) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-6"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 300 }}>
          <Check size={36} className="text-primary" />
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-foreground mb-2">Request Sent!</h1>
        <p className="text-muted-foreground mb-1">Your booking request has been sent to</p>
        <p className="text-foreground font-bold mb-1">{provider.name}</p>
        <p className="text-primary font-bold mb-2">{dayData?.label}, {dayData?.date} {MONTH_NAMES[dayData?.month ?? NOW.getMonth()].slice(0,3)} {dayData?.year} · {selectedTime}</p>
        <div className="flex items-center gap-2 bg-[#F8CD42]/15 border border-[#F8CD42]/30 rounded-xl px-3 py-2 mb-8"><AlertCircle size={14} className="text-amber-600" /><span className="text-xs text-amber-700 font-medium">Awaiting provider confirmation</span></div>
        <button onClick={onConfirm} className="w-full py-4 rounded-2xl bg-accent text-accent-foreground font-bold hover:opacity-90 transition-opacity">View My Bookings</button>
      </motion.div>
    </div>
  );
  return (
    <div className="flex flex-col px-5 pt-2 pb-4 gap-6">
      <div><h1 className="text-2xl font-bold text-foreground">Select Date & Time</h1><p className="text-muted-foreground text-sm mt-0.5">{provider.name}</p></div>
      <div><h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Date</h2><div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>{days.map((d, i) => <button key={i} onClick={() => { setSelectedDate(i); setSelectedTime(null); }} className={`flex flex-col items-center min-w-[54px] py-3 rounded-2xl border transition-all ${selectedDate === i ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-primary/40"}`}><span className="text-[10px] font-semibold opacity-70">{d.label}</span><span className="text-lg font-bold mt-0.5">{d.date}</span></button>)}</div></div>
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Available Times</h2>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((t) => {
            const isTaken = takenTimes.includes(t);
            return <button key={t} onClick={() => !isTaken && setSelectedTime(t)} disabled={isTaken} className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${selectedTime === t ? "bg-accent text-accent-foreground border-accent" : isTaken ? "bg-muted/50 text-muted-foreground border-border opacity-40 cursor-not-allowed" : "bg-card text-foreground border-border hover:border-primary/40"}`}>{t}</button>;
          })}
        </div>
        {accountType === "personal" && takenTimes.length > 0 && <p className="text-xs text-muted-foreground mt-2">Gray slots are already booked</p>}
      </div>
      {selectedTime && (
        <div className="bg-card border border-border rounded-2xl p-4"><h3 className="text-sm font-bold text-foreground mb-3">Booking Summary</h3>
          <div className="flex flex-col gap-2 text-sm">
            <Row label="Provider" value={provider.name} /><Row label="Service" value={provider.services[0]?.name ?? ""} />
            <Row label="Date" value={`${dayData?.label}, ${dayData?.date} ${MONTH_NAMES[dayData?.month ?? NOW.getMonth()].slice(0,3)} ${dayData?.year}`} />
            <Row label="Time" value={selectedTime} />
            <div className="flex justify-between border-t border-border pt-2 mt-1"><span className="font-bold">Total</span><span className="font-bold text-primary">{provider.services[0]?.price}</span></div>
          </div>
        </div>
      )}
      <button onClick={() => selectedTime && setSent(true)} disabled={!selectedTime} className="w-full py-4 rounded-2xl bg-accent text-accent-foreground font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
        Send Booking Request
      </button>
    </div>
  );
}

// ── My Appointments (cancelled merged into Past) ──────────────────────────────
function MyAppointments({ bookingRequests, onSearch, onProvider, onCancelRequest, onAddReview }: { bookingRequests: BookingRequest[]; onSearch: () => void; onProvider: (p: Provider) => void; onCancelRequest: (id: string) => void; onAddReview: (r: UserReview) => void }) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [reviewTarget, setReviewTarget] = useState<{ id: string; name: string } | null>(null);
  const upcoming = bookingRequests.filter((r) => r.status === "pending" || r.status === "confirmed");
  const cancelledReqs = bookingRequests.filter((r) => r.status === "cancelled" || r.status === "rejected");
  const staticCompleted = [
    { providerId: "ws1", providerName: "Noura Spa & Wellness", service: "Aromatherapy", date: "Sat, 7 Jun 2026", time: "3:00 PM", price: "18 KWD", status: "completed", location: "Kuwait City" },
    { providerId: "wbs3", providerName: "Glow Skin Studio", service: "Hydra Facial", date: "Fri, 30 May 2026", time: "10:00 AM", price: "35 KWD", status: "completed", location: "Rumaithiya" },
  ];
  function openMap(location: string) { window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location + ', Kuwait')}`, "_blank"); }
  const statusColor = (s: string) => s === "confirmed" ? "bg-primary/10 text-primary" : s === "pending" ? "bg-[#F8CD42]/20 text-amber-700" : s === "cancelled" || s === "rejected" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground";
  return (
    <div className="flex flex-col px-5 pt-2 pb-4 gap-5">
      <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
      <div className="flex gap-1 bg-muted rounded-2xl p-1">
        {(["upcoming", "past"] as const).map((t) => (
          <motion.button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${tab === t ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`} whileTap={{ scale: 0.96 }}>{t}</motion.button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {tab === "upcoming" && upcoming.map((req, i) => (
          <motion.div key={req.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2"><div><button onClick={() => { const p = ALL_PROVIDERS.find((x) => x.id === req.providerId); if (p) onProvider(p); }} className="font-bold text-foreground text-sm text-left hover:text-primary transition-colors">{req.providerName}</button><p className="text-xs text-muted-foreground mt-0.5">{req.service}</p></div><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor(req.status)}`}>{req.status}</span></div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3"><span className="flex items-center gap-1"><CalendarDays size={11} />{req.date}</span><span className="flex items-center gap-1"><Clock size={11} />{req.time}</span><span className="ml-auto font-bold text-foreground">{req.price}</span></div>
            <div className="flex gap-2">
              <button onClick={() => openMap(req.providerLocation)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-semibold hover:text-primary transition-colors"><Navigation size={12} />Open in Maps</button>
              {req.status === "pending" && <button onClick={() => onCancelRequest(req.id)} className="flex-1 py-2 rounded-xl border border-destructive text-destructive text-xs font-semibold hover:bg-destructive/5 transition-colors">Cancel</button>}
            </div>
          </motion.div>
        ))}
        {tab === "upcoming" && upcoming.length === 0 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-muted-foreground text-sm py-8">No upcoming bookings</motion.p>}
        {tab === "upcoming" && (
          <button onClick={onSearch} className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-border text-muted-foreground text-sm hover:border-primary/40 hover:text-primary transition-colors">
            <Plus size={16} />Book new appointment
          </button>
        )}

        {tab === "past" && staticCompleted.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2"><div><button onClick={() => { const p = ALL_PROVIDERS.find((x) => x.id === item.providerId); if (p) onProvider(p); }} className="font-bold text-foreground text-sm text-left hover:text-primary transition-colors">{item.providerName}</button><p className="text-xs text-muted-foreground mt-0.5">{item.service}</p></div><span className="text-xs font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">completed</span></div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3"><span className="flex items-center gap-1"><CalendarDays size={11} />{item.date}</span><span className="flex items-center gap-1"><Clock size={11} />{item.time}</span><span className="ml-auto font-bold text-foreground">{item.price}</span></div>
            <div className="flex gap-2">
              <button onClick={() => openMap(item.location)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-semibold hover:text-primary transition-colors"><Navigation size={12} />Open in Maps</button>
              <button onClick={() => setReviewTarget({ id: item.providerId, name: item.providerName })} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-primary/30 text-primary text-xs font-bold hover:bg-primary/5 transition-colors"><Star size={11} />Review</button>
            </div>
          </motion.div>
        ))}
        {/* Cancelled/rejected also appear under Past */}
        {tab === "past" && cancelledReqs.map((req, i) => (
          <motion.div key={req.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (staticCompleted.length + i) * 0.05 }} className="bg-card border border-border rounded-2xl p-4 opacity-60">
            <div className="flex items-start justify-between mb-2"><div><h3 className="font-bold text-foreground text-sm">{req.providerName}</h3><p className="text-xs text-muted-foreground mt-0.5">{req.service}</p></div><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor(req.status)}`}>{req.status}</span></div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><CalendarDays size={11} />{req.date}</span><span className="flex items-center gap-1"><Clock size={11} />{req.time}</span><span className="ml-auto font-bold text-foreground">{req.price}</span></div>
          </motion.div>
        ))}
        {tab === "past" && staticCompleted.length === 0 && cancelledReqs.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No past bookings</p>}
      </div>
      {reviewTarget && <WriteReviewSheet providerId={reviewTarget.id} providerName={reviewTarget.name} onClose={() => setReviewTarget(null)} onSubmit={(r) => { onAddReview(r); setReviewTarget(null); }} />}
    </div>
  );
}

// ── Business Bookings (accept/reject) ─────────────────────────────────────────
function BusinessBookings({ bookingRequests, onAccept, onReject }: { bookingRequests: BookingRequest[]; onAccept: (id: string) => void; onReject: (id: string) => void }) {
  const [tab, setTab] = useState<"pending" | "confirmed" | "all">("pending");
  const [staticBookings, setStaticBookings] = useState([
    { id: "s1", client: "Reem Al-Rashidi", service: "Blow Dry & Style", date: "Thu, 19 Jun 2026", time: "11:00 AM", status: "confirmed" as "pending" | "confirmed" | "cancelled" | "rejected" },
    { id: "s2", client: "Sara Al-Mutairi", service: "Full Highlights", date: "Thu, 19 Jun 2026", time: "2:00 PM", status: "confirmed" as "pending" | "confirmed" | "cancelled" | "rejected" },
    { id: "s3", client: "Noura Al-Hamad", service: "Nail Gel Set", date: "Fri, 20 Jun 2026", time: "10:00 AM", status: "pending" as "pending" | "confirmed" | "cancelled" | "rejected" },
  ]);
  function handleAccept(id: string) {
    if (staticBookings.find((b) => b.id === id)) setStaticBookings((p) => p.map((b) => b.id === id ? { ...b, status: "confirmed" as const } : b));
    else onAccept(id);
  }
  function handleReject(id: string) {
    if (staticBookings.find((b) => b.id === id)) setStaticBookings((p) => p.map((b) => b.id === id ? { ...b, status: "rejected" as const } : b));
    else onReject(id);
  }
  const allBookings = [...bookingRequests.map((r) => ({ id: r.id, client: "Client", service: r.service, date: r.date, time: r.time, status: r.status as "pending" | "confirmed" | "cancelled" | "rejected" })), ...staticBookings];
  const displayedBookings = tab === "all" ? allBookings : allBookings.filter((b) => b.status === tab);
  const statusColor = (s: string) => s === "confirmed" ? "bg-primary/10 text-primary" : s === "pending" ? "bg-[#F8CD42]/20 text-amber-700" : "bg-muted text-muted-foreground";
  return (
    <div className="flex flex-col px-5 pt-2 pb-4 gap-5">
      <div><h1 className="text-2xl font-bold text-foreground">Bookings</h1><p className="text-sm text-muted-foreground mt-0.5">Manage client appointments</p></div>
      <div className="flex gap-1 bg-muted rounded-2xl p-1">{(["pending", "confirmed", "all"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t}</button>)}</div>
      <div className="flex flex-col gap-3">
        {displayedBookings.map((b) => (
          <div key={b.id} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2"><div><h3 className="font-bold text-foreground text-sm">{b.client}</h3><p className="text-xs text-muted-foreground mt-0.5">{b.service}</p></div><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor(b.status)}`}>{b.status}</span></div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3"><span className="flex items-center gap-1"><CalendarDays size={11} />{b.date}</span><span className="flex items-center gap-1"><Clock size={11} />{b.time}</span></div>
            {b.status === "pending" && (
              <div className="flex gap-2">
                <button onClick={() => handleAccept(b.id)} className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity">Accept</button>
                <button onClick={() => handleReject(b.id)} className="flex-1 py-2 rounded-xl border border-destructive text-destructive text-xs font-bold hover:bg-destructive/5 transition-colors">Reject</button>
              </div>
            )}
          </div>
        ))}
        {displayedBookings.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No {tab} bookings</p>}
      </div>
    </div>
  );
}

// ── Provider Dashboard (clickable chart, dynamic revenue) ─────────────────────
function ProviderDashboard({ accountName, onCalendar, onRevenueDay }: { accountName: string; onCalendar: () => void; onRevenueDay: (day: string) => void }) {
  const firstName = accountName.split(" ")[0];
  const todayRevStr = `${TODAY_REVENUE} KWD`;
  return (
    <div className="flex flex-col px-5 pt-2 pb-4 gap-6">
      <div><p className="text-sm text-muted-foreground">{getTimeGreeting()},</p><h1 className="text-2xl font-bold text-foreground">{firstName} 👋</h1></div>
      <div className="grid grid-cols-3 gap-2.5">
        {[{ value: "4", sub: "appts today", icon: CalendarDays }, { value: todayRevStr, sub: "today", icon: DollarSign }, { value: "31", sub: "clients/week", icon: Users }].map(({ value, sub, icon: Icon }, i) => <div key={i} className="bg-card border border-border rounded-2xl p-3 flex flex-col gap-1.5"><Icon size={16} className="text-primary" /><p className="text-sm font-bold text-foreground leading-tight">{value}</p><p className="text-[10px] text-muted-foreground leading-tight">{sub}</p></div>)}
      </div>
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1"><h2 className="text-sm font-bold text-foreground">Revenue — This Week</h2><div className="flex items-center gap-2"><span className="text-xs text-primary font-bold flex items-center gap-0.5"><TrendingUp size={12} />+18%</span><button onClick={() => onRevenueDay(REVENUE_DATA.find(d => d.dayIdx === TODAY_IDX)?.day ?? "Fri")} className="text-xs text-muted-foreground font-semibold hover:text-primary transition-colors">See all</button></div></div>
        <p className="text-xs text-muted-foreground mb-3">Tap a day dot for details</p>
        <ResponsiveContainer width="100%" height={110}>
          <AreaChart data={REVENUE_DATA} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}
            onClick={(data) => { if (data?.activePayload?.[0]) { const d = data.activePayload[0].payload; onRevenueDay(d.day); } }}>
            <defs><linearGradient id="dashRevGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6B21A8" stopOpacity={0.25} /><stop offset="100%" stopColor="#6B21A8" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#7C5C9E" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "#7C5C9E" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", fontSize: "11px", padding: "6px 10px" }} labelStyle={{ color: "var(--foreground)", fontWeight: 700, fontSize: "11px" }} formatter={(value: number) => [`${value} KWD`, ""]} cursor={{ stroke: "#6B21A8", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Area type="monotone" dataKey="revenue" stroke="#F8CD42" strokeWidth={2.5} fill="url(#dashRevGrad)" dot={{ r: 3, fill: "#F8CD42", stroke: "#6B21A8", strokeWidth: 1.5, cursor: "pointer" }} activeDot={{ r: 6, fill: "#F8CD42", stroke: "#6B21A8", strokeWidth: 2, cursor: "pointer" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div>
        <div className="flex items-center justify-between mb-3"><h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{"Today's Schedule"}</h2><button onClick={onCalendar} className="text-xs text-primary font-bold">Full calendar</button></div>
        <div className="flex flex-col gap-2">{SCHEDULE_BY_DAY[1].map((a) => <div key={a.id} className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3"><div className="flex flex-col items-end min-w-[52px]"><span className="text-xs font-bold text-primary">{a.time}:00</span><span className="text-[10px] text-muted-foreground">{a.duration}</span></div><div className="w-px h-8 bg-border flex-shrink-0" /><div className="flex-1 min-w-0"><p className="text-sm font-semibold text-foreground">{a.client}</p><p className="text-xs text-muted-foreground">{a.service}</p></div></div>)}</div>
      </div>
    </div>
  );
}

// Converts a duration string like "30 min", "1 hr", "1.5 hr", "2 hr" to minutes
function durationToMins(d: string): number {
  if (d.includes("hr")) {
    const n = parseFloat(d);
    return Math.round(n * 60);
  }
  return parseInt(d) || 30;
}

// ── Provider Calendar (week/month, proportional blocks, multi-client per hour) ─
function ProviderCalendar({ accountType, bookingRequests, onProvider }: { accountType: AccountType; bookingRequests: BookingRequest[]; onProvider: (p: Provider) => void }) {
  const [format, setFormat] = useState<CalFormat>("week");
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedAppt, setSelectedAppt] = useState<CalendarAppt | null>(null);
  const [showBreakSheet, setShowBreakSheet] = useState(false);
  const [showRescheduleSheet, setShowRescheduleSheet] = useState(false);
  const [breaks, setBreaks] = useState<Record<number, CalendarAppt[]>>({});
  const [cancelledIds, setCancelledIds] = useState<string[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [apptTimes, setApptTimes] = useState<Record<string, string>>({});
  const [offDays, setOffDays] = useState<number[]>([]);
  const SLOT_H = 56; // px per 60-minute row
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayBreaks = breaks[selectedDay] ?? [];

  // For personal accounts, convert their bookingRequests into CalendarAppt format
  // Filter by selectedDay (dateIdx is day of week: 0=Sun, 1=Mon, etc.)
  function to24hr(timeStr: string): string {
    const match = timeStr.match(/^(\d+):?(\d{0,2})\s*(AM|PM)$/i);
    if (!match) return timeStr;
    let [, h, m, period] = match;
    let hour = parseInt(h);
    const min = m || "00";
    if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
    return `${hour}:${min.padEnd(2, "0")}`;
  }

  const personalAppts: CalendarAppt[] = accountType === "personal"
    ? bookingRequests
        .filter((r) => (r.status === "pending" || r.status === "confirmed") && !cancelledIds.includes(r.id) && r.dateIdx === selectedDay)
        .map((r) => ({
          id: r.id,
          time: to24hr(r.time),
          client: r.providerName,
          service: r.service,
          duration: "1 hr",
          price: r.price,
          date: r.date,
          type: "appointment" as const,
        }))
    : [];

  const dayAppts: CalendarAppt[] = accountType === "personal"
    ? [...personalAppts, ...dayBreaks]
    : [
        ...(SCHEDULE_BY_DAY[selectedDay] ?? []).filter((a) => !cancelledIds.includes(a.id)).map((a) => ({ ...a, time: apptTimes[a.id] ?? a.time })),
        ...dayBreaks,
      ];
  function getColor(item: CalendarAppt) {
    if (item.type === "break") return "bg-muted/80 border-border text-muted-foreground";
    if (completedIds.includes(item.id)) return "bg-muted/60 border-border text-muted-foreground";
    return item.id.endsWith("2") || item.id.endsWith("4") ? "bg-[#F8CD42]/20 border-[#F8CD42]/50 text-amber-800" : "bg-primary/15 border-primary/30 text-primary";
  }
  const isOffDay = accountType === "business" && offDays.includes(selectedDay);
  const cYear = NOW.getFullYear(); const cMonth = NOW.getMonth();
  const { firstDay, daysInMonth } = getMonthGrid(cYear, cMonth);
  const monthCells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const today = new Date(); const todaySunday = new Date(today); todaySunday.setDate(today.getDate() - today.getDay());
  const weekDates = Array.from({ length: 7 }, (_, i) => { const d = new Date(todaySunday); d.setDate(todaySunday.getDate() + i); return d.getDate(); });

  // Build a map: startHour → items starting at that hour (for rendering)
  // Each item gets proportional height based on duration
  // Multiple items at same start time render side-by-side
  const START_HOUR = 8;
  const TOTAL_HOURS = 12;

  // Render the time grid with absolute positioning for proportional blocks
  function renderTimeGrid() {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="relative" style={{ height: SLOT_H * TOTAL_HOURS }}>
          {/* Hour grid lines */}
          {Array.from({ length: TOTAL_HOURS }, (_, i) => (
            <div key={i} className="absolute left-0 right-0 flex" style={{ top: i * SLOT_H, height: SLOT_H }}>
              <div className="w-12 flex-shrink-0 flex items-start justify-end pr-2 pt-1.5">
                <span className="text-[10px] text-muted-foreground font-medium">{START_HOUR + i}:00</span>
              </div>
              <div className="flex-1 border-l border-b border-border last:border-b-0" />
            </div>
          ))}

          {/* Appointment blocks */}
          <div className="absolute left-12 right-0 top-0 bottom-0">
            {dayAppts.map((item) => {
              const [hourStr, minStr] = item.time.split(":");
              const startHour = parseInt(hourStr);
              const startMin = parseInt(minStr ?? "0");
              const mins = durationToMins(item.duration || "60 min");
              const topPx = (startHour - START_HOUR) * SLOT_H + (startMin / 60) * SLOT_H;
              const heightPx = Math.max((mins / 60) * SLOT_H - 4, 24);
              // Find concurrent items to determine column layout
              const concurrent = dayAppts.filter((other) => {
                if (other.id === item.id) return false;
                const [oh, om] = other.time.split(":").map(Number);
                const otherStart = oh * 60 + om;
                const itemStart = startHour * 60 + startMin;
                const otherEnd = otherStart + durationToMins(other.duration || "60 min");
                const itemEnd = itemStart + mins;
                return otherStart < itemEnd && itemStart < otherEnd;
              });
              const colIdx = dayAppts.filter((other) => {
                const [oh, om] = other.time.split(":").map(Number);
                const otherStart = oh * 60 + om;
                const itemStart = startHour * 60 + startMin;
                const otherEnd = otherStart + durationToMins(other.duration || "60 min");
                const itemEnd = itemStart + mins;
                return otherStart < itemEnd && itemStart < otherEnd && dayAppts.indexOf(other) < dayAppts.indexOf(item);
              }).length;
              const totalCols = concurrent.length + 1;
              const widthPct = 100 / totalCols;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedAppt(item)}
                  className={`absolute rounded-xl border px-2 py-1 text-xs font-semibold overflow-hidden text-left hover:opacity-80 transition-opacity ${getColor(item)}`}
                  style={{
                    top: topPx + 2,
                    height: heightPx,
                    left: `${colIdx * widthPct}%`,
                    width: `calc(${widthPct}% - 4px)`,
                  }}
                >
                  {item.type === "break" ? (
                    <span className="flex items-center gap-1"><Clock size={10} />Break · {item.duration}</span>
                  ) : (
                    <span>{completedIds.includes(item.id) ? "✓ " : ""}{item.client}<br /><span className="opacity-70 font-normal">{item.service}</span></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-5 pt-2 pb-4 gap-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Calendar</h1><p className="text-sm text-muted-foreground mt-0.5">{accountType === "personal" ? "Your upcoming appointments" : `${MONTH_NAMES[cMonth]} ${cYear}`}</p></div>
        <div className="flex gap-1">
          {accountType === "business" && <button onClick={() => setShowBreakSheet(true)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-muted border border-border text-muted-foreground text-xs font-bold hover:border-primary/40 transition-colors"><Plus size={12} />Break</button>}
          {accountType === "business" && <button onClick={() => setOffDays((prev) => prev.includes(selectedDay) ? prev.filter((d) => d !== selectedDay) : [...prev, selectedDay])} className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${isOffDay ? "bg-destructive/10 text-destructive border-destructive/30" : "bg-muted border-border text-muted-foreground hover:border-primary/40"}`}>{isOffDay ? "Mark On" : "Mark Off"}</button>}
        </div>
      </div>

      {/* Week / Month toggle only */}
      <div className="flex gap-1 bg-muted rounded-2xl p-1">
        {([["week", CalendarRange], ["month", LayoutGrid]] as [CalFormat, React.ElementType][]).map(([f, Icon]) => (
          <button key={f} onClick={() => setFormat(f)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold capitalize transition-all ${format === f ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            <Icon size={13} />{f}
          </button>
        ))}
      </div>

      {/* Day selector strip */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {dayLabels.map((d, i) => {
          const count = accountType === "personal"
            ? bookingRequests.filter((r) => (r.status === "pending" || r.status === "confirmed") && r.dateIdx === i).length
            : (SCHEDULE_BY_DAY[i] ?? []).length;
          const off = accountType === "business" && offDays.includes(i);
          return (
            <button key={d} onClick={() => setSelectedDay(i)} className={`flex flex-col items-center min-w-[44px] py-2.5 rounded-xl border relative transition-all ${selectedDay === i ? "bg-primary text-primary-foreground border-primary" : off ? "bg-muted/50 border-border text-muted-foreground opacity-50" : "bg-card border-border text-foreground hover:border-primary/40"}`}>
              <span className="text-[10px] font-bold opacity-70">{d}</span>
              <span className="text-sm font-bold mt-0.5">{weekDates[i]}</span>
              {count > 0 && !off && <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${selectedDay === i ? "bg-accent" : "bg-primary"}`} />}
            </button>
          );
        })}
      </div>

      {/* WEEK VIEW — proportional blocks, multi-client per hour */}
      {format === "week" && (
        isOffDay
          ? <div className="bg-card border border-border rounded-2xl py-12 text-center"><p className="text-muted-foreground text-sm font-medium">Day Off</p></div>
          : dayAppts.length === 0
            ? <div className="bg-card border border-border rounded-2xl py-12 text-center"><p className="text-muted-foreground text-sm">{accountType === "personal" ? "No appointments on this day" : "No appointments scheduled"}</p></div>
            : renderTimeGrid()
      )}

      {/* MONTH VIEW */}
      {format === "month" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} className="py-2 text-center text-xs font-bold text-muted-foreground">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {monthCells.map((day, i) => {
              if (!day) return <div key={i} className="h-10 border-b border-r border-border last:border-r-0" />;
              const cellDate = new Date(cYear, cMonth, day);
              const dIdx = cellDate.getDay();
              const hasAppts = accountType === "business" && (SCHEDULE_BY_DAY[dIdx] ?? []).length > 0;
              const isToday = day === NOW.getDate() && cMonth === NOW.getMonth();
              const isOff = accountType === "business" && offDays.includes(dIdx);
              return (
                <button key={i} onClick={() => { setSelectedDay(dIdx); setFormat("week"); }}
                  className={`h-10 flex flex-col items-center justify-center border-b border-r border-border last:border-r-0 relative transition-colors hover:bg-muted/50 ${isOff ? "bg-muted/30" : ""}`}>
                  <span className={`text-xs font-semibold ${isToday ? "w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center" : isOff ? "text-muted-foreground/50" : "text-foreground"}`}>{day}</span>
                  {hasAppts && !isOff && <div className="w-1 h-1 rounded-full bg-accent absolute bottom-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointment detail sheet */}
      {selectedAppt && !showRescheduleSheet && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-foreground/25 backdrop-blur-sm" onClick={() => setSelectedAppt(null)} />
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="relative bg-card rounded-t-3xl border-t border-border px-5 pt-5 pb-10 z-10 shadow-2xl">
            <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-bold text-foreground">{selectedAppt.type === "break" ? "Break Block" : "Appointment Details"}</h2><button onClick={() => setSelectedAppt(null)} className="p-1.5 rounded-full bg-muted text-muted-foreground"><X size={16} /></button></div>
            {selectedAppt.type === "break" ? <div className="flex flex-col gap-3 mb-5"><Row label="Time" value={selectedAppt.time} /><Row label="Duration" value={selectedAppt.duration} /></div> : <div className="flex flex-col gap-3 mb-5">{accountType === "personal" ? (<div className="flex justify-between text-sm"><span className="text-muted-foreground">Provider</span><button onClick={() => { const p = ALL_PROVIDERS.find((x) => x.name === selectedAppt.client); if (p) { onProvider(p); setSelectedAppt(null); } }} className="font-semibold text-primary hover:underline">{selectedAppt.client}</button></div>) : <Row label="Client" value={selectedAppt.client} />}<Row label="Service" value={selectedAppt.service} /><Row label="Date" value={selectedAppt.date} /><Row label="Time" value={apptTimes[selectedAppt.id] ?? selectedAppt.time} /><Row label="Duration" value={selectedAppt.duration} /><div className="flex justify-between border-t border-border pt-3 mt-1"><span className="font-bold text-sm">Total</span><span className="font-bold text-primary text-sm">{selectedAppt.price}</span></div></div>}
            {accountType === "personal" && selectedAppt.type === "appointment" && <div className="flex flex-col gap-2"><button onClick={() => setShowRescheduleSheet(true)} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity">Reschedule</button><button onClick={() => { setCancelledIds((p) => [...p, selectedAppt.id]); setSelectedAppt(null); }} className="w-full py-3.5 rounded-2xl border border-destructive text-destructive font-bold text-sm hover:bg-destructive/5 transition-colors">Cancel Booking</button></div>}
            {accountType === "business" && selectedAppt.type === "appointment" && <div className="flex flex-col gap-2"><button onClick={() => { if (!completedIds.includes(selectedAppt.id)) setCompletedIds((p) => [...p, selectedAppt.id]); setSelectedAppt(null); }} disabled={completedIds.includes(selectedAppt.id)} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 disabled:opacity-50">{completedIds.includes(selectedAppt.id) ? "✓ Marked Complete" : "Mark Complete"}</button><button onClick={() => { setCancelledIds((p) => [...p, selectedAppt.id]); setSelectedAppt(null); }} className="w-full py-3.5 rounded-2xl border border-destructive text-destructive font-bold text-sm hover:bg-destructive/5">Cancel Appointment</button></div>}
            {selectedAppt.type === "break" && <button onClick={() => { setBreaks((p) => { const c = { ...p }; c[selectedDay] = (c[selectedDay] ?? []).filter((b) => b.id !== selectedAppt.id); return c; }); setSelectedAppt(null); }} className="w-full py-3.5 rounded-2xl border border-destructive text-destructive font-bold text-sm hover:bg-destructive/5">Remove Break</button>}
          </motion.div>
        </div>
      )}
      {showRescheduleSheet && selectedAppt && <RescheduleSheet appt={selectedAppt} onConfirm={(t) => { setApptTimes((p) => ({ ...p, [selectedAppt.id]: t })); setShowRescheduleSheet(false); setSelectedAppt(null); }} onClose={() => setShowRescheduleSheet(false)} />}
      {showBreakSheet && <AddBreakSheet onAdd={(b) => { setBreaks((prev) => ({ ...prev, [selectedDay]: [...(prev[selectedDay] ?? []), b] })); setShowBreakSheet(false); }} onClose={() => setShowBreakSheet(false)} />}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{value}</span></div>; }

function RescheduleSheet({ appt, onConfirm, onClose }: { appt: CalendarAppt; onConfirm: (t: string) => void; onClose: () => void }) {
  const [newTime, setNewTime] = useState<string | null>(null); const [dayIdx, setDayIdx] = useState(0); const days = getNextDays(7);
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end"><div className="absolute inset-0 bg-foreground/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-t-3xl border-t border-border px-5 pt-5 pb-10 z-10 shadow-2xl">
        <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-foreground">Reschedule</h2><button onClick={onClose} className="p-1.5 rounded-full bg-muted text-muted-foreground"><X size={16} /></button></div>
        <p className="text-sm text-muted-foreground mb-4">{appt.service} · {appt.client}</p>
        <div className="mb-4"><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">New Date</p><div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>{days.map((d, i) => <button key={i} onClick={() => setDayIdx(i)} className={`flex flex-col items-center min-w-[50px] py-2.5 rounded-xl border transition-all ${dayIdx === i ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border text-foreground"}`}><span className="text-[10px] font-semibold opacity-70">{d.label}</span><span className="text-base font-bold">{d.date}</span></button>)}</div></div>
        <div className="mb-5"><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">New Time</p><div className="grid grid-cols-4 gap-2">{TIME_SLOTS.map((t) => <button key={t} onClick={() => setNewTime(t)} className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${newTime === t ? "bg-accent text-accent-foreground border-accent" : "bg-muted border-border text-foreground"}`}>{t}</button>)}</div></div>
        <button onClick={() => newTime && onConfirm(`${days[dayIdx].date} ${MONTH_NAMES[days[dayIdx].month].slice(0,3)} ${days[dayIdx].year} · ${newTime}`)} disabled={!newTime} className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-bold text-sm hover:opacity-90 disabled:opacity-40">Confirm Reschedule</button>
      </div>
    </div>
  );
}

function AddBreakSheet({ onAdd, onClose }: { onAdd: (b: CalendarAppt) => void; onClose: () => void }) {
  const [bt, setBt] = useState("12:00"); const [bd, setBd] = useState("30 min");
  const times = ["8:00","9:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
  const durations = ["15 min","30 min","45 min","1 hr","1.5 hr","2 hr"];
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end"><div className="absolute inset-0 bg-foreground/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-t-3xl border-t border-border px-5 pt-5 pb-10 z-10 shadow-2xl">
        <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-bold text-foreground">Add Break Block</h2><button onClick={onClose} className="p-1.5 rounded-full bg-muted text-muted-foreground"><X size={16} /></button></div>
        <div className="flex flex-col gap-4 mb-5">
          <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Start Time</p><div className="flex gap-2 flex-wrap">{times.map((t) => <button key={t} onClick={() => setBt(t)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${bt===t?"bg-primary text-primary-foreground border-primary":"bg-muted border-border text-foreground"}`}>{t}</button>)}</div></div>
          <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Duration</p><div className="flex gap-2 flex-wrap">{durations.map((d) => <button key={d} onClick={() => setBd(d)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${bd===d?"bg-primary text-primary-foreground border-primary":"bg-muted border-border text-foreground"}`}>{d}</button>)}</div></div>
        </div>
        <button onClick={() => onAdd({ id:`break-${Date.now()}`, time:bt, client:"", service:"", duration:bd, price:"", date:"", type:"break" })} className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-bold text-sm hover:opacity-90">Add Break</button>
      </div>
    </div>
  );
}

// ── Service Setup (groups + edit dialog) ──────────────────────────────────────
function ServiceSetup({ services, setServices }: { services: ServiceItem[]; setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>> }) {
  const [editTarget, setEditTarget] = useState<ServiceItem | null>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const groups = Array.from(new Set(services.map((s) => s.group)));
  function saveEdit(updated: ServiceItem) { setServices((prev) => prev.map((s) => s.id === updated.id ? updated : s)); setEditTarget(null); }
  function addService(newService: ServiceItem) { setServices((prev) => [...prev, newService]); setShowAddSheet(false); }
  return (
    <div className="flex flex-col px-5 pt-2 pb-4 gap-5">
      <div><h1 className="text-2xl font-bold text-foreground">Services</h1><p className="text-sm text-muted-foreground mt-0.5">Manage your service catalog</p></div>
      {groups.map((group) => (
        <div key={group}>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{group}</p>
          <div className="flex flex-col gap-2">
            {services.filter((s) => s.group === group).map((s) => (
              <div key={s.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0"><p className="font-semibold text-foreground text-sm">{s.name}</p><p className="text-xs text-muted-foreground mt-0.5">{s.duration} · {s.price} KWD</p>{s.description && <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">{s.description}</p>}</div>
                <button onClick={() => setServices((prev) => prev.map((item) => item.id === s.id ? { ...item, active: !item.active } : item))} className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${s.active ? "bg-primary" : "bg-muted"}`}><div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${s.active ? "left-6" : "left-1"}`} /></button>
                <button onClick={() => setEditTarget(s)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors flex-shrink-0"><Edit3 size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => setShowAddSheet(true)} className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-border text-muted-foreground text-sm hover:border-primary/40 hover:text-primary transition-colors"><Plus size={16} />Add new service</button>
      {editTarget && <ServiceEditSheet service={editTarget} groups={groups} onSave={saveEdit} onClose={() => setEditTarget(null)} />}
      {showAddSheet && <AddServiceSheet groups={groups} onAdd={addService} onClose={() => setShowAddSheet(false)} />}
    </div>
  );
}

function AddServiceSheet({ groups, onAdd, onClose }: { groups: string[]; onAdd: (s: ServiceItem) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("30 min");
  const [description, setDescription] = useState("");
  const [group, setGroup] = useState(groups[0] ?? "General");
  const [newGroup, setNewGroup] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  function submit() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Required";
    if (!price.trim()) e.price = "Required";
    setErrors(e);
    if (!Object.keys(e).length) {
      onAdd({ id: `svc-${Date.now()}`, name, price, duration, description, group: newGroup.trim() || group, active: true });
    }
  }
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-foreground/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-t-3xl border-t border-border px-5 pt-5 pb-10 z-10 shadow-2xl">
        <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-bold text-foreground">Add Service</h2><button onClick={onClose} className="p-1.5 rounded-full bg-muted text-muted-foreground"><X size={16} /></button></div>
        <div className="flex flex-col gap-4 mb-5">
          {[{ label: "Service Name", val: name, set: setName, err: errors.name }, { label: "Price (KWD)", val: price, set: setPrice, err: errors.price }, { label: "Duration", val: duration, set: setDuration }].map(({ label, val, set, err }) => (
            <div key={label}><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">{label}</label><input value={val} onChange={(e) => set(e.target.value)} className={`w-full px-4 py-3 rounded-xl bg-muted border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm ${err ? "border-destructive" : "border-border"}`} />{err && <p className="text-xs text-destructive mt-1">{err}</p>}</div>
          ))}
          <div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-none" /></div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Group</label>
            <div className="flex gap-2 flex-wrap mb-2">{groups.map((g) => <button key={g} onClick={() => { setGroup(g); setNewGroup(""); }} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${group === g && !newGroup ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border text-foreground"}`}>{g}</button>)}</div>
            <input value={newGroup} onChange={(e) => setNewGroup(e.target.value)} placeholder="Or create new group…" className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" />
          </div>
        </div>
        <button onClick={submit} className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-bold text-sm hover:opacity-90">Add Service</button>
      </div>
    </div>
  );
}

function ServiceEditSheet({ service, groups, onSave, onClose }: { service: ServiceItem; groups: string[]; onSave: (s: ServiceItem) => void; onClose: () => void }) {
  const [name, setName] = useState(service.name);
  const [price, setPrice] = useState(service.price);
  const [duration, setDuration] = useState(service.duration);
  const [description, setDescription] = useState(service.description);
  const [group, setGroup] = useState(service.group);
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end"><div className="absolute inset-0 bg-foreground/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-t-3xl border-t border-border px-5 pt-5 pb-10 z-10 shadow-2xl">
        <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-bold text-foreground">Edit Service</h2><button onClick={onClose} className="p-1.5 rounded-full bg-muted text-muted-foreground"><X size={16} /></button></div>
        <div className="flex flex-col gap-4 mb-5">
          {[{ label:"Service Name", val:name, set:setName }, { label:"Price (KWD)", val:price, set:setPrice }, { label:"Duration", val:duration, set:setDuration }].map(({ label, val, set }) => (
            <div key={label}><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">{label}</label><input value={val} onChange={(e) => set(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" /></div>
          ))}
          <div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-none" /></div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Group</label>
            <div className="flex gap-2 flex-wrap">{groups.map((g) => <button key={g} onClick={() => setGroup(g)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${group === g ? "bg-primary text-primary-foreground border-primary" : "bg-muted border-border text-foreground"}`}>{g}</button>)}</div>
          </div>
        </div>
        <button onClick={() => onSave({ ...service, name, price, duration, description, group })} className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-bold text-sm hover:opacity-90">Save Changes</button>
      </div>
    </div>
  );
}

// ── Business Profile Editor (Burak Barbershop) ────────────────────────────────
function BusinessProfileEditor() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [coverUrl, setCoverUrl] = useState("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=430&h=150&fit=crop&auto=format");
  const [fields, setFields] = useState({ name: "Burak Barbershop", category: "Barbershop", location: "Salmiya, Kuwait", phone: "+965 9876 5432", website: "burakbarbershop.kw", bio: "Kuwait's premier barbershop experience. Precision cuts, classic shaves, and modern grooming in a refined atmosphere." });
  const [hours, setHours] = useState([{ day: "Sat – Thu", hours: "9:00 AM – 10:00 PM" }, { day: "Fri", hours: "2:00 PM – 10:00 PM" }]);
  const [saved, setSaved] = useState(false);
  function handleCover(e: React.ChangeEvent<HTMLInputElement>) { const f = e.target.files?.[0]; if (f) setCoverUrl(URL.createObjectURL(f)); }
  function handleSave() { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  return (
    <div className="flex flex-col px-5 pt-2 pb-4 gap-5">
      <div><h1 className="text-2xl font-bold text-foreground">Business Profile</h1><p className="text-sm text-muted-foreground mt-0.5">How clients see you</p></div>
      <div className="relative h-36 bg-muted rounded-3xl overflow-hidden">
        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
        <button onClick={() => fileRef.current?.click()} className="absolute bottom-3 right-3 bg-card/90 text-foreground px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border border-border hover:bg-card transition-colors"><Edit3 size={12} />Edit cover</button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCover} />
      </div>
      <div className="flex flex-col gap-4">
        {(["name", "category", "location", "phone", "website"] as const).map((key) => (
          <div key={key}><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">{key === "name" ? "Business Name" : key.charAt(0).toUpperCase() + key.slice(1)}</label><input value={fields[key]} onChange={(e) => setFields((p) => ({ ...p, [key]: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" /></div>
        ))}
        <div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Bio</label><textarea value={fields.bio} onChange={(e) => setFields((p) => ({ ...p, bio: e.target.value }))} rows={3} className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-none" /></div>
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Working Hours</label>
          <div className="flex flex-col gap-2">
            {hours.map((h, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5">
                <input value={h.day} onChange={(e) => setHours((p) => p.map((x, j) => j === i ? { ...x, day: e.target.value } : x))} className="text-sm font-semibold text-foreground bg-transparent focus:outline-none w-24" />
                <span className="text-muted-foreground">·</span>
                <input value={h.hours} onChange={(e) => setHours((p) => p.map((x, j) => j === i ? { ...x, hours: e.target.value } : x))} className="text-sm text-muted-foreground bg-transparent focus:outline-none flex-1" />
              </div>
            ))}
            <button onClick={() => setHours((p) => [...p, { day: "New Day", hours: "9:00 AM – 6:00 PM" }])} className="flex items-center justify-center gap-1 py-2 rounded-xl border border-dashed border-border text-muted-foreground text-xs hover:border-primary/40 hover:text-primary transition-colors"><Plus size={12} />Add hours</button>
          </div>
        </div>
        <button onClick={handleSave} className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${saved ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:opacity-90"}`}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ── Settings (with revenue link) ──────────────────────────────────────────────
function SettingsScreen({ accounts, activeAccount, accountType, onSwitchAccount, onAddAccount, onEditAccount, onServiceSetup, onBusinessProfile, onPrivacy, onAboutUs, onGiftCards, onInviteFriends, onFavorites, onRevenue, onLogout }: { accounts: Account[]; activeAccount: Account; accountType: AccountType; onSwitchAccount: (id: string) => void; onAddAccount: () => void; onEditAccount: () => void; onServiceSetup: () => void; onBusinessProfile: () => void; onPrivacy: () => void; onAboutUs: () => void; onGiftCards: () => void; onInviteFriends: () => void; onFavorites: () => void; onRevenue: () => void; onLogout: () => void }) {
  return (
    <div className="flex flex-col px-5 pt-2 pb-4 gap-6">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      <button onClick={onEditAccount} className="bg-card border border-border rounded-3xl p-5 flex items-center gap-4 text-left hover:border-primary/40 transition-colors">
        {activeAccount.photoUrl ? <img src={activeAccount.photoUrl} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" alt="profile" /> : <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg flex-shrink-0">{activeAccount.avatar}</div>}
        <div className="flex-1 min-w-0"><p className="font-bold text-foreground">{activeAccount.name}</p><p className="text-sm text-muted-foreground">{activeAccount.email}</p><span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1.5 inline-block ${accountType === "personal" ? "bg-primary/10 text-primary" : "bg-[#F8CD42]/20 text-amber-800"}`}>{accountType}</span></div>
        <Edit3 size={15} className="text-muted-foreground flex-shrink-0" />
      </button>
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Accounts</p>
        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {accounts.map((acc) => <button key={acc.id} onClick={() => !acc.active && onSwitchAccount(acc.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 transition-colors ${acc.active ? "cursor-default" : "hover:bg-muted/50"}`}><div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">{acc.avatar}</div><div className="flex-1 text-left min-w-0"><p className="text-sm font-semibold text-foreground">{acc.name}</p><p className="text-xs text-muted-foreground capitalize">{acc.type}</p></div>{acc.active ? <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" /> : <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />}</button>)}
          <button onClick={onAddAccount} className="w-full flex items-center gap-3 px-4 py-3.5 text-primary hover:bg-muted/50 transition-colors"><div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0"><Plus size={15} className="text-muted-foreground" /></div><span className="text-sm font-semibold">Add Account</span></button>
        </div>
      </div>
      {accountType === "business" && (
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Business</p>
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {[{ label: "Business Profile", icon: Edit3, action: onBusinessProfile }, { label: "Services", icon: Sparkles, action: onServiceSetup }, { label: "Revenue & Analytics", icon: BarChart2, action: onRevenue }].map(({ label, icon: Icon, action }) => <button key={label} onClick={action} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"><Icon size={17} className="text-muted-foreground flex-shrink-0" /><span className="text-sm font-semibold text-foreground flex-1 text-left">{label}</span><ChevronRight size={15} className="text-muted-foreground" /></button>)}
          </div>
        </div>
      )}
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Preferences</p>
        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {[{ label:"Favorites", icon:Heart, action:onFavorites }, { label:"Gift Cards", icon:Gift, action:onGiftCards }, { label:"Invite Friends", icon:UserPlus, action:onInviteFriends }, { label:"Privacy", icon:Shield, action:onPrivacy }, { label:"About Us", icon:Info, action:onAboutUs }].map(({ label, icon: Icon, action }) => <button key={label} onClick={action} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"><Icon size={17} className="text-muted-foreground flex-shrink-0" /><span className="text-sm font-semibold text-foreground flex-1 text-left">{label}</span><ChevronRight size={15} className="text-muted-foreground" /></button>)}
        </div>
      </div>
      <button onClick={onLogout} className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-border text-destructive text-sm font-semibold hover:bg-destructive/5 transition-colors"><LogOut size={16} />Sign Out</button>
    </div>
  );
}

// ── Edit Account (photo change) ───────────────────────────────────────────────
function EditAccount({ account, onSave }: { account: Account; onSave: (u: Account) => void }) {
  const parts = account.name.split(" ");
  const [firstName, setFirstName] = useState(parts[0] ?? "");
  const [lastName, setLastName] = useState(parts.slice(1).join(" ") ?? "");
  const [email, setEmail] = useState(account.email);
  const [phone, setPhone] = useState(account.phone);
  const [photoUrl, setPhotoUrl] = useState<string | null>(account.photoUrl ?? null);
  const [showPwSheet, setShowPwSheet] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) { const f = e.target.files?.[0]; if (f) setPhotoUrl(URL.createObjectURL(f)); }
  return (
    <div className="flex flex-col px-5 pt-2 pb-4 gap-5">
      <div><h1 className="text-2xl font-bold text-foreground">Edit Account</h1><p className="text-sm text-muted-foreground mt-0.5">Update your personal details</p></div>
      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer" onClick={() => fileRef.current?.click()}>
          {photoUrl ? <img src={photoUrl} className="w-16 h-16 rounded-2xl object-cover" alt="profile" /> : <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">{account.avatar}</div>}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center border-2 border-background"><Camera size={11} className="text-accent-foreground" /></div>
        </div>
        <div><button onClick={() => fileRef.current?.click()} className="text-sm text-primary font-semibold">Change Photo</button><p className="text-xs text-muted-foreground mt-0.5">JPG or PNG, max 5MB</p></div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <div className="flex flex-col gap-4">
        {[{ label:"First Name", value:firstName, onChange:setFirstName }, { label:"Last Name", value:lastName, onChange:setLastName }, { label:"Phone Number", value:phone, onChange:setPhone }, { label:"Email Address", value:email, onChange:setEmail }].map(({ label, value, onChange }) => <div key={label}><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" /></div>)}
        <div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Password</label><button onClick={() => setShowPwSheet(true)} className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-left flex items-center justify-between hover:border-primary/40 transition-colors"><span className="text-muted-foreground">••••••••</span><span className="text-primary font-semibold text-xs">Change →</span></button></div>
      </div>
      <button onClick={() => onSave({ ...account, name: `${firstName} ${lastName}`.trim(), email, phone, photoUrl: photoUrl ?? undefined })} className="w-full py-4 rounded-2xl bg-accent text-accent-foreground font-bold text-sm hover:opacity-90 transition-opacity">Save Changes</button>
      {showPwSheet && <ChangePasswordSheet onClose={() => setShowPwSheet(false)} />}
    </div>
  );
}

function ChangePasswordSheet({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState(""); const [next, setNext] = useState(""); const [confirm, setConfirm] = useState(""); const [done, setDone] = useState(false);
  if (done) return <div className="absolute inset-0 z-50 flex flex-col justify-end"><div className="absolute inset-0 bg-foreground/25 backdrop-blur-sm" onClick={onClose} /><div className="relative bg-card rounded-t-3xl border-t border-border px-5 pt-8 pb-12 z-10 text-center"><div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto mb-4"><Check size={24} className="text-primary" /></div><h2 className="text-lg font-bold text-foreground mb-1">Password Updated</h2><p className="text-sm text-muted-foreground mb-6">Your password has been changed successfully.</p><button onClick={onClose} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm">Done</button></div></div>;
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end"><div className="absolute inset-0 bg-foreground/25 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-t-3xl border-t border-border px-5 pt-5 pb-10 z-10 shadow-2xl">
        <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-bold text-foreground">Change Password</h2><button onClick={onClose} className="p-1.5 rounded-full bg-muted text-muted-foreground"><X size={16} /></button></div>
        <div className="flex flex-col gap-4 mb-5">
          {[{ label:"Current Password", val:current, set:setCurrent }, { label:"New Password", val:next, set:setNext }, { label:"Confirm New Password", val:confirm, set:setConfirm }].map(({ label, val, set }) => <div key={label}><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">{label}</label><input type="password" value={val} onChange={(e) => set(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm" /></div>)}
          {next && confirm && next !== confirm && <p className="text-xs text-destructive -mt-2">Passwords do not match</p>}
        </div>
        <button onClick={() => current && next && next === confirm && setDone(true)} disabled={!current || !next || next !== confirm} className="w-full py-3.5 rounded-2xl bg-accent text-accent-foreground font-bold text-sm hover:opacity-90 disabled:opacity-40">Update Password</button>
      </div>
    </div>
  );
}

// ── Revenue Detail Page ───────────────────────────────────────────────────────
function RevenueDetailPage({ selectedDay, onBack, onDaySelect }: { selectedDay: string; onBack: () => void; onDaySelect: (d: string) => void }) {
  const [viewAll, setViewAll] = useState(false);
  const dayData = REVENUE_DATA.find((d) => d.day === selectedDay) ?? REVENUE_DATA[4];
  const clients = SCHEDULE_BY_DAY[dayData.dayIdx] ?? [];
  const displayDays = viewAll ? REVENUE_DATA : [dayData];
  return (
    <div className="flex flex-col px-5 pt-2 pb-4 gap-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-foreground">Revenue</h1><p className="text-sm text-muted-foreground mt-0.5">{viewAll ? "This Week" : selectedDay}</p></div>
        <button onClick={() => setViewAll((v) => !v)} className="text-xs text-primary font-bold">{viewAll ? "Day View" : "See All"}</button>
      </div>
      {!viewAll ? (
        <>
          <div className="bg-primary rounded-3xl p-6">
            <p className="text-primary-foreground/60 text-xs uppercase tracking-wider mb-1">Revenue — {selectedDay}</p>
            <p className="text-4xl font-bold text-white">{dayData.revenue} <span className="text-xl font-normal text-white/60">KWD</span></p>
            <p className="text-white/50 text-xs mt-2">{clients.length} appointments</p>
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Clients — {selectedDay}</p>
            {clients.length === 0 ? <div className="bg-card border border-border rounded-2xl py-8 text-center"><p className="text-muted-foreground text-sm">No appointments this day</p></div> : (
              <div className="flex flex-col gap-2">{clients.map((a) => <div key={a.id} className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center justify-between"><div><p className="text-sm font-semibold text-foreground">{a.client}</p><p className="text-xs text-muted-foreground">{a.service} · {a.time}:00 · {a.duration}</p></div><span className="text-sm font-bold text-primary">{a.price}</span></div>)}</div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-2xl p-4"><p className="text-xs text-muted-foreground mb-1">Total Week</p><p className="text-2xl font-bold text-primary">{REVENUE_DATA.reduce((s, d) => s + d.revenue, 0)} <span className="text-sm font-normal text-muted-foreground">KWD</span></p></div>
            <div className="bg-card border border-border rounded-2xl p-4"><p className="text-xs text-muted-foreground mb-1">Best Day</p><p className="text-2xl font-bold text-foreground">{REVENUE_DATA.reduce((best, d) => d.revenue > best.revenue ? d : best).day}</p></div>
          </div>
          <div className="flex flex-col gap-2">
            {REVENUE_DATA.map((d) => (
              <button key={d.day} onClick={() => { onDaySelect(d.day); setViewAll(false); }} className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center justify-between hover:border-primary/40 transition-colors">
                <div><p className="text-sm font-semibold text-foreground">{d.day}</p><p className="text-xs text-muted-foreground">{(SCHEDULE_BY_DAY[d.dayIdx] ?? []).length} clients</p></div>
                <div className="flex items-center gap-2">
                  <div className="h-2 rounded-full bg-primary/20 overflow-hidden w-20"><div className="h-full bg-primary rounded-full" style={{ width: `${(d.revenue / 220) * 100}%` }} /></div>
                  <span className="text-sm font-bold text-primary w-16 text-right">{d.revenue} KWD</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const curMonth = NOW.getMonth();
const curYear = NOW.getFullYear();

// ── Privacy / About / Gift / Invite / Favorites ───────────────────────────────
function PrivacyPage() {
  const sections = [{ title:"Data We Collect", body:"We collect information you provide when creating an account (name, email, phone) and booking data. We also collect device information and usage data to improve the app." }, { title:"How We Use Your Data", body:"Your data is used to process bookings, send reminders, personalize recommendations, and improve our services. We never sell your personal data to third parties." }, { title:"Data Sharing", body:"We share only the information necessary with service providers you book with. We may share anonymized data for analytics." }, { title:"Your Rights", body:"You have the right to access, correct, or delete your personal data at any time." }, { title:"Data Security", body:"We use industry-standard encryption (TLS/SSL) for data in transit and at rest." }];
  return (
    <div className="flex flex-col px-5 pt-2 pb-6 gap-5"><div><h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1><p className="text-sm text-muted-foreground mt-0.5">Last updated {MONTH_NAMES[curMonth]} {curYear}</p></div><div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3"><Shield size={18} className="text-primary flex-shrink-0 mt-0.5" /><p className="text-sm text-foreground leading-relaxed">Ehjezly is committed to protecting your privacy and handling your data with care.</p></div>{sections.map((s) => <div key={s.title} className="bg-card border border-border rounded-2xl p-4"><h3 className="font-bold text-foreground text-sm mb-2">{s.title}</h3><p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p></div>)}<div className="bg-card border border-border rounded-2xl p-4"><h3 className="font-bold text-foreground text-sm mb-3">Account Data</h3><button className="w-full py-3 rounded-xl border border-destructive text-destructive text-sm font-semibold hover:bg-destructive/5">Request Account Deletion</button></div><p className="text-xs text-muted-foreground text-center">Questions? privacy@ehjezly.kw</p></div>
  );
}

function AboutUsPage() {
  return (
    <div className="flex flex-col px-5 pt-2 pb-6 gap-5"><div><h1 className="text-2xl font-bold text-foreground">About Us</h1><p className="text-sm text-muted-foreground mt-0.5">Our story</p></div><div className="relative h-40 rounded-3xl overflow-hidden bg-primary"><img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=430&h=160&fit=crop&auto=format" alt="About" className="w-full h-full object-cover opacity-40" /><div className="absolute inset-0 flex items-center justify-center"><h2 className="text-4xl font-bold text-white" style={{ fontFamily:'"tgl30sansserifthinMed", "Josefin Sans", sans-serif', fontWeight: 500, letterSpacing: "0.08em" }}>Ehjezly</h2></div></div><div className="bg-card border border-border rounded-2xl p-5"><h3 className="font-bold text-foreground mb-3">Our Mission</h3><p className="text-sm text-muted-foreground leading-relaxed">{"Ehjezly — 'Book for me' in Arabic — was built to make beauty and wellness effortlessly accessible across Kuwait. We connect clients with the finest salons, spas, trainers, and therapists in one seamless platform."}</p></div><div className="bg-card border border-border rounded-2xl p-5"><h3 className="font-bold text-foreground mb-3">Why Ehjezly?</h3><div className="flex flex-col gap-3">{["Real-time availability — no phone calls","Verified providers with genuine reviews","Bilingual — Arabic & English","Secure booking for Kuwait's top wellness brands"].map((item) => <div key={item} className="flex items-start gap-2.5"><div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Check size={11} className="text-primary" /></div><p className="text-sm text-foreground">{item}</p></div>)}</div></div><div className="bg-card border border-border rounded-2xl p-5"><h3 className="font-bold text-foreground mb-3">Contact Us</h3><div className="flex flex-col gap-2 text-sm">{[["Email","hello@ehjezly.kw"],["WhatsApp","+965 1234 5678"],["Instagram","@ehjezly"],["Version","1.0.0 (Beta)"]].map(([k,v]) => <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className={k==="Email"?"font-medium text-primary":"font-medium"}>{v}</span></div>)}</div></div></div>
  );
}

function GiftCardsPage() {
  const amounts = [5,10,20,50]; const [selected,setSelected]=useState(20); const [recipient,setRecipient]=useState(""); const [message,setMessage]=useState(""); const [sent,setSent]=useState(false);
  if (sent) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 18 }}
        className="w-24 h-24 rounded-full bg-[#F8CD42]/20 border-2 border-[#F8CD42] flex items-center justify-center mb-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
        >
          <Gift size={38} className="text-[#F8CD42]" />
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
        <h1 className="text-2xl font-bold text-foreground mb-2">Gift Card Sent!</h1>
        <p className="text-muted-foreground mb-1">Your {selected} KWD gift card was sent to</p>
        <p className="text-primary font-bold mb-8">{recipient}</p>
        <button onClick={() => { setSent(false); setRecipient(""); setMessage(""); }} className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90">Send Another</button>
      </motion.div>
    </div>
  );
  return(
    <div className="flex flex-col px-5 pt-2 pb-4 gap-6"><div><h1 className="text-2xl font-bold text-foreground">Gift Cards</h1><p className="text-sm text-muted-foreground mt-0.5">Share the gift of wellness</p></div><div className="relative h-36 rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-[#9D4EDD]"><div className="absolute inset-0 flex flex-col justify-between p-5"><div className="flex items-center gap-2"><Sparkles size={20} className="text-[#F8CD42]"/><span className="text-white font-bold" style={{fontFamily:"Inter,sans-serif",fontSize:"1.2rem"}}>Ehjezly</span></div><div><p className="text-white/60 text-xs uppercase tracking-widest">Gift Card</p><p className="text-white text-3xl font-bold">{selected} KWD</p></div></div></div>
    <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Select Amount</p><div className="grid grid-cols-4 gap-2">{amounts.map((a)=><button key={a} onClick={()=>setSelected(a)} className={`py-3 rounded-2xl text-sm font-bold border transition-all ${selected===a?"bg-primary text-primary-foreground border-primary":"bg-card text-foreground border-border hover:border-primary/40"}`}>{a} KWD</button>)}</div></div>
    <div className="flex flex-col gap-4"><div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">{"Recipient's Email or Phone"}</label><input value={recipient} onChange={(e)=>setRecipient(e.target.value)} placeholder="noura@gmail.com" type="text" inputMode="email" className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"/></div><div><label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 block">Message (optional)</label><textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Treat yourself!" rows={3} className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-none"/></div></div>
    <button onClick={()=>recipient&&setSent(true)} disabled={!recipient} className="w-full py-4 rounded-2xl bg-accent text-accent-foreground font-bold text-base hover:opacity-90 disabled:opacity-40">Send Gift Card — {selected} KWD</button></div>
  );
}

function InviteFriendsPage() {
  const [copied,setCopied]=useState(false); const code="REEM2026";
  return(
    <div className="flex flex-col px-5 pt-2 pb-4 gap-6"><div><h1 className="text-2xl font-bold text-foreground">Invite Friends</h1><p className="text-sm text-muted-foreground mt-0.5">Share Ehjezly, earn rewards</p></div><div className="bg-primary rounded-3xl p-6 text-center"><UserPlus size={36} className="text-[#F8CD42] mx-auto mb-3"/><h2 className="text-white font-bold text-lg mb-1">Earn 2 KWD per friend</h2><p className="text-white/70 text-sm">{"For every friend who completes their first booking, you both earn 2 KWD."}</p></div>
    <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Your Referral Code</p><div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-3.5"><span className="flex-1 text-primary font-bold text-lg tracking-widest">{code}</span><button onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold">{copied?<><Check size={12}/>Copied!</>:<><Copy size={12}/>Copy</>}</button></div></div>
    <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Share Via</p><div className="flex flex-col gap-2">{[{label:"Share on WhatsApp",cls:"bg-green-500 text-white"},{label:"Share via SMS",cls:"bg-primary text-white"},{label:"Copy Invite Link",cls:"bg-muted text-foreground border border-border"}].map(({label,cls})=><button key={label} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold text-sm hover:opacity-90 ${cls}`}><Share2 size={18}/>{label}</button>)}</div></div>
    <div className="bg-card border border-border rounded-2xl p-4"><h3 className="font-bold text-foreground text-sm mb-3">Referral Stats</h3><div className="grid grid-cols-3 gap-3 text-center">{[{label:"Invited",value:"3"},{label:"Joined",value:"2"},{label:"Earned",value:"4 KWD"}].map(({label,value})=><div key={label}><p className="text-lg font-bold text-primary">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>)}</div></div></div>
  );
}

function FavoritesPage({ favorites, onProvider, onToggleFavorite }: { favorites: string[]; onProvider: (p: Provider) => void; onToggleFavorite: (id: string) => void }) {
  const favProviders = ALL_PROVIDERS.filter((p) => favorites.includes(p.id));
  return(
    <div className="flex flex-col px-5 pt-2 pb-4 gap-5"><div><h1 className="text-2xl font-bold text-foreground">Favorites</h1><p className="text-sm text-muted-foreground mt-0.5">{favProviders.length} saved</p></div>
    {favProviders.length===0?<div className="flex flex-col items-center justify-center py-20 text-center"><Heart size={40} className="text-border mb-4"/><p className="font-semibold text-foreground mb-1">No favorites yet</p><p className="text-sm text-muted-foreground">Tap the heart on any provider profile.</p></div>:(
      <div className="flex flex-col gap-3">{favProviders.map((p)=><div key={p.id} className="flex gap-3 bg-card border border-border rounded-2xl p-3"><div onClick={()=>onProvider(p)} className="flex-1 flex gap-3 cursor-pointer"><div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted"><img src={p.image} alt={p.name} className="w-full h-full object-cover"/></div><div className="flex-1 min-w-0"><h3 className="font-bold text-foreground text-sm">{p.name}</h3><p className="text-xs text-muted-foreground mt-0.5 capitalize">{p.categoryKey}</p><div className="flex items-center gap-3 mt-1.5"><span className="flex items-center gap-1 text-xs font-medium"><Star size={11} className="fill-[#F8CD42] text-[#F8CD42]"/>{p.rating}</span><span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin size={11}/>{p.location}</span></div></div></div><button onClick={()=>onToggleFavorite(p.id)} className="p-2 self-start text-primary hover:text-destructive transition-colors"><Heart size={16} className="fill-primary"/></button></div>)}</div>
    )}</div>
  );
}

// ── Bottom Nav ────────────────────────────────────────────────────────────────
function BottomNav({ activeTab, onTab }: { activeTab: "home"|"bookings"|"calendar"|"profile"; onTab: (tab: "home"|"bookings"|"calendar"|"profile") => void }) {
  const tabs = [{ key:"home" as const, label:"Home", icon:Home }, { key:"bookings" as const, label:"Bookings", icon:BookOpen }, { key:"calendar" as const, label:"Calendar", icon:CalendarDays }, { key:"profile" as const, label:"Profile", icon:User }];
  return(
    <div className="bg-card/95 backdrop-blur-md border-t border-border px-2 pb-8 pt-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      {tabs.map(({ key, label, icon: Icon }) => { const active = activeTab === key; return<button key={key} onClick={()=>onTab(key)} className="flex flex-col items-center gap-0.5 min-w-[60px] py-1 group"><div className={`p-2 rounded-xl transition-all ${active?"bg-primary/10":"group-hover:bg-muted"}`}><Icon size={20} className={active?"text-primary":"text-muted-foreground"} strokeWidth={active?2.5:1.8}/></div><span className={`text-[10px] font-bold ${active?"text-primary":"text-muted-foreground"}`}>{label}</span>{active&&<div className="w-1 h-1 rounded-full bg-accent"/>}</button>; })}
    </div>
  );
}

// ── Account Switcher Sheet ────────────────────────────────────────────────────
function AccountSwitcherSheet({ accounts, onSwitch, onClose, onAddAccount }: { accounts: Account[]; onSwitch: (id: string) => void; onClose: () => void; onAddAccount: () => void }) {
  return(
    <div className="absolute inset-0 z-50 flex flex-col justify-end"><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-foreground/25 backdrop-blur-sm" onClick={onClose}/>
      <motion.div initial={{ y: 120 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 280, damping: 30 }} className="relative bg-card rounded-t-3xl border-t border-border px-5 pt-5 pb-10 z-10 shadow-2xl">
        <div className="flex items-center justify-between mb-5"><h2 className="text-lg font-bold text-foreground">Switch Account</h2><button onClick={onClose} className="p-1.5 rounded-full bg-muted text-muted-foreground"><X size={16}/></button></div>
        <div className="flex flex-col gap-2 mb-4">{accounts.map((acc)=><button key={acc.id} onClick={()=>!acc.active&&onSwitch(acc.id)} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${acc.active?"border-primary bg-primary/5 cursor-default":"border-border hover:border-primary/40"}`}><div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">{acc.avatar}</div><div className="flex-1 text-left"><p className="text-sm font-bold text-foreground">{acc.name}</p><p className="text-xs text-muted-foreground capitalize">{acc.type} account</p></div>{acc.active&&<Check size={16} className="text-primary flex-shrink-0"/>}</button>)}</div>
        <button onClick={onAddAccount} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-border text-muted-foreground text-sm hover:border-primary/40 hover:text-primary transition-colors"><Plus size={16}/>Add another account</button>
      </motion.div>
    </div>
  );
}
