export interface SampleCreator {
    id: string;
    name: string;
    tag: string;
    bio: string;
    avatarUrl: string;
    coverUrl: string;
    resonanceScore: string;
    isVerified: boolean;
    persona: 'creator';
    balance: string;
}

export interface SampleMoment {
    id: string;
    type: 'flow' | 'vision';
    content: string | null;
    mediaAssets: { url: string; type: 'image' | 'video' }[];
    price: string | null;
    requiredTier: string | null;
    createdAt: Date;
    creatorId: string;
}

export const SAMPLE_CREATORS: SampleCreator[] = [
    {
        id: "sample-v1",
        name: "Valentina Noir",
        tag: "valentina-noir",
        bio: "Shadow performance art and the physicality of moonlight. Exploring the intersection of darkness and digital resonance.",
        avatarUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400",
        coverUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200",
        resonanceScore: "98.00",
        isVerified: true,
        persona: 'creator',
        balance: "12500000.00"
    },
    {
        id: "sample-v2",
        name: "Julian Voss",
        tag: "voss-milan",
        bio: "Private Milanese art exhibitions and the architecture of intimacy. Witness the evolution of structural beauty.",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julian",
        coverUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=1200",
        resonanceScore: "94.00",
        isVerified: true,
        persona: 'creator',
        balance: "8200000.00"
    },
    {
        id: "sample-v3",
        name: "Sofia Sterling",
        tag: "sofia-s",
        bio: "The space between notes. Finding luxury in the silence of the city. A refined journey through auditory landscapes.",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
        coverUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=1200",
        resonanceScore: "89.00",
        isVerified: true,
        persona: 'creator',
        balance: "2400000.00"
    }
];

export const SAMPLE_MOMENTS: Record<string, SampleMoment[]> = {
    "sample-v1": [
        {
            id: "m1",
            type: 'vision',
            content: "The first iteration of the Lunar Sequence. A study in obsidian and light.",
            mediaAssets: [{ url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200", type: 'image' }],
            price: "5000.00",
            requiredTier: "Acquaintance",
            createdAt: new Date(),
            creatorId: "sample-v1"
        },
        {
            id: "m2",
            type: 'flow',
            content: "Midnight in the sanctuary. Establishing resonance with the collective.",
            mediaAssets: [],
            price: "0.00",
            requiredTier: null,
            createdAt: new Date(Date.now() - 3600000),
            creatorId: "sample-v1"
        }
    ]
};
