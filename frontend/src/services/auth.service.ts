import axios from "axios";

// credit: https://bezkoder.com/react-jwt-auth/#Authentication_service

class AuthService {
  login(username: string, password: string) {
    return axios
      .post('/auth/login', {
        username,
        password
      })
      .then(response => {
        console.log(response)
        if (response.data.accessToken) {
          console.log("has access")
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

//   logout() {
//     localStorage.removeItem("user");
//   }

//   register(username: string, password: string) {
//     return axios.post(API_URL + "signup", {
//       username,
//       password
//     });
//   }

//   getCurrentUser() {
//     return JSON.parse(localStorage.getItem('user'));;
//   }
}

export default new AuthService();