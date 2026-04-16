import { useState } from "react";

import ImageUploader from "./ImageUploader";
import Container from "./Container";

const { SubContainer } = Container;

const tabs = [
  {
    subtitle: "Trim, center, and square PNGs for sticker-ready uploads",
    content: <ImageUploader></ImageUploader>,
    title: "Sticker Prep",
    id: 0,
  },
  {
    subtitle: "Drop your ideas—your sticker might get made live",
    title: "Submit Request",
    id: 1,
  },
  {
    subtitle: "Browse, vote, and track incoming sticker ideas",
    title: "Request Feed",
    id: 2,
  },
  {
    subtitle: "Explore the full collection of finished stickers",
    title: "My Stickers",
    id: 3,
  },
];

// make sure titles & subtitles of tabs are accurate
// need content for each tab
// will you be using an iframe to handle the pCloud links?
// want to use willie sleepy emoji as favicon

export default function App() {
  const [tabId, setTabId] = useState(() => tabs[0].id);

  const activeTab = tabs.find((tab) => tab.id === tabId);

  return (
    <Container>
      <SubContainer>
        <h1>TwoWhit Sticker Hub</h1>
      </SubContainer>
      <SubContainer>
        <div aria-label="Basic example" className="btn-group" role="group">
          {tabs.map(({ title, id }) => (
            <button
              className={["btn btn-primary", id === tabId && "active"]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setTabId(id)}
              type="button"
              key={id}
            >
              {title}
            </button>
          ))}
        </div>
      </SubContainer>
      <SubContainer>
        <h2>{activeTab.subtitle}</h2>
      </SubContainer>
      <SubContainer>{activeTab.content}</SubContainer>
    </Container>
  );
}
