const Cookie = process.client ? require("js-cookie") : undefined;
export default function({ $axios, app, redirect }) {
  $axios.onError((error) => {
    if (error.response.status === 401) {
      console.log("Hết phiên đăng nhập !!");
      Cookie.remove("auth");
      app.$auth.setToken('local', null)
      redirect('/login')
    }
  })
}
