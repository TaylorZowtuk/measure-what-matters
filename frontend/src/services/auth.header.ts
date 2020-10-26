export default function authHeader() {
    const json_user = localStorage.getItem("user");
    
    if (!json_user) {
        return {};
    }
    const user = JSON.parse(json_user);
    if(!user || !user.accessToken) {
        return {};
    }
    return { Authorization: 'Bearer ' + user.accessToken };
  }