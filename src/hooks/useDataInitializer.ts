import { useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { initialFlora, initialFauna, initialHistory } from '../data/initialData';
import { onAuthStateChanged } from 'firebase/auth';

export const useDataInitializer = () => {
  useEffect(() => {
    const initialize = async () => {
      // Check if user is logged in and is the admin before trying to seed
      // This prevents permission errors for guest users
      const user = auth.currentUser;
      if (!user || user.email !== 'dilshodallaberdiyev57@gmail.com') {
        return;
      }

      try {
        // Check flora
        const floraSnap = await getDocs(collection(db, 'flora'));
        if (floraSnap.empty) {
          console.log("Seeding flora...");
          for (const item of initialFlora) {
            await addDoc(collection(db, 'flora'), item);
          }
        }

        // Check fauna
        const faunaSnap = await getDocs(collection(db, 'fauna'));
        if (faunaSnap.empty) {
          console.log("Seeding fauna...");
          for (const item of initialFauna) {
            await addDoc(collection(db, 'fauna'), item);
          }
        }

        // Check history
        const historySnap = await getDocs(collection(db, 'history'));
        if (historySnap.empty) {
          console.log("Seeding history...");
          for (const item of initialHistory) {
            await addDoc(collection(db, 'history'), item);
          }
        }
      } catch (error) {
        console.error("Data initialization error (likely permission related):", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        initialize();
      }
    });

    return () => unsubscribe();
  }, []);
};
