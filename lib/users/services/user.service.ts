import { prisma } from "@/lib/db/client";
import { userRepository } from "../repositories/user.repository";
import { driverService } from "@/lib/drivers/services/driver.service";

import { UserRole, UserStatus } from "@prisma/client";

/**
 * User Service
 * Handles user identity and authentication operations only
 *
 * Responsibilities:
 * - User authentication
 * - Account data management
 * - Role assignment
 * - User profile operations
 *
 * NOT Responsible:
 * - Driver lifecycle (moved to driverService)
 * - Driver operations (moved to driverService)
 */

export const userService = {
  async getAllUsers() {
    return userRepository.getAll();
  },

  async getUserById(id: string) {
    return userRepository.getById(id);
  },

  async getUserByEmail(email: string) {
    return userRepository.getByEmail(email);
  },

  async createUser(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    status?: UserStatus;
    department?: string;
    avatar?: string;
  }) {
    // Check for duplicate email
    const existingUser = await userRepository.getByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Check for duplicate phone
    const phoneExists = await prisma.user.findFirst({
      where: { phone: data.phone },
    });
    if (phoneExists) {
      throw new Error("Phone number already exists");
    }

    // Create user (User domain responsibility)
    const user = await userRepository.create(data);

    // Handle driver profile creation (Driver domain responsibility)
    if (data.role === "DRIVER") {
      try {
        await driverService.createDriverProfile(user.id);
      } catch (error) {
        // Log error but don't fail user creation
        console.error("Failed to create driver profile:", error);
      }
    }

    return userRepository.getById(user.id);
  },

  async updateUser(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      role?: UserRole;
      status?: UserStatus;
      department?: string;
      avatar?: string;
    },
  ) {
    const user = await userRepository.getById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Check email uniqueness if being changed
    if (data.email && data.email !== user.email) {
      const emailExists = await userRepository.getByEmail(data.email);
      if (emailExists) {
        throw new Error("Email already exists");
      }
    }

    // Check phone uniqueness if being changed
    if (data.phone && data.phone !== user.phone) {
      const phoneExists = await prisma.user.findFirst({
        where: { phone: data.phone },
      });
      if (phoneExists) {
        throw new Error("Phone number already exists");
      }
    }

    // Handle role changes (Driver domain responsibility)
    if (data.role && data.role !== user.role) {
      if (data.role === "DRIVER") {
        // Create driver profile if user role changes to DRIVER
        try {
          await driverService.handleRoleChangeToDriver(id);
        } catch (error) {
          console.error("Failed to create driver profile on role change:", error);
        }
      } else {
        // Remove driver profile if user role changes from DRIVER
        if (user.role === "DRIVER") {
          try {
            await driverService.handleRoleChangeFromDriver(id);
          } catch (error) {
            console.error(
              "Failed to delete driver profile on role change:",
              error,
            );
          }
        }
      }
    }

    return userRepository.update(id, data);
  },

  async deleteUser(id: string) {
    // Delete driver profile if exists (Driver domain responsibility)
    try {
      await driverService.deleteDriverProfile(id);
    } catch (error) {
      console.error("Failed to delete driver profile:", error);
    }

    // Delete user (User domain responsibility)
    return userRepository.delete(id);
  },

  async getUsersByRole(role: UserRole) {
    return userRepository.getByRole(role);
  },

  async getStatistics() {
    const [totalUsers, activeUsers, driverCount, adminCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: "ACTIVE" } }),
        prisma.user.count({ where: { role: "DRIVER" } }),
        prisma.user.count({
          where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } },
        }),
      ]);

    return { totalUsers, activeUsers, driverCount, adminCount };
  },
};
