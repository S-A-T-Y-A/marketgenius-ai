
import { User, MarketingContent } from '../types';

const USER_KEY = 'mg_user_data';
const HISTORY_KEY = 'mg_content_history';

export const storageService = {
  saveUser: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser: (): User | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  clearUser: () => {
    localStorage.removeItem(USER_KEY);
  },
  saveHistory: (history: MarketingContent[]) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  },
  getHistory: (): MarketingContent[] => {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },
  addContent: (content: MarketingContent) => {
    const history = storageService.getHistory();
    const updated = [content, ...history];
    storageService.saveHistory(updated);
    return updated;
  }
};
