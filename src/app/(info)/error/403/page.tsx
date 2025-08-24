// --layouts

import ErrorLayout from "@/utils/error";

import { Suspense } from "react";

// --images
import error403 from "@images/errror/403.svg";

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
      image={error403}
      heading="Access Denied"
      subHeading="Looks like you don’t have permission to view this page."
      paragraph="This could be due to an expired or invalid link, restricted access to premium or admin-only content, or a profile or page that has been removed or moved."
      errorType="403"
    />
  );
}
