import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const places = [
    {
        name: "Kozhikode Beach",
        city: "Kozhikode, Kerala",
        rating: 4.6,
        reviewCount: 2450,
        category: "beach",
        image: "https://images.unsplash.com/photo-1590510328503-903ef8879617?auto=format&fit=crop&q=80&w=1000",
        distance: 0.5,
        description: "Kozhikode Beach, also known as Calicut Beach, is a popular destination for locals and tourists alike. Famous for its beautiful sunsets and the two old piers that extend into the sea. The beach offers a wide range of local street food and a serene atmosphere.",
        lat: 11.2588,
        lng: 75.7804,
        mapUrl: "https://maps.google.com/?q=11.2588,75.7804"
    },
    {
        name: "Paragon Restaurant",
        city: "Kozhikode, Kerala",
        rating: 4.5,
        reviewCount: 8640,
        category: "restaurant",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000",
        distance: 1.2,
        description: "A legendary culinary destination in Kozhikode, Paragon is world-renowned for its authentic Malabar Biriyani and seafood. It has been a symbol of Calicut's rich food culture for decades.",
        lat: 11.2558,
        lng: 75.7748,
        mapUrl: "https://maps.google.com/?q=11.2558,75.7748"
    },
    {
        name: "Salkara Restaurant",
        city: "Kozhikode, Kerala",
        rating: 4.4,
        reviewCount: 3210,
        category: "restaurant",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1000",
        distance: 2.5,
        description: "Salkara offers a traditional Malabar dining experience with a modern touch. Known for its warm hospitality and a wide variety of local delicacies, including its famous breakfast spread.",
        lat: 11.2721,
        lng: 75.7809,
        mapUrl: "https://maps.google.com/?q=11.2721,75.7809"
    },
    {
        name: "Valayanad Devi Temple",
        city: "Kozhikode, Kerala",
        rating: 4.6,
        reviewCount: 1540,
        category: "heritage",
        image: "https://images.unsplash.com/photo-1514222139-b576bb5ce006?auto=format&fit=crop&q=80&w=1000",
        distance: 4.2,
        description: "Sree Valayanad Devi Temple is a highly respected temple dedicated to Goddess Bhagavathi. Known for its unique architecture and spiritual significance, it is a key heritage site in the region.",
        lat: 11.2415,
        lng: 75.8085,
        mapUrl: "https://maps.google.com/?q=11.2415,75.8085"
    }
];

async function main() {
    console.log('Seeding database...');

    // Clear existing data
    await prisma.place.deleteMany();

    for (const place of places) {
        await prisma.place.create({
            data: place
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
