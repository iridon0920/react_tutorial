import React from "react";
import { Link } from "react-router-dom";
import { Game } from "../component/game";

export const GamePage: React.VFC = () => {
  return (
    <section>
      <div>
        <Game />
      </div>
      <div>
        <Link to="/"> トップページへ</Link>
      </div>
    </section>
  );
};
