import { useParams } from "react-router-dom";
import GameMessages from "../GameMessages";

function GamePage() {

const { gameId } = useParams();

return (
<GameMessages gameId={gameId} />
)
}

export default GamePage;
