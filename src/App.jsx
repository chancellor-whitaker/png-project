import ImageUploader from "./ImageUploader";
import Container from "./Container";

const { SubContainer } = Container;

export default function App() {
  return (
    <Container>
      <SubContainer>
        <ImageUploader></ImageUploader>
      </SubContainer>
    </Container>
  );
}
