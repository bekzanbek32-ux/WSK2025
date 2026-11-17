import { Component } from "react";
import { ErrorState } from "./States";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Keep the technical details in the console for debugging.
    console.error("Unexpected UI error", error, info);
  }

  render() {
    const { error } = this.state;

    if (!error) return this.props.children;

    return (
      <main className="page">
        <div className="container">
          <ErrorState
            title="Что-то пошло не так"
            description="Интерфейс столкнулся с непредвиденной ошибкой. Обновите страницу — данные сохранятся."
          />
          <div style={{ display: "flex", justifyContent: "center", marginTop: -36, paddingBottom: 40 }}>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => window.location.reload()}
            >
              Обновить страницу
            </button>
          </div>
        </div>
      </main>
    );
  }
}
