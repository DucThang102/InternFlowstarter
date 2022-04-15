const { toast } = require("react-toastify");
// 🦄 Create post successfully!
export const notify = {
  success: (message) => {
    toast.success(`🚀 ${message}`, {
      position: "bottom-left",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  },

  error: (message) => {
    toast.error(message, {
      position: "bottom-left",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  },
};
