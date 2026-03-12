export const useAuth = () => {
  const login = (_options?: any, _redirect?: string) => {
    console.log("Mock login called");
  };

  return {
    login,
    isLoginLoading: false,
  };
};
