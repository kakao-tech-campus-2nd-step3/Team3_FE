const CheckAuth = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return false;
  }
  return true;
};

export default CheckAuth;
