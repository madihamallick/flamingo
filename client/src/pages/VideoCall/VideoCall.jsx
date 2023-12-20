import React from "react";
import videomeet from "../../assets/video-meet.jpg";
import VideoPlayer from "../../components/VideoPlayer";
// import Options from "../../components/Options";
// import Notifications from "../../components/Notifications";

const VideoCall = () => {
  return (
    <div>
      <header class="mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow backdrop-blur-lg md:top-6 md:rounded-3xl lg:max-w-screen-lg">
        <div class="px-4">
          <div class="flex items-center justify-between">
            <div class="flex shrink-0">
              <a aria-current="page" class="flex items-center" href="/">
                <img class="h-9 w-8" src={videomeet} alt="" />
              </a>
            </div>
            <div class="flex items-center justify-end gap-3">
              <a
                class="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
                href="/login"
              >
                Sign in
              </a>
              <a
                class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                href="/login"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      </header>
      <VideoPlayer />
      {/* <Options>
        <Notifications />
      </Options> */}
    </div>
  );
};

export default VideoCall;
