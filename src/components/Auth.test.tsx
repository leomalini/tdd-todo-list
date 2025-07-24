import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Auth } from './Auth';
import { supabase } from '@/integrations/supabase/client';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const mockOnSuccess = vi.fn();

describe('Auth Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<Auth onSuccess={mockOnSuccess} />);
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account to continue')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument();
  });

  it('switches to signup form when clicking signup link', async () => {
    const user = userEvent.setup();
    render(<Auth onSuccess={mockOnSuccess} />);
    
    await user.click(screen.getByText("Don't have an account? Sign up"));
    
    expect(screen.getByText('Create account')).toBeInTheDocument();
    expect(screen.getByText('Create a new account to get started')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  it('switches back to login form when clicking login link', async () => {
    const user = userEvent.setup();
    render(<Auth onSuccess={mockOnSuccess} />);
    
    // Switch to signup
    await user.click(screen.getByText("Don't have an account? Sign up"));
    // Switch back to login
    await user.click(screen.getByText("Already have an account? Sign in"));
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: { id: '1' }, session: {} },
      error: null,
    } as any);

    render(<Auth onSuccess={mockOnSuccess} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('handles successful signup', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: { id: '1' }, session: {} },
      error: null,
    } as any);

    render(<Auth onSuccess={mockOnSuccess} />);
    
    // Switch to signup
    await user.click(screen.getByText("Don't have an account? Sign up"));
    
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: 'http://localhost:3000/',
          data: {
            username: 'testuser'
          }
        }
      });
    });
  });

  it('handles login error', async () => {
    const user = userEvent.setup();
    const mockToast = vi.fn();
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials' },
    } as any);

    // Mock useToast to return our mock function
    vi.doMock('@/hooks/use-toast', () => ({
      useToast: () => ({ toast: mockToast }),
    }));

    render(<Auth onSuccess={mockOnSuccess} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalled();
    });
  });

  it('handles signup error', async () => {
    const user = userEvent.setup();
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Email already exists' },
    } as any);

    render(<Auth onSuccess={mockOnSuccess} />);
    
    // Switch to signup
    await user.click(screen.getByText("Don't have an account? Sign up"));
    
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalled();
    });
  });

  it('requires all fields to be filled', async () => {
    const user = userEvent.setup();
    render(<Auth onSuccess={mockOnSuccess} />);
    
    // Try to submit without filling fields
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Form should not submit due to HTML5 validation
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it('enforces minimum password length', () => {
    render(<Auth onSuccess={mockOnSuccess} />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('minLength', '6');
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    // Mock a slow response
    vi.mocked(supabase.auth.signInWithPassword).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: { user: { id: '1' }, session: {} }, error: null } as any), 1000))
    );

    render(<Auth onSuccess={mockOnSuccess} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
  });
});