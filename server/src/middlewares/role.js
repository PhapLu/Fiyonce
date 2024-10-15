import AccessControl from "accesscontrol"
const ac = new AccessControl()

const roles = () => {
  ac.grant("member").deleteOwn("profile").updateOwn("profile").readOwn("profile").createOwn("profile")

  ac.grant("talent").extend("member")

  ac.grant("admin")
    .extend("talent")
    .updateAny("profile")
    .deleteAny("profile")
    .createAny("profile")
    .readAny("profile")

  return ac
}

export default roles()
