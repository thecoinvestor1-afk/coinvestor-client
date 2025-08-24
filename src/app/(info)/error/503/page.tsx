// --layouts

import ErrorLayout from "@/utils/error";

import { Suspense } from "react";

// --images
import error503 from "@images/errror/503.svg";

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
      image={error503}
      heading="Service Temporarily Unavailable"
      subHeading="We’re making some updates or experiencing high traffic."
      paragraph="Please check back in a few minutes — we’ll be back online shortly and better than ever."
      errorType="503"
    />
  );
}
