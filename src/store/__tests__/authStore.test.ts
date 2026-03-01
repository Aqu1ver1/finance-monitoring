import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../authStore';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Mock storage
const mockSessionStorage = {
  store: {} as Record<string, string>,
  getItem(key: string) { return this.store[key] ?? null; },
  setItem(key: string, value: string) { this.store[key] = value; },
  removeItem(key: string) { delete this.store[key]; },
  clear() { this.store = {}; },
};

const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem(key: string) { return this.store[key] ?? null; },
  setItem(key: string, value: string) { this.store[key] = value; },
  removeItem(key: string) { delete this.store[key]; },
  clear() { this.store = {}; },
};

vi.stubGlobal('sessionStorage', mockSessionStorage);
vi.stubGlobal('localStorage', mockLocalStorage);

const mockUser = { id: 1, email: 'test@example.com', name: 'Test User', createdAt: '2024-01-01' };
const mockToken = 'mock-jwt-token';

beforeEach(() => {
  mockFetch.mockReset();
  mockSessionStorage.clear();
  mockLocalStorage.clear();
  useAuthStore.setState({ user: null, token: null, isLoading: true });
});

describe('useAuthStore', () => {
  describe('register', () => {
    it('should register a user and store token in sessionStorage', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser, token: mockToken }),
      });

      await useAuthStore.getState().register('test@example.com', 'password123', 'Test User');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/register'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', password: 'password123', name: 'Test User' }),
        })
      );

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(mockSessionStorage.getItem('token')).toBe(mockToken);
    });

    it('should throw on registration failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Email already in use' }),
      });

      await expect(
        useAuthStore.getState().register('test@example.com', 'password123')
      ).rejects.toEqual({ error: 'Email already in use' });
    });
  });

  describe('login', () => {
    it('should login and store token in sessionStorage when remember=false', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser, token: mockToken }),
      });

      await useAuthStore.getState().login('test@example.com', 'password123', false);

      expect(mockSessionStorage.getItem('token')).toBe(mockToken);
      expect(mockLocalStorage.getItem('token')).toBeNull();
      expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it('should login and store token in localStorage when remember=true', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser, token: mockToken }),
      });

      await useAuthStore.getState().login('test@example.com', 'password123', true);

      expect(mockLocalStorage.getItem('token')).toBe(mockToken);
      expect(mockLocalStorage.getItem('remember')).toBe('true');
      expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it('should throw on login failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      });

      await expect(
        useAuthStore.getState().login('test@example.com', 'wrong', false)
      ).rejects.toEqual({ error: 'Invalid credentials' });
    });
  });

  describe('logout', () => {
    it('should clear user state and all storage', () => {
      mockSessionStorage.setItem('token', mockToken);
      mockLocalStorage.setItem('token', mockToken);
      mockLocalStorage.setItem('remember', 'true');
      useAuthStore.setState({ user: mockUser, token: mockToken });

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(mockSessionStorage.getItem('token')).toBeNull();
      expect(mockLocalStorage.getItem('token')).toBeNull();
      expect(mockLocalStorage.getItem('remember')).toBeNull();
    });
  });

  describe('rehydrate', () => {
    it('should rehydrate from localStorage', async () => {
      mockLocalStorage.setItem('token', mockToken);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      });

      await useAuthStore.getState().rehydrate();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
      expect(state.isLoading).toBe(false);
    });

    it('should rehydrate from sessionStorage when localStorage is empty', async () => {
      mockSessionStorage.setItem('token', mockToken);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser }),
      });

      await useAuthStore.getState().rehydrate();

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });

    it('should clear state when no token exists', async () => {
      await useAuthStore.getState().rehydrate();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('should clear state on invalid token', async () => {
      mockSessionStorage.setItem('token', 'invalid');
      mockFetch.mockResolvedValueOnce({ ok: false });

      await useAuthStore.getState().rehydrate();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(mockSessionStorage.getItem('token')).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user and refresh token', async () => {
      const updatedUser = { ...mockUser, name: 'New Name' };
      const newToken = 'new-token';
      mockSessionStorage.setItem('token', mockToken);
      useAuthStore.setState({ user: mockUser, token: mockToken });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: updatedUser, token: newToken }),
      });

      await useAuthStore.getState().updateUser({ name: 'New Name' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/update'),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`,
          }),
        })
      );

      const state = useAuthStore.getState();
      expect(state.user?.name).toBe('New Name');
      expect(state.token).toBe(newToken);
    });

    it('should store new token in localStorage if remember was used', async () => {
      mockLocalStorage.setItem('token', mockToken);
      useAuthStore.setState({ user: mockUser, token: mockToken });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ user: mockUser, token: 'new-token' }),
      });

      await useAuthStore.getState().updateUser({ name: 'Updated' });

      expect(mockLocalStorage.getItem('token')).toBe('new-token');
    });

    it('should throw on update failure', async () => {
      useAuthStore.setState({ user: mockUser, token: mockToken });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Email already in use' }),
      });

      await expect(
        useAuthStore.getState().updateUser({ email: 'taken@example.com' })
      ).rejects.toEqual({ error: 'Email already in use' });
    });
  });
});
