/**
 * Application Role Definitions
 * ----------------------------
 * ADMIN   → School Admin (Primary admin for a single school)
 * TEACHER → Teacher user
 * STUDENT → Student user
 * PARENT  → Parent user
 *
 * NOTE:
 * - ADMIN is NOT platform admin
 * - SUPER_ADMIN (platform owner) is intentionally excluded for now
 */

export const ROLES = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  PARENT: "PARENT",
};
