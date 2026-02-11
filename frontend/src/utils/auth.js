export const isAuthenticated = () => {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role");
  
  // We check for 'role' because that's what we save now instead of 'user'
  return Boolean(token && role);
};