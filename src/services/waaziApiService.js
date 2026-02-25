import axios from "axios";

export const fetchExternalWaazi = async () => {
  try {
    const url = process.env.WAAZI_API_URL;

    if (!url) {
      console.log("No WAAZI_API_URL configured");
      return;
    }

    await axios.get(url);

    console.log("External waazi fetched");
  } catch (error) {
    console.error("Waazi service error:", error.message);
  }
};
