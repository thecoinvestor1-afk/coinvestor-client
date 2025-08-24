// --layouts


import { Suspense } from "react";

// --images
import error404 from "@images/errror/404.svg";
import ErrorLayout from "@/utils/error";

// export const metadata = constructMetadata({
//   title: "Forbidden Page Error (403)",
//   description: "It seems like you don't belong here!",
//   path: "/403",
// });

export default function Error403Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Error403Content />
    </Suspense>
  );
}

function Error403Content() {
  return (
    <ErrorLayout
      background="#FCFCFF"
      image={error404}
      heading="Page Not Found"
      subHeading="You’ve reached a page that doesn’t exist."
      paragraph="The link you followed may be broken, or the page may have been removed."
      errorType="404"
    />
  );
}
