// --layouts

import ErrorLayout from "@/utils/error";

import { Suspense } from "react";

// --images
import error500 from "@images/errror/500.svg";

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
      image={error500}
      heading="Something Went Wrong"
      subHeading="Oops! That’s on us. Our server ran into an unexpected issue."
      paragraph="We’re already on it and will have things back to normal soon."
      errorType="500"
    />
  );
}
