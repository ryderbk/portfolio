import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase';
import { FIRESTORE_COLLECTIONS } from '@/lib/constants';
import { SiteConfig, DEFAULT_SITE_CONFIG } from '@/types/site-config';

const db = getFirestoreDb();
const CONFIG_DOC_ID = "global";
const LOCAL_STORAGE_KEY = "site-config";

export const configService = {
  /**
   * Get config from localStorage (for instant load)
   */
  getLocalConfig(): SiteConfig {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) return DEFAULT_SITE_CONFIG;
    try {
      return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      return DEFAULT_SITE_CONFIG;
    }
  },

  /**
   * Save config to localStorage
   */
  saveLocalConfig(config: SiteConfig) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
  },

  /**
   * Get config from Firestore
   */
  async getRemoteConfig(): Promise<SiteConfig | null> {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.SITE_CONFIG, CONFIG_DOC_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as SiteConfig;
      }
      return null;
    } catch (error) {
      console.error("Error fetching remote config:", error);
      return null;
    }
  },

  /**
   * Update config in Firestore
   */
  async updateRemoteConfig(config: SiteConfig) {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.SITE_CONFIG, CONFIG_DOC_ID);
      await setDoc(docRef, {
        ...config,
        updatedAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error("Error updating remote config:", error);
      throw error;
    }
  },

  /**
   * Subscribe to remote config changes
   */
  subscribeToConfig(callback: (config: SiteConfig) => void) {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.SITE_CONFIG, CONFIG_DOC_ID);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as SiteConfig);
      }
    });
  }
};
