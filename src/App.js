import "./App.css";
import Container from "@mui/material/Container";
import Navbar from "./Components/Navbar";

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Container maxWidth="xl">
        <Navbar />
      </Container>
    </div>
  );
}
