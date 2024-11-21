import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (session?.user?.role) {
    switch (session.user.role) {
      case "ADMIN":
      case "SELLER":
        res.redirect("/admin");
        break;
      case "WHOLESALER":
        res.redirect("/wholesaler");
        break;
      case "CUSTOMER":
        res.redirect("/customer");
        break;
      default:
        res.redirect("/");
    }
  } else {
    res.redirect("/");
  }
}
