import { create } from 'zustand';
import { mailAPI } from '../services/api';

type EmailState = {
  emails: Email[];
  selected: string[];
  viewMode: 'list' | 'grid';
  loadEmails: (page?: number) => Promise<void>;
  toggleSelection: (id: string) => void;
  markAsRead: (ids: string[]) => Promise<void>;
  deleteBatch: () => Promise<void>;
};

export const useEmailStore = create<EmailState>((set, get) => ({
  emails: [],
  selected: [],
  viewMode: 'list',
  
  loadEmails: async (page = 1) => {
    try {
      const response = await mailAPI.getMessages(page);
      set({ emails: response.data['hydra:member'] });
    } catch (error) {
      console.error('Failed loading emails');
    }
  },

  toggleSelection: (id) => set((state) => ({
    selected: state.selected.includes(id)
      ? state.selected.filter(i => i !== id)
      : [...state.selected, id]
  })),

  markAsRead: async (ids) => {
    // Implementation for batch read status update
  },

  deleteBatch: async () => {
    const { selected } = get();
    await mailAPI.deleteMessages(selected);
    set({ selected: [] });
    await get().loadEmails();
  }
}));
