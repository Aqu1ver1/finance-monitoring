import { useState, useEffect } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

interface UpdateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface UpdateData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export const UpdateFormModal = ({ isOpen, onClose }: UpdateFormModalProps) => {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [formData, setFormData] = useState<UpdateData>({
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    name: user?.name || '',
  });

  const [errors, setErrors] = useState<Partial<UpdateData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
        name: user.name || '',
      }));
    }
  }, [isOpen, user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateData> = {};

    // Full Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else {
      const trimmedName = formData.name.trim();

      if (trimmedName.length < 2) {
        newErrors.name = 'Full name must be at least 2 characters';
      }
      else if (!/^[a-zA-Zа-яА-ЯёЁ\s\-']+$/.test(trimmedName)) {
        newErrors.name = 'Name contains invalid characters (use letters, spaces, dashes, or apostrophes only)';
      }
      else if (!/[a-zA-Zа-яА-ЯёЁ]/.test(trimmedName)) {
        newErrors.name = 'Name must contain at least one letter';
      }
      else if (/\s{2,}/.test(trimmedName)) {
        newErrors.name = 'Multiple consecutive spaces are not allowed';
      }
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      else if (formData.email.includes('..')) {
        newErrors.email = 'Invalid email format (consecutive dots)';
      }
      else if (formData.email.startsWith('.') || formData.email.endsWith('.')) {
        newErrors.email = 'Invalid email format';
      }
    }

    // Password validation (optional for update)
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else if (formData.password.length > 128) {
        newErrors.password = 'Password is too long (max 128 characters)';
      }

      // Confirm Password only required if password is provided
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof UpdateData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const payload: { email?: string; password?: string; name?: string } = {};
      if (formData.email !== user?.email) payload.email = formData.email;
      if (formData.name !== (user?.name || '')) payload.name = formData.name;
      if (formData.password) payload.password = formData.password;

      if (Object.keys(payload).length === 0) {
        onClose();
        return;
      }

      await updateUser(payload);

      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));

      onClose();
    } catch (error: unknown) {
      console.error('Update failed:', error);
      let message = 'Update failed';
      if (error && typeof error === 'object' && 'error' in error) {
        message = (error as { error: string }).error;
      } else if (error instanceof TypeError) {
        message = 'Network error. Please check your connection.';
      }
      setErrors(prev => ({
        ...prev,
        email: message,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: user?.email || '',
      password: '',
      confirmPassword: '',
      name: user?.name || '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none ${
              errors.name
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none ${
              errors.email
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            New Password <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none ${
                errors.password
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        {formData.password && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className='text-white'
            fullWidth
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
