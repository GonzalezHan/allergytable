import { db } from './firebase';
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { mockRestaurants } from './data.jsx';

const seedDatabase = async () => {
    try {
        const batch = writeBatch(db);

        console.log("Starting data seeding...");

        mockRestaurants.forEach((restaurant) => {
            const docRef = doc(collection(db, "restaurants"), restaurant.id.toString());
            // Convert ID to string for Firestore document ID, but keep number in data if needed, 
            // or better, let's keep consistent. Firestore IDs are strings.
            // We'll treat the existing ID as the document key.
            batch.set(docRef, {
                ...restaurant,
                // Ensure coordinates are stored in a format easy to query if needed later (GeoPoint), 
                // but for now array [lat, lng] is fine as per Leaflet.
            });
        });

        await batch.commit();
        console.log("Successfully seeded database with mock restaurants!");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Temporary execution logic for development
// In a real app, this would be a separate admin script.
// We'll expose it to window to run it from console for now.
window.seedDB = seedDatabase;

export default seedDatabase;
