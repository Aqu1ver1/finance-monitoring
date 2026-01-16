import { useState, useEffect } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { useUserStore } from '../user.store';
import { updateUser } from '../api/auth';
import axios from 'axios';

interface UpdateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (data: UpdateData) => void;
}

export interface UpdateData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export const UpdateFormModal = ({ isOpen, onClose, onUpdate }: UpdateFormModalProps) => {
const user = useUserStore((s) => s.user);
  const [formData, setFormData] = useState<UpdateData>({
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    fullName: user?.name || '',
  });

  const [errors, setErrors] = useState<Partial<UpdateData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update form data when modal opens with current user data
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        email: user.email || '',
        password: '',
        confirmPassword: '',
        fullName: user.name || '',
      });
    }
  }, [isOpen, user]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateData> = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else {
      const trimmedName = formData.fullName.trim();
      
      // Check if full name has at least 2 characters
      if (trimmedName.length < 2) {
        newErrors.fullName = 'Full name must be at least 2 characters';
      }
      // Check if full name contains invalid characters (numbers, special chars except space, dash, apostrophe)
      else if (!/^[a-zA-Zа-яА-ЯёЁ\s\-']+$/.test(trimmedName)) {
        newErrors.fullName = 'Full name contains invalid characters (use letters, spaces, dashes, or apostrophes only)';
      }
      // Check if full name has at least one letter
      else if (!/[a-zA-Zа-яА-ЯёЁ]/.test(trimmedName)) {
        newErrors.fullName = 'Full name must contain at least one letter';
      }
      // Check for excessive spaces or formatting
      else if (/\s{2,}/.test(trimmedName)) {
        newErrors.fullName = 'Multiple consecutive spaces are not allowed';
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
      // Check for consecutive dots
      else if (formData.email.includes('..')) {
        newErrors.email = 'Invalid email format (consecutive dots)';
      }
      // Check if email starts or ends with dot
      else if (formData.email.startsWith('.') || formData.email.endsWith('.')) {
        newErrors.email = 'Invalid email format';
      }
    }

    // Password validation (optional for update)
    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else if (formData.password.length > 128) {
        newErrors.password = 'Password is too long (max 128 characters)';
      }

      // Confirm Password validation (only if password is provided)
      if (!formData.confirmPassword && formData.password) {
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
    // Clear error for this field when user starts typing
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
      // Отправляем только измененные данные
      const updateData: any = { userId: user?.id };
      
      if (formData.email && formData.email !== user?.email) {
        updateData.email = formData.email;
      }
      if (formData.fullName && formData.fullName !== user?.name) {
        updateData.name = formData.fullName;
      }
      if (formData.password) {
        updateData.password = formData.password;
      }

      // Если ничего не изменилось, просто закрываем модаль
      if (Object.keys(updateData).length === 1) { // только userId
        onClose();
        return;
      }

      const updatedUser = await updateUser(updateData);
      useUserStore.getState().setUser(updatedUser.user, updatedUser.token, true);
      // Call the onUpdate callback
      if (onUpdate) {
        onUpdate(formData);
      }
      // Close modal
      onClose();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setErrors({ email: err.response?.data?.error });
      } else {
        console.error(err);
      }
    }finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Update Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none ${
              errors.fullName
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
          />
          {errors.fullName && (
            <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
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
            Password
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
