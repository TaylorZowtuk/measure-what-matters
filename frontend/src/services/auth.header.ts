export default function authHeader() {
    const json_user = localStorage.getItem("user");
    let user;
    console.log(json_user)
    if (json_user) { 
        user = JSON.parse(json_user);

        if (user && user.accessToken) {
            return { Authorization: 'Bearer ' + user.accessToken };
        }
    }
    else {
        return {};
    }
  }