import { useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { useUserStore } from '../user.store';
import { loginUser } from '../api/auth';
import axios from 'axios';

interface LogInFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp?: (data: LogInData) => void;
}

export interface LogInData {
  email: string;
  password: string;
}

export const LogInFormModal = ({ isOpen, onClose, onSignUp }: LogInFormModalProps) => {
  const [formData, setFormData] = useState<LogInData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<LogInData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const validateForm = (): boolean => {
    const newErrors: Partial<LogInData> = {};

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

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > 128) {
      newErrors.password = 'Password is too long (max 128 characters)';
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
    if (errors[name as keyof LogInData]) {
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
      const data = await loginUser(formData.email, formData.password);
      setUser(data.user, data.token, remember);
      onSignUp?.(formData);
      handleClose();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setErrors({ email: err.response?.data?.error });
      } else {
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      email: '',
      password: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-4">
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
            className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none ${errors.email
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
              className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none ${errors.password
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
        <label>
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
          Не выходить
        </label>
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
            {isLoading ? 'Creating...' : 'Sign Up'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
