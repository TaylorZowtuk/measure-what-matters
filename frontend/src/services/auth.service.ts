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
        console.log("Post to login response:", response);
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

//   logout() {
//     localStorage.removeItem("user");
//   }

  register(name: string, username: string, password1: string, password2: string) {
    return axios.post('users/create', {
      name,
      username,
      password1,
      password2
    })
    .then(response => {
      // console.log("created new user");
      // console.log(response.data);
      return response.data;
    });
  }

//   getCurrentUser() {
//     return JSON.parse(localStorage.getItem('user'));;
//   }
}

export default new AuthService();