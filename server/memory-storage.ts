// Simple in-memory storage for development when database is unavailable
import { User } from "@shared/schema";

interface MemoryUser extends User {
  password: string;
}

class MemoryStorage {
  private users: MemoryUser[] = [
    {
      id: 1,
      username: "demo",
      email: "demo@flipstackk.com",
      password: "password",
      name: "Demo User",
      role: "caller",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      username: "admin",
      email: "admin@flipstackk.com", 
      password: "password",
      name: "Admin User",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      username: "benjistackk",
      email: "benny@flipstackk.com",
      password: "password", 
      name: "Benny Jelleh",
      role: "acquisitions",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  async getUserByUsername(username: string): Promise<MemoryUser | null> {
    console.log(`Looking up user: ${username}`);
    const user = this.users.find(u => u.username === username);
    console.log(`Found user:`, user ? `${user.username} (${user.role})` : 'not found');
    return user || null;
  }

  async getUser(id: number): Promise<MemoryUser | null> {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  async createUser(userData: any): Promise<MemoryUser> {
    const newUser: MemoryUser = {
      id: this.users.length + 1,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      name: userData.name || userData.username,
      role: userData.role || "caller",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.push(newUser);
    return newUser;
  }
}

export const memoryStorage = new MemoryStorage();