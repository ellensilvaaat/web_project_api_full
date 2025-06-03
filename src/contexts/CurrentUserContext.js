import React from "react";

const CurrentUserContext = React.createContext({
  currentUser: {
    name: "",
    about: "",
    avatar: ""
  },
  handleUpdateUser: () => {},
  handleUpdateAvatar: () => {}
});

export default CurrentUserContext;
