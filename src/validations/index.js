export const validation = (obj) => {
  if (obj.name === "" && obj.name.length === 0) {
    return {
      target: "name",
      message: "Name kiriting",
    };
  }
  if (obj.email === "" || obj.email.length === 0) {
    return {
      target: "email",
      message: "Email kiriting",
    };
  }

  if (obj.password === "" || obj.password.length === 0) {
    return {
      target: "password",
      message: "Password kiriting",
    };
  }
  return false;
};
