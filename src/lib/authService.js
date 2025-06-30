// Simple authentication service using localStorage
const STORAGE_KEYS = {
  CURRENT_USER: 'cirs_current_user',
  USERS: 'cirs_users',
  PENDING_REGISTRATIONS: 'cirs_pending_registrations'
};

// Demo users
const defaultUsers = [
  {
    id: 'admin-1',
    email: 'admin@cirs.demo',
    password: 'admin123',
    role: 'admin',
    full_name: 'Dr. Sarah Johnson',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'nurse-1',
    email: 'nurse@cirs.demo',
    password: 'nurse123',
    role: 'healthcare_worker',
    full_name: 'Nurse Mary Wilson',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'parent-1',
    email: 'parent@cirs.demo',
    password: 'parent123',
    role: 'parent',
    full_name: 'John Smith',
    created_at: '2024-01-01T00:00:00Z'
  }
];

// Initialize default data if not exists
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.PENDING_REGISTRATIONS)) {
    const defaultPending = [
      {
        id: 'pending-1',
        email: 'jane.doe@email.com',
        password: 'password123',
        full_name: 'Jane Doe',
        role: 'healthcare_worker',
        status: 'pending',
        created_at: '2024-12-19T10:30:00Z'
      },
      {
        id: 'pending-2',
        email: 'bob.smith@email.com',
        password: 'password123',
        full_name: 'Bob Smith',
        role: 'parent',
        status: 'pending',
        created_at: '2024-12-19T14:15:00Z'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.PENDING_REGISTRATIONS, JSON.stringify(defaultPending));
  }
};

// Initialize data on load
initializeData();

export const authService = {
  // Sign in user
  signIn: async (email, password) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Remove password from stored user data
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },

  // Sign up user (add to pending registrations)
  signUp: async (userData) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const pending = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_REGISTRATIONS) || '[]');
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email);
    const existingPending = pending.find(p => p.email === userData.email);
    
    if (existingUser || existingPending) {
      throw new Error('User with this email already exists');
    }
    
    const newRegistration = {
      id: `pending-${Date.now()}`,
      ...userData,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    pending.push(newRegistration);
    localStorage.setItem(STORAGE_KEYS.PENDING_REGISTRATIONS, JSON.stringify(pending));
    
    return newRegistration;
  },

  // Sign out user
  signOut: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Get current user
  getCurrentUser: () => {
    const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userData ? JSON.parse(userData) : null;
  },

  // Get pending registrations
  getPendingRegistrations: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_REGISTRATIONS) || '[]');
  },

  // Approve/reject registration
  updateRegistrationStatus: (registrationId, status) => {
    const pending = JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_REGISTRATIONS) || '[]');
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    const registration = pending.find(p => p.id === registrationId);
    if (!registration) {
      throw new Error('Registration not found');
    }
    
    // Update status
    registration.status = status;
    
    // If approved, create user account with password
    if (status === 'approved') {
      const newUser = {
        id: `user-${Date.now()}`,
        email: registration.email,
        password: registration.password, // Keep the original password
        role: registration.role,
        full_name: registration.full_name,
        created_at: new Date().toISOString()
      };
      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    
    localStorage.setItem(STORAGE_KEYS.PENDING_REGISTRATIONS, JSON.stringify(pending));
    return registration;
  }
};