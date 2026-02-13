import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { mockRestaurants } from '../data';

export const useRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                // Attempt to fetch from Firestore
                const querySnapshot = await getDocs(collection(db, 'restaurants'));
                
                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setRestaurants(data);
                } else {
                    // Fallback to mock data if Firestore is empty
                    console.log("Firestore empty, using mock data.");
                    setRestaurants(mockRestaurants);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching restaurants, using mock data:", err);
                // Fallback to mock data on error
                setRestaurants(mockRestaurants);
                setError(null); // Clear error to allow UI to render
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    return { restaurants, loading, error };
};

export const useRestaurant = (id) => {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchRestaurant = async () => {
            try {
                // Try to get document by ID (string)
                // Since our seed script uses the mock ID as the doc ID (e.g., "1", "2")
                const docRef = doc(db, 'restaurants', id.toString());
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setRestaurant({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such document, trying mock data fallback");
                    const mock = mockRestaurants.find(r => r.id.toString() === id.toString());
                    if (mock) {
                         setRestaurant(mock);
                    } else {
                         setError("No restaurant found");
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching restaurant, using mock data:", err);
                 const mock = mockRestaurants.find(r => r.id.toString() === id.toString());
                 if (mock) {
                        setRestaurant(mock);
                        setError(null);
                 } else {
                        setError(err);
                 }
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [id]);

    return { restaurant, loading, error };
};
