import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export const useRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'restaurants'));
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRestaurants(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching restaurants:", err);
                setError(err);
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
                    console.log("No such document!");
                    setError("No restaurant found");
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching restaurant:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [id]);

    return { restaurant, loading, error };
};
