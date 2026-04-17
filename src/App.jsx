import { useEffect, Fragment, useState } from "react";

import { useLocalStorage } from "./useLocalStorage";
import ImageUploader from "./ImageUploader";
import Container from "./Container";

const { SubContainer } = Container;

const tabs = [
  {
    subtitle: <h3>Trim, center, and square PNGs for sticker-ready uploads</h3>,
    content: <ImageUploader></ImageUploader>,
    title: "Sticker Prep",
    id: 0,
  },
  {
    subtitle: (
      <>
        <h3>Submit ideas and browse all sticker requests in one place</h3>
        <div>
          <a
            href="https://u.pcloud.com/#page=puplink&code=oznXZTl0F60mnpyYsvVQ03wFSyfMW0oXX"
            className="btn btn-primary"
            role="button"
          >
            Submit Request
          </a>
        </div>
      </>
    ),
    content: (
      <>
        <iframe
          src="https://u.pcloud.link/publink/show?code=kZCKJE5ZUvqlBsC5PG5gThfwUmStUuPmG99X"
          title="Requests"
          height="500px"
          width="100%"
        />
      </>
    ),
    title: "Requests",
    id: 1,
  },
];

// make sure titles & subtitles of tabs are accurate
// need content for each tab
// will you be using an iframe to handle the pCloud links?
// want to use willie sleepy emoji as favicon
// as it stands, id must be string due to how local storage grabs stored state

export default function App() {
  const [iframeKey, setIframeKey] = useState(() => Math.random());

  const refreshIframe = () => setIframeKey(() => Math.random());

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshIframe();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const [tabId, setTabId] = useLocalStorage("tabId", `${tabs[0].id}`);

  const activeTab = tabs.find((tab) => `${tab.id}` === tabId);

  const [subtitle, content] = [
    activeTab ? activeTab.subtitle : "",
    activeTab ? activeTab.content : <></>,
  ];

  const titleFlexClassName =
    "d-flex flex-wrap gap-3 justify-content-between align-items-center";

  return (
    <Container>
      <SubContainer>
        <div className={titleFlexClassName}>
          <h1>TwoWhit Sticker Hub</h1>
          <div>
            <div className="btn-group btn-group-lg" role="group">
              {tabs.map(({ title, id }) => (
                <button
                  className={["btn btn-primary", `${id}` === tabId && "active"]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setTabId(`${id}`)}
                  type="button"
                  key={`${id}`}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SubContainer>
      <SubContainer>
        <div className="d-flex gap-3 flex-column">
          <div className={titleFlexClassName}>{subtitle}</div>

          <Fragment key={iframeKey}>{content}</Fragment>
        </div>
      </SubContainer>
    </Container>
  );
}
