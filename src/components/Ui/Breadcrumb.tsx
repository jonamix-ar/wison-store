"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type TBreadCrumbProps = {
  homeElement: ReactNode;
  separator: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
};

const Breadcrumb = ({
  homeElement,
  separator,
  containerClasses = "",
  listClasses = "",
  activeClasses = "",
  capitalizeLinks = false,
}: TBreadCrumbProps) => {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  return (
    <div className={containerClasses}>
      <ul className="flex items-center space-x-2">
        <li className={listClasses}>
          <Link href={"/"} className="text-xl font-semibold lg:inline">{homeElement}</Link>
        </li>
        {pathNames.length > 0 && separator}
        {pathNames.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join("/")}`;
          const isActive = paths === href;
          const itemClasses = isActive
            ? `${listClasses} ${activeClasses}`
            : listClasses;
          const itemLink = capitalizeLinks
            ? link.charAt(0).toUpperCase() + link.slice(1)
            : link;

          return (
            <React.Fragment key={index}>
              <li className={itemClasses}>
                <Link href={href}>
                  <h1
                    className={`text-xl font-semibold lg:inline ${
                      isActive ? "hidden" : ""
                    }`}
                  >
                    {itemLink}
                  </h1>
                </Link>
              </li>
              {pathNames.length !== index + 1 && separator}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default Breadcrumb;
