export const API_PATH = {
  user: {
    login: "users/login",
    logout: "users/logout",
    signup: "users/signup",
    sendmail: "users/sendmail",
    verify: "users/verify",
    update: "users/update"
  },
  tokenChange: "tokenchange",
  post: {
    add: "post/addpost",
    get: "post/getpost",
    getRelevant: "post/getRelevantPost",
    like: "post/likepost",
  },
  comment: {
    add: "comment/add",
    get: "comment/get",
  },
  search: "search"
};

export const ROUTES_WITH_VERIFICATION = [
  API_PATH.post.like,
  API_PATH.comment.add,
  API_PATH.post.add
]
export const ROUTES_WITH_LOGIN = [
  API_PATH.post.like,
  API_PATH.comment.add,
  API_PATH.post.add
]