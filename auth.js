const USERS_KEY = 'house_rent_users';
const CURRENT_USER_KEY = 'current_user';

class Auth {
  static getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }

  static signup(name, email, password, role, familyType = null) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'User already exists' };
    }

    const user = {
      id: Date.now(),
      name,
      email,
      password,
      role,
      familyType
    };

    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    this.redirectByRole(role);
    return { success: true };
  }

  static login(email, password) {
    const user = this.getUsers().find(
      u => u.email === email && u.password === password
    );
    if (!user) return { success: false, error: 'Invalid credentials' };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    this.redirectByRole(user.role);
    return { success: true };
  }

  static logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = '../index.html';
  }

  static getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
  }

  static redirectByRole(role) {
    if (role === 'tenant') window.location.href = 'tenant/dashboard.html';
    if (role === 'owner') window.location.href = 'owner/dashboard.html';
  }
}
