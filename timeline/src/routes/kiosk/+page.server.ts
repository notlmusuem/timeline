import { redirect } from "@sveltejs/kit";


export async function load({ cookies }) {
  cookies.set("kioskMode", "true", {
    path: "/",
    httpOnly: false,
    secure: false,
    sameSite: "lax",
    expires: new Date("2999-01-01")
  });

  throw redirect(301, "/");
}
